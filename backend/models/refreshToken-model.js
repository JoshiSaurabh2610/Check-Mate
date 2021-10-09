const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenScehma = new Schema(
    {
        refreshToken: { type: String, required: true },
        userId: {type: Schema.Types.ObjectId, ref: 'User'}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('refreshToken', refreshTokenScehma, 'tokens');

