const moment = require("moment");
const OTP = require("../schemas/otp");
const RefreshToken = require("../schemas/refreshToken");
const User = require("../schemas/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { addToken } = require("../utils/bloomFilter");
const { sendMail } = require("../utils/mailSender");

dotenv.config();

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const authController = {
  register: async (req, res) => {
    const { email, phone_no, password } = req.body;
    try {
      const user = await User.createUser(email, phone_no, password);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
  },

  login: async (req, res) => {
    const { email, password, phone_no } = req.body;
    try {
      const user = email
        ? await User.findUserByEmail(email)
        : await User.findUserByPhone(phone_no);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = generateAccessToken(user);
      console.log("accesToken", accessToken); // Log the fetched user
      const refreshToken = generateRefreshToken(user);
      const expiresAt = moment().add(7, "days").toISOString();

      await RefreshToken.createRefreshToken(user.id, refreshToken, expiresAt);
      addToken(accessToken); // Add to Bloom filter

      res.status(200).json({ "accessToken":accessToken, "refreshToken":refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  },

  refresh: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    const storedToken = await RefreshToken.findRefreshToken(refreshToken);
    if (!storedToken) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = generateAccessToken({ id: user.id });
        addToken(accessToken); // Add new access token to Bloom filter
        res.json({ accessToken });
      }
    );
  },

  logout: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    await RefreshToken.deleteRefreshToken(refreshToken);
    res.sendStatus(204);
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findUserByEmail(email);
      console.log(email)
      if (!user) return res.status(404).json({ message: "User not found" });

      // Generate OTP and expiry time
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = moment().add(10, "minutes").toISOString();

      // Store OTP in the database
      await OTP.storeOTP(user.id, otp, otpExpiresAt);

      // Send OTP to user's email
      await sendMail({
        to: email,
        subject: "Password Reset OTP",
        html: `<p>Your OTP for password reset is <strong>${otp}</strong>. This OTP is valid for 10 minutes.</p>`,
        text: `Your OTP for password reset is ${otp}. This OTP is valid for 10 minutes.`,
      });

      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error sending OTP", error: error.message });
    }
  },

  verifyOTP: async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = await User.findUserByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Verify OTP
      const validOTP = await OTP.verifyOTP(user.id, otp);
      if (!validOTP)
        return res.status(400).json({ message: "Invalid or expired OTP" });

      res
        .status(200)
        .json({ message: "OTP verified. Proceed to reset password" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error verifying OTP", error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
      const user = await User.findUserByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Verify OTP again before resetting password
      const validOTP = await OTP.verifyOTP(user.id, otp);
      if (!validOTP)
        return res.status(400).json({ message: "Invalid or expired OTP" });

      // Hash the new password and update in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(user.id, hashedPassword);

      // Clear OTP after password reset
      await OTP.clearOTP(user.id);

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error resetting password", error: error.message });
    }
  },
};

module.exports = authController;
