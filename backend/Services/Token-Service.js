const jwt = require("jsonwebtoken");

class TokenService {
    generateTokens(payload) {
        const acessToken = jwt.sign(payload, process.env.JWT_ACESS_TOKEN_SECRET,{expiresIn:'1h'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET,{expiresIn:'1y'});
        return {acessToken,refreshToken};
    }
}

module.exports = new TokenService();