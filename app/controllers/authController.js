const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (username.length < 3) {
        return res.status(400).json({ message: "Username must be 3+ chars" });
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{9,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be 9+ chars with uppercase, lowercase & symbol",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      return res.status(201).json({
        success: true,
        message: "User Registered Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Register Error",
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      return res.json({
        success: true,
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Login Error",
        error: error.message,
      });
    }
  }
}

module.exports = new AuthController();
