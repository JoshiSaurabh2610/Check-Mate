const HashService = require("../Services/Hash-service");
const OtpService = require("../Services/Otp-service");
const UserService = require("../Services/User-Service");
const TokenService = require("../Services/Token-Service");
const UserDto = require("../dtos/user-dto");
const Jimp = require('jimp');
const path = require('path');

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
            const { accessToken, refreshToken } = TokenService.generateTokens({ id: user._id, activated: false });

            await TokenService.storeRefreshToken(refreshToken, user._id);

            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true
            });

            const userDto = new UserDto(user);
            res.json({ user: userDto, auth: true });

        }
    }

    async activateUser(req, res) {
        const { userName, userAvatar } = req.body;
        if (!userName || !userAvatar) {
            res.status(400).json({ msg: "All Fields are Required" })
        }
        const buffer = Buffer.from(userAvatar.split(',')[1], 'base64');
        let imagePath;
        try {
            const jimpRes = await Jimp.read(buffer);
            imagePath = `${Date.now()}.${Math.round(Math.random() * 1e9)}.png`;
            jimpRes.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../Storage/${imagePath}`));

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'could not process the img' });
        }
        // update User to make it activated
        try {
            const user = await UserService.findUser({ _id: req.user.id })
            if (!user) {
                res.status(404).json({ msg: 'user not found' });
            }
            user.activated = true;
            user.name = userName;
            user.avatar = `/storage/${imagePath}`;
            user.save();
            res.json({ user: new UserDto(user), auth: true })
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong DB ERROR' });
        }

    }

    async refresh(req, res) {
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        // check token is valid
        let userData;
        try {
            userData = await TokenService.verifyRefreshToken(refreshTokenFromCookie);
            // console.log(userData);
            // console.log(userData.id);

        } catch (err) {
            return res.status(401).json({ msg: 'Verification is not done properly! invalid token' });
        }

        // token is in db or not
        try{
            const token = await TokenService.findRefreshToken(userData.id, refreshTokenFromCookie);
            if (!token) {
                return res.status(401).json({ msg: 'findRefreshToken fails ,invalid Token' });
            }

        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: 'internal server Error' });

        }

        // check if valid user
        const user = await UserService.findUser({ _id: userData.id });
        if (!user) {
            return res.status(404).json({ msg: 'No  user' });
        }

        // generate new tokens
        const { accessToken, refreshToken } = TokenService.generateTokens({ id: userData.id });

        // update refresh token in db 
        try {
            await TokenService.updateRefreshToken(userData.id, refreshToken);
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
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }
}

module.exports = new AuthController(); // singleton pattern7