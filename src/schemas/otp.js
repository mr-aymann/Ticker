const pool = require('../config/db');

class OTP {
    // Store OTP for a user with an expiry time
    static async storeOTP(userId, otp, otpExpiresAt) {
        await pool.query(
            'INSERT INTO otp_requests (user_id, otp, otp_expires_at) VALUES ($1, $2, $3)',
            [userId, otp, otpExpiresAt]
        );
    }

    // Verify OTP for a user and ensure it is not expired
    static async verifyOTP(userId, otp) {
        const result = await pool.query(
            'SELECT * FROM otp_requests WHERE user_id = $1 AND otp = $2 AND otp_expires_at > CURRENT_TIMESTAMP',
            [userId, otp]
        );
        return result.rows[0];
    }

    
    // Function to clear OTP after successful verification or expiration
    static async clearOTP(userId) {
        await pool.query(
            'UPDATE users SET otp = NULL, otp_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
            [userId]
        );
    }
}

module.exports = OTP;
