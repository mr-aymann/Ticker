const pool = require('../config/db');

class RefreshToken {
    static async createRefreshToken(userId, token, expiresAt) {
        const result = await pool.query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
            [userId, token, expiresAt]
        );
        return result.rows[0];
    }

    static async findRefreshToken(token) {
        const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
        return result.rows[0];
    }

    static async deleteRefreshToken(token) {
        await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
    }

    static async deleteRefreshTokensByUserId(userId) {
        await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
    }
}

module.exports = RefreshToken;
