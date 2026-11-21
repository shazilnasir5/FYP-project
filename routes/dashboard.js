
const express = require("express");
const authenticateSeller = require("../middleware/authMiddleware");
const Product = require("../models/product");

const router = express.Router();

// Protected Seller Dashboard API
router.get("/", authenticateSeller, async (req, res) => {
    try {
        const pool = req.app.locals.db;

        // Get total products for the logged-in seller
        const totalProducts = await Product.countBySeller(
            pool,
            req.seller.id
        );

        return res.status(200).json({
            success: true,
            message: "Dashboard data loaded successfully.",
            seller: {
                id: req.seller.id,
                email: req.seller.email
            },
            stats: {
                totalProducts: Number(totalProducts)
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load dashboard."
        });
    }
});

module.exports = router;
