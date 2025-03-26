const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, RefreshToken } = require("../models");

// Access Token 
const generateAccessToken = (user) => {
    const expiresIn = 15 * 60; // 15 seconds
    const expTimestamp = Math.floor(Date.now() / 1000) + expiresIn;

    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            exp: expTimestamp,
        },
        process.env.JWT_SECRET
    );
};

// Refresh Token
const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  
    // Store Refresh Token in DB
    await RefreshToken.create({ userId: user.id, token: refreshToken });
    
    return refreshToken;
  };

// Signup
const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            response: newUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });
        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "Strict",
        });

        res.status(200).json({
            success: true,
            accessToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout
const logout = (req, res) => {
    try {
        res.clearCookie("refreshToken");
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Logout failed" });
    }

};

// RefreshToken
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(403).json({ success: false, message: "Refresh Token Required" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Invalid Refresh Token" });
            }

            const user = await User.findOne({ where: { id: decoded.id } });
            if (!user) {
                return res.status(404).json({ success: false, message: "User Not Found" });
            }

            const newAccessToken = generateAccessToken(user);
            res.json({ success: true, accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { signup, login, logout, refreshToken };
