const express = require("express");
const { signup, login, logout, refreshToken } = require("../controllers/authController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ✅ SIGNUP ROUTE
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User Signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/signup", signup);

// ✅ LOGIN ROUTE
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);

// ✅ LOGOUT ROUTE
router.post("/logout", logout);

// ✅ REFRESH TOKEN ROUTE
router.get("/refreshToken", refreshToken);

// ✅ PROTECTED ROUTE
router.get("/protected-route", auth, (req, res) => {
    res.json({ success: true, message: "Access to protected route granted", user: req.user });
});

module.exports = router;
