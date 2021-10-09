const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../models/refreshToken-model");

class TokenService {
    generateTokens(payload) {
        const acessToken = jwt.sign(payload, process.env.JWT_ACESS_TOKEN_SECRET,{expiresIn:'1h'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET,{expiresIn:'1y'});
        return {acessToken,refreshToken};
    }

    async storeRefreshToken(refreshToken,userId){
        try {
            await refreshTokenModel.create({
                refreshToken,
                userId,
            })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new TokenService();