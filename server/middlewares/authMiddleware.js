const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isLogged = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    message: 'Unauthorized',
                });
            }
            return decode;
        });

        const user = await User.findById(decoded.userId).lean().exec();
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        req.user = user;
        return next();
    } catch (err) {
        return next(err);
    }
};

module.exports = { isLogged };
