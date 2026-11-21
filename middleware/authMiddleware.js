
const jwt = require("jsonwebtoken");

function authenticateSeller(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please login first."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.seller = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired login session. Please login again."
        });
    }
}

module.exports = authenticateSeller;
