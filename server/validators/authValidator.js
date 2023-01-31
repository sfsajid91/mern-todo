const { body } = require('express-validator');
const User = require('../models/userModel');

const signupValidator = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .custom(async (email) => {
            const user = await User.findOne({ email }).lean().exec();
            if (user) {
                throw new Error('Email already exists');
                // return Promise.reject('Email already exists');
            }
            return true;
        })
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .isStrongPassword()
        .withMessage('Password must be contain a number, a special character and a capital letter'),

    body('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters')
        .isLength({ max: 15 })
        .withMessage('Name must be less than 15 characters')
        .escape()
        .trim(),
];

const loginValidator = [
    body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
];

module.exports = { signupValidator, loginValidator };