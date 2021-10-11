const router = require('express').Router();
const AuthController = require("../Controllers/Auth-controller.js");
const authMiddleware = require('../middlewares/auth-Middleware.js');
router.post('/api/auth/send-otp', AuthController.sendOtp);
router.post('/api/auth/verify-otp', AuthController.verifyOtp);
router.post('/api/auth/activate', authMiddleware, AuthController.activateUser);
router.get('/api/auth/refresh', AuthController.refresh);
router.post('/api/auth/logout', authMiddleware, AuthController.logout);


module.exports = router;