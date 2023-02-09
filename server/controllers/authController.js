const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendEmailConfirmation } = require('../utils/emailSender');
const Token = require('../models/tokenModel');

const User = require('../models/userModel');

/*
 * @desc    Sign up a user and send email confirmation
 * @route   POST /api/v1/auth/signup
 * @access  Public
 * @params  email, password, name
 */
const signUp = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.mapped(),
            });
        }
        const existingUser = await User.findOne({ email }).lean().exec();

        if (existingUser) {
            return res.status(400).json({
                error: {
                    email: 'Email already exists',
                },
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.EMAIL_TOKEN_EXPIRE_IN,
        });

        const modifiedToken = token.replaceAll('.', 'DOT');

        const sentEmail = await sendEmailConfirmation(name, email, modifiedToken, {
            title: 'Email Confirmation',
            link: 'verify',
            text: 'Please click the link below to verify your email',
        });

        if (!sentEmail) {
            const err = new Error("Couldn't sent email");
            err.statusCode = 500;
            throw err;
        }
        await Token.create({ token });

        // finding roles array with the value admin in the database
        const userRole = await User.findOne({ roles: { $in: ['ADMIN'] } });

        if (!userRole) {
            await User.create({ email, password: hashedPassword, name, roles: ['USER', 'ADMIN'] });
            return res.status(201).json({
                message: 'Account created successfully',
            });
        }

        await User.create({ email, password: hashedPassword, name });

        return res.status(201).json({
            message: 'Account created successfully',
        });
    } catch (err) {
        return next(err);
    }
};

/*
 * @desc    Login a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 * @params  email, password, name
 */

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.mapped(),
            });
        }

        const user = await User.findOne({ email }).lean().exec();
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials',
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({
                message: 'Invalid credentials',
            });
        }

        if (!user.verified) {
            return res.status(406).json({
                error: {
                    email: 'Please verify your email',
                },
            });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });

        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        });

        return res
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: process.env.REFRESH_TOKEN_COOKIE_VALIDITY,

                secure: true,
                sameSite: 'none',
            })
            .json({
                message: 'Logged in successfully',
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                },
            });
    } catch (err) {
        return next(err);
    }
};

/*
 * @desc    Refresh token controller
 * @route   POST /api/v1/auth/login
 * @access  Public
 * @params  email, password, name
 */

const refreshController = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        // console.log(refreshToken);
        if (!refreshToken) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decode) => {
                if (err) {
                    return null;
                }
                return decode;
            }
        );

        if (!decoded) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const user = await User.findById(decoded.userId).lean().exec();
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });

        return res.status(201).json({
            message: 'Token refreshed successfully',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        return next(err);
    }
};

const logout = async (_req, res, next) => {
    try {
        return res.clearCookie('refreshToken').json({
            message: 'Logged out successfully',
        });
    } catch (err) {
        return next(err);
    }
};

const emailVerification = async (req, res, next) => {
    try {
        const { token: oldToken } = req.params;
        const token = oldToken.replaceAll('DOT', '.');
        const hasToken = await Token.findOne({ token });
        if (!hasToken) {
            const err = new Error('The URL you are looking for does not exist');
            err.status = 404;
            throw err;
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    const data = jwt.decode(token);
                    return {
                        expired: true,
                        userId: data.userId,
                    };
                }
                return false;
            }
            return decode;
        });

        if (!decoded) {
            return res.status(400).json({
                message: 'Invalid token',
            });
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid token',
            });
        }

        user.verified = true;
        await user.save();
        await hasToken.deleteOne();

        return res.status(201).json({
            message: 'Email verified successfully',
        });
    } catch (err) {
        return next(err);
    }
};

// forgot password controller

const getForgotPass = async (req, res, next) => {
    try {
        const { email } = req.body;
        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.mapped(),
            });
        }
        const user = await User.findOne({ email }).lean().exec();
        if (!user) {
            return res.status(400).json({
                message: 'Email does not exist',
            });
        }

        const existingToken = await Token.findOne({ user: user._id }).lean().exec();

        if (existingToken) {
            return res.status(400).json({
                message: 'Email already sent please try again later',
            });
        }

        const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        });

        const modifiedToken = token.replaceAll('.', 'DOT');

        const sentEmail = await sendEmailConfirmation(user.name, email, modifiedToken, {
            title: 'Reset Password',
            link: 'reset-password',
            text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process within 10 minutes of receiving it:',
        });

        if (!sentEmail) {
            const err = new Error("Couldn't sent email");
            err.statusCode = 500;
            throw err;
        }

        await Token.create({ token, user: user._id });

        return res.status(201).json({
            message: 'Email sent successfully',
        });
    } catch (err) {
        return next(err);
    }
};

const validToken = async (req, res, next) => {
    try {
        const { token: oldToken } = req.params;
        const token = oldToken.replaceAll('DOT', '.');

        const hasToken = await Token.findOne({ token }).lean().exec();

        if (!hasToken) {
            const err = new Error('The URL you are looking for does not exist');
            err.status = 404;
            throw err;
        }

        return res.status(201).json({
            message: 'Token is valid',
        });
    } catch (err) {
        return next(err);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token: oldToken } = req.params;
        const { password } = req.body;
        const token = oldToken.replaceAll('DOT', '.');

        const hasToken = await Token.findOne({ token }).exec();

        if (!hasToken) {
            const err = new Error('The URL you are looking for does not exist');
            err.status = 404;
            throw err;
        }

        const user = await User.findById(hasToken.user).exec();

        if (!user) {
            return res.status(400).json({
                message: 'Invalid token',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        await hasToken.deleteOne();

        return res.status(201).json({
            message: 'Password reset successfully',
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    signUp,
    login,
    refreshController,
    logout,
    emailVerification,
    getForgotPass,
    resetPassword,
    validToken,
};
