const { Schema, model } = require('mongoose');

const tokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        expireAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: '10m',
        },
    },
    {
        timestamps: true,
    }
);

const Token = model('Token', tokenSchema);

module.exports = Token;
