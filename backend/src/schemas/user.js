const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async createUser(email, phone_no, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, phone_no, password) VALUES ($1, $2, $3) RETURNING *',
            [email, phone_no, hashedPassword]
        );
        return result.rows[0];
    }

    static async findUserByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log(result.rows[0])
        return result.rows[0];
    }

    static async findUserByPhone(phone_no) {
        const result = await pool.query('SELECT * FROM users WHERE phone_no = $1', [phone_no]);
        return result.rows[0];
    }

    static async updatePassword(userId, hashedPassword) {
        await pool.query(
            'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [hashedPassword, userId]
        );
    }
}

module.exports = User;
