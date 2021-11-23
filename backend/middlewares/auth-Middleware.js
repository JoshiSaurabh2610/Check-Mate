const TokenService = require("../Services/Token-Service");

module.exports = async function (req, res, next) {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new Error();
        }
        const userData = await TokenService.verifyAccessToken(accessToken);
        if (!userData) {
            throw new Error();
        }
        req.userId = userData.id;
        console.log(userData,req.userId);
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: "Token Expires, Login Again" });
    }

}