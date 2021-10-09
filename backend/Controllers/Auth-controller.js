const HashService = require("../Services/Hash-service");
const OtpService = require("../Services/Otp-service");
const UserService = require("../Services/User-Service");
const TokenService = require("../Services/Token-Service");
const UserDto = require("../dtos/user-dto");

class AuthController {

    async sendOtp(req, res) {
        const { phoneNo } = req.body;
        if (!phoneNo) {
            res.status(400).json({ msg: "Phone Field is required" });
            return;
        }

        const OTP = await OtpService.generateOtp();
        console.log(OTP);
        // hashing the OTP
        const ttl = 1000 * 60 * 2 //time to last = 2min
        const expires = Date.now() + ttl;
        const data = `${phoneNo}.${OTP}.${expires}`;
        const Hash = HashService.hashOtp(data);

        //Send OTP
        try {
            // await OtpService.sendBySMS(phoneNo, OTP);
            return res.status(200).json({
                hash: `${Hash}_${expires}`,
                phoneNo,
            })
        } catch (err) {
            // console.log(err);
            res.status(500).json({ msg: 'message Sending Failed' })
            return;
        }

        res.status(200).json({ Hash });
    }

    async verifyOtp(req, res) {
        const { phoneNo, hash, OTP } = req.body;
        if (!phoneNo || !hash || !OTP) {
            res.status(404).json({ msg: "All Fields are Required" });
            return;
        }

        const [hashOTP, expires] = hash.split("_");
        if (Date.now() > +expires)
            res.status(400).json({ msg: "OTP Expires" });

        const data = `${phoneNo}.${OTP}.${expires}`;
        const isValid = OtpService.verifyOtp(hashOTP, data);
        if (!isValid)
            res.status(404).json({ msg: "InValid OTP" });
        else {
            let user;
            try {
                user = await UserService.findUser({ phone: phoneNo });
                if (!user) {
                    user = await UserService.createUser({ phone: phoneNo });
                }
            } catch (err) {
                console.log(err);
                res.status(500).json({ msg: "DB Error" });
            }

            //Token
            const { acessToken, refreshToken } = TokenService.generateTokens({ id: user._id, activated: false });

            await TokenService.storeRefreshToken(refreshToken, user._id);

            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });

            res.cookie('acessToken', acessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });

            const userDto = new UserDto(user);
            res.json({ user: userDto, auth: true });

        }
    }
}

module.exports = new AuthController(); // singleton pattern7