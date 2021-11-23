const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken-model");
const accessTokenSecret = process.env.JWT_ACESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const resetTokenSecret = process.env.JWT_RESET_TOKEN_SECRET;
class TokenServices {
    generateTokens = (payload) => {
        const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '1hr' });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '1y' });
        return { accessToken, refreshToken };
    }

    storeRefreshToken = async (refreshToken, userId) => {
        try {
            await RefreshToken.create({ refreshToken, userId });
        } catch (err) {
            console.log(err);
        }
    }

    updateRefreshToken = async (userId, refreshToken) => {
        return await RefreshToken.updateOne({ userId: userId }, { refreshToken: refreshToken }, { upsert: true });
    }

    sendTokens = async (res, user) => {

        //generate new tokens, update DB and attached in cookies
        const { accessToken, refreshToken } = this.generateTokens({ id: user.id });

        // update refresh token in db 
        try {
            await this.updateRefreshToken(user.id, refreshToken);
        } catch (err) {
            return res.status(500).json({ msg: 'internal server Error' });
        }

        // put tokens in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });

        // res send
        res.status(200).json({ user, auth: true });
    }

    generateResetToken = (payload) => {
        return jwt.sign(payload, resetTokenSecret, { expiresIn: '10m' });
    }

    verifyResetToken = (token) => {
        return jwt.verify(token, resetTokenSecret);
    }

    verifyAccessToken(accessToken) {
        return jwt.verify(accessToken, accessTokenSecret);
    }

    verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    async removeRefreshToken(refreshToken) {
        return await RefreshToken.deleteOne({ refreshToken });
    }

};

module.exports = new TokenServices();