const AuthController = require('../Controllers/Auth-controller');
const authMiddleware = require('../middlewares/auth-Middleware');
const router = require('express').Router();

router.post('/api/auth/sendOTP', AuthController.sendOTP);
router.post('/api/auth/register', AuthController.register);
router.post('/api/auth/login', AuthController.login);
router.post('/api/auth/setAvatar', authMiddleware, AuthController.setAvatar);
router.post('/api/auth/logout', authMiddleware, AuthController.logout);
router.get('/api/auth/refresh', AuthController.refresh);
router.patch('/api/auth/changePassword', authMiddleware, AuthController.changePassword);
router.patch('/api/auth/setName', authMiddleware, AuthController.setName);
router.post('/api/auth/googleLogin', AuthController.googleLogin);
router.post('/api/auth/forgotPassword', AuthController.forgotPassword);
router.post('/api/auth/resetPassword/:resetToken', AuthController.resetPassword);


module.exports = router;