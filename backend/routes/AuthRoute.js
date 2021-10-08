const router = require('express').Router();
const AuthController = require("../Controllers/Auth-controller.js")
router.post('/api/auth/send-otp', AuthController.sendOtp);
router.post('/api/auth/verify-otp',AuthController.verifyOtp);

module.exports = router;