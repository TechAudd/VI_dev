const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../models");
dotenv.config();

exports.auth = async (req, res, next) => {
    try {
        // Safely retrieve the token
        const token =
            req.cookies?.token ||
            req.body?.token ||
            (req.header("Authorization")?.startsWith("Bearer ")
                ? req.header("Authorization").replace("Bearer ", "")
                : null);
        if (!token) {
            return res.status(401).json({ success: false, message: "Token Missing" });
        }

        try {
            // Decode token without verifying to check structure
            const decodedToken = jwt.decode(token);
            if (!decodedToken) {
                return res.status(401).json({ success: false, message: "Malformed Token" });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error("JWT Verification Error:", error);
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }
    } catch (error) {
        console.error("Unexpected Error in Auth Middleware:", error);
        return res.status(500).json({ success: false, message: "Error Validating Token" });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const userDetails = await User.findOne({ where: { id: req.user.id } });

        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (userDetails.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
        }

        next();
    } catch (error) {
        console.error("Error in isAdmin Middleware:", error);
        return res.status(500).json({ success: false, message: "Error Verifying User Role" });
    }
};
