const jwt = require('jsonwebtoken');
const RefreshToken = require('../schemas/refreshToken');
const { checkToken } = require('../utils/bloomFilter');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');



// Middleware to authenticate tokens
const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: "No access token found" });
    }
    

    // Verify the access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // Token is invalid or expired
            return res.status(403).json({ message: 'Invalid or expired access token:' ,err});
        }
        
        // If verification is successful, attach user info to the request object
        req.user = user.id;
        next(); // Proceed to the next middleware or route handler
    });
};

// Rate limiter for login requests
const loginRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

// Input validation middleware
const validateUserInput = async (req, res, next) => {
    // Check if either email or phone_no is provided
    const { email, phone_no } = req.body;

    if (!email && !phone_no) {
        return res.status(400).json({ errors: [{ msg: 'Either email or phone number must be provided.' }] });
    }

    if (email) {
        // Check if the email is a valid email format
        await body('email')
            .custom(value => {
                // Regular expression to allow special characters and dots
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) {
                    throw new Error('Invalid email format');
                }
                return true;
            })// Normalize the email
            .run(req);
    }
    
    if (phone_no) {
        await body('phone_no').isMobilePhone().run(req);
    }
    await body('password').isLength({ min: 8 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    authenticateToken,
    //setSecurityHeaders,
    loginRateLimiter,
    validateUserInput,
};
