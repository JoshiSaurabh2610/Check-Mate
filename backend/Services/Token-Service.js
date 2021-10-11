const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../models/refreshToken-model");
const accessSecret = process.env.JWT_ACESS_TOKEN_SECRET;
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '1m' });
        const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '1y' });
        return { accessToken, refreshToken };
    }

    async storeRefreshToken(refreshToken, userId) {
        try {
            await refreshTokenModel.create({
                refreshToken,
                userId,
            })
        } catch (err) {
            console.log(err);
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessSecret);
    }

    async verifyRefreshToken(token) {
        return jwt.verify(token, refreshSecret);
    }

    async findRefreshToken(userId, refreshToken) {
        return refreshTokenModel.findOne({ refreshToken, userId })
    }

    async updateRefreshToken(userId, refreshToken) {
        return await refreshTokenModel.updateOne({ userId: userId }, { refreshToken: refreshToken });
    }

}

module.exports = new TokenService();