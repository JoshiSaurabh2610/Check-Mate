const UserDTO = require("../dtos/userDTO");
const User = require("../models/User-model");
const EmailService = require("../Services/Email-service");
const HashService = require("../Services/Hash-service");
const OTPService = require("../Services/OTP-service");
const TokenService = require("../Services/Token-service");
const Jimp = require('jimp');
const RefreshToken = require("../models/refreshToken-model");
const path = require('path');
const fs = require('fs');
const downloadAxios = require("../Services/downloadAxios");

const { OAuth2Client } = require('google-auth-library');

class AuthController {
    async sendOTP(req, res) {
        // Steps 
        const { email, name } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(404).json({ msg: "User Already Exists" });
            // return next(new ErrorResponse("User Already Exists", 401));
        }
        // 1. generate OTP 
        const OTP = OTPService.generateOtp();
        console.log(OTP);

        // 2. Create hash -> email,OTP,expiry 
        const ttl = 1000 * 60 * 2; // time to last - 2 mins
        const expiry = Date.now() + ttl;
        console.log(expiry);
        const data = `${email}.${OTP}.${expiry}`;
        const hash = HashService.hashOTP(data);
        console.log(hash);
        // 3. OTP send to email
        const msg = `
            <h1>Authentication  Code </h1>
            <p>Dear username,<br/>
            Welecom to Techiec Code <br/>
            This Code is Valid for only 2mins <br/>
            Authentication Code (OTP): ${OTP}
            Techies Code <br/>
            </p>
        `
        try {
            // await EmailService.sendEmail({
            //     toEmail: email,
            //     toName: name,
            //     subject: "Authentication Techies Code",
            //     text: msg
            // });

            // 4. send res(hash,email)
            res.status(200).json({
                hash: `${hash}$_${expiry}`,
                email,
                name
            });
        } catch (err) {
            // console.log("email not send");
            console.log(err);
            return res.status(500).json({ msg: 'Email could not send, Try again after some time' });
        }
    }

    async register(req, res) {
        const { hash, email, name, OTP, password } = req.body;
        if (!email || !hash || !OTP || !password || !name)
            return res.status(404).json({ msg: "All Fields are Required" });

        // step 1 fetch old hash and expriy from req
        const [OldHash, expiry] = hash.split('$_');
        console.log(expiry, Date.now());
        // Step 2 check validity of OTP
        if (+expiry < Date.now())
            return res.status(404).json({ msg: "OTP Expires" });

        let user;
        const newHash = HashService.hashOTP(`${email}.${OTP}.${expiry}`);
        console.log(OldHash, newHash);
        if (newHash === OldHash) {
            //OTP Verified
            //Register a User
            try {
                // check if user already exists
                user = await User.findOne({ email });
                if (user) {
                    return res.status(404).json({ msg: "User Already Exists" });
                }

                user = await User.create({
                    name, email, password,
                });
            } catch (err) {
                res.status(500).json({
                    sucess: false,
                    msg: err.message,
                })
            }
        } else {
            return res.status(404).json({ msg: "Invalid OTP" });
        }

        // Tokens
        return await TokenService.sendTokens(res, new UserDTO(user));
    }

    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ msg: "plz provide email and password" });
        }
        try {
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                res.status(404).json({ msg: "Invalid credentials" });
            }
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                res.status(400).json({ msg: "Invalid Credentials" })
            }
            console.log('you are logged in');

            return await TokenService.sendTokens(res, new UserDTO(user));

        } catch (err) {
            res.status(500).json({ msg: err.message })
        }
    }

    async setAvatar(req, res) {
        const { NewAvatar } = req.body;
        const buffer = Buffer.from(NewAvatar.split(',')[1], 'base64');
        let newImagePath;
        try {
            const jimpRes = await Jimp.read(buffer);
            newImagePath = `${Date.now()}.${Math.round(Math.random() * 1e9)}.png`;
            jimpRes.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../Storage/${newImagePath}`));

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'could not process the img' });
        }
        // update User 
        try {
            const user = await User.findOne({ _id: req.userId })
            if (!user) {
                return res.status(404).json({ msg: 'user not found' });
            }
            // if avatar already exists then delete that
            if (user.avatar) {
                const oldImagePath = `${path.resolve(__dirname, '..')}${user.avatar}`;
                console.log(__dirname);
                console.log(user.avatar);
                console.log(oldImagePath);
                fs.unlink(oldImagePath, (err) => {
                    if (err)
                        console.log(err);
                    else
                        console.log("Old Avatar Delete Sucessfully");
                })
            }
            user.avatar = `/Storage/${newImagePath}`;
            user.save();
            res.json({ user: new UserDTO(user), auth: true });
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong DB ERROR' });
        }
    }

    async setName(req, res) {
        const { newName } = req.body;
        if (!newName) {
            return res.status(404).json({ msg: "All fields requried" });
        }
        try {
            const user = await User.findOne({ _id: req.userId });
            if (!user) {
                res.status(404).json({ msg: "Not Authorized" });
            }
            user.name = newName;
            user.save();
            const userDto = new UserDTO(user);
            return res.status(200).json({ msg: "Name Updated Sucessfully", user: userDto, auth: true });
        } catch (err) {
            console.log(err, "from setName in auth controller");
            return res.status(500).json({ msg: "internal Server Error, Try after Some time" });
        }
    }

    async refresh(req, res) {
        // 1. extract refreshTOkenfromCookies
        const { refreshToken: refreshTokenFromCookie } = req.cookies;

        // 2. verify refreshToken 
        let userId;
        try {
            const userData = await TokenService.verifyRefreshToken(refreshTokenFromCookie);
            userId = userData.id;
        } catch (err) {
            return res.status(401).json({ msg: "Refresh token Invalid, Login again" });
        }

        // 3. check refreshToken in DB 
        try {
            const token = await RefreshToken.findOne({ userId: userId, refreshToken: refreshTokenFromCookie });
            if (!token) {
                return res.status(401).json({ msg: 'findRefreshToken fails ,invalid Token' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: 'internal server Error' })
        }

        // 4. check user exist for that refresh token or not 
        let user;
        try {
            user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(404).json({ msg: "No user ,Token Invalid" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: 'Internal server Error' })

        }

        // 5. new generate new tokens, update DB and attached in cookies
        return await TokenService.sendTokens(res, new UserDTO(user));
    }

    async logout(req, res) {
        const { refreshToken } = req.cookies;

        // DON"T DELETE TOKEN FORM DB OTHERWISE YOU HAVE TO SAVE AT LOGIN
        // // 1. delete refreshToken from DB
        // try {
        //     await TokenService.removeRefreshToken(refreshToken);
        // } catch (err) {
        //     console.log(err);
        //     res.status(500).json({ msg: "not able to delete refreshToken" });
        // }
        // DON"T DELETE TOKEN FORM DB OTHERWISE YOU HAVE TO SAVE AT LOGIN

        // 2. clear cookies 
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        res.status(200).json({ user: null, auth: false, msg: "Logout Sucessfully" });

    }

    async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            res.status(400).json({ msg: "plz provide email and password" });
        }
        console.log(req.userId);
        try {
            const user = await User.findOne({ _id: req.userId }).select("+password");
            if (!user) {
                res.status(404).json({ msg: "Invalid credentials" });
            }
            const isMatch = await user.matchPassword(oldPassword);
            if (!isMatch) {
                res.status(400).json({ msg: "Invalid Credentials" })
            }
            user.password = newPassword;
            user.save();
            res.status(200).json({ msg: "Password Updated Sucessfully" });
        } catch (err) {
            console.log(err, "from changePassword");
            res.status(500).json({ msg: "Internal Server Error, Try Again after some time" });
        }

    }

    async googleLogin(req, res) {
        const { token } = req.body;
        // console.log("token=", token);
        // Verify the Google TOken
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            console.log({ ...ticket });
            payload = ticket.getPayload();
        } catch (err) {
            console.log(err);
            return res.status(404).json({ msg: "unauthorised" });
        }
        console.log("Checking  user exists or not...");

        // Check if User Already Exists
        let user = await User.findOne({ email: payload.email });
        if (user) {
            // User alreaday exists
            console.log("user Already exists");
            return await TokenService.sendTokens(res, new UserDTO(user));
        }

        // Save Profile image of user
        const imagePath = `${Date.now()}.${Math.round(Math.random() * 1e9)}.png`;
        const filePath = path.resolve(__dirname, `../Storage/${imagePath}`);
        downloadAxios(payload.picture, filePath).then((res) => {
            console.log(res);
        }).catch((err) => {
            return console.log(err, "from google logoin, not save image");
        })

        console.log("Profile Imagte SAved");

        //Register a User
        try {
            user = await User.create({
                name: payload.name,
                email: payload.email,
                avatar: `/Storage/${imagePath}`
            });
        } catch (err) {
            res.status(500).json({
                sucess: false,
                msg: err.message,
            })
        }

        // TOKENS
        return await TokenService.sendTokens(res, new UserDTO(user));
    }

    async forgotPassword(req, res) {
        const { email } = req.body;
        console.log(email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User Not Exists" });
        }

        // 1. Generate ResetToken
        const resetToken = TokenService.generateResetToken({ id: user._id });

        // 2. Create hash -> email,resetToken,expiry 
        const data = `${email}_$_${resetToken}`;
        const hash = HashService.hashOTP(data);
        console.log(hash, email);

        // 3. resetLink send to email
        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}_$_${hash}`;
        const msg = `
            <h1>You have requested a password reset </h1>
            <p>Dear username,<br/>
            We got Request for Reset Password from this account<br/>
            this link if valid for only 10min <br/>
            click below to Reset your password <br/>
            Techies Code <br/>
            </p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        try {
            const result = await EmailService.sendEmail({
                toEmail: email,
                toName: user.name,
                subject: "Authentication Techies Code",
                text: msg
            });

            // 4. send res(hash,email)
            return res.status(200).json({ msg: "Password Reset Link send in your Email. Successfully", result });
        } catch (err) {
            // console.log("email not send");
            console.log(err);
            return res.status(500).json({ msg: 'Email could not send, Try again after some time' });
        }
    }

    async resetPassword(req, res) {
        const { newPassword } = req.body;
        // console.log(newPassword);
        const [resetToken, OldHash] = req.params.resetToken.split('_$_');
        try {
            const { id } = TokenService.verifyResetToken(resetToken);
            const user = await User.findOne({ _id: id });

            const data = `${user.email}_$_${resetToken}`;
            const hash = HashService.hashOTP(data);

            if (hash === OldHash) {
                user.password = newPassword;
                user.save();
                res.status(200).json({ msg: "Password Reset Sucessfully, Login now" });
            } else {
                return res.json({ msg: "UnAuthorised, Don't have Access" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: err });
        }
    }

}
module.exports = new AuthController();