const express = require('express');
const authController = require('../controller/authController');
const {
    authenticateToken,
    setSecurityHeaders,
    loginRateLimiter,
    validateUserInput,
} = require('../middleware/auth');

const router = express.Router();


// Register route
router.post('/register', validateUserInput, authController.register);

// Login route with rate limiting
router.post('/login', loginRateLimiter, validateUserInput, authController.login);

// Token refresh route
router.post('/refresh', authController.refresh);

// Logout route
router.post('/logout', authController.logout);

// Protected route example
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected data', user: req.user });
});



router.post('/forget', authController.forgotPassword);

router.post('/verify-otp', authController.verifyOTP);

router.post('/reset-password', authController.resetPassword);


module.exports = router;