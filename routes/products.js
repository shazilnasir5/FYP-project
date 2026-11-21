
const express = require("express");
const Product = require("../models/product");
const authenticateSeller = require("../middleware/authMiddleware");

const router = express.Router();

// All product routes require seller authentication
router.use(authenticateSeller);

// Add Product API
router.post("/add", async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            price === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Product name and price are required."
            });
        }

        if (
            !Number.isFinite(Number(price)) ||
            Number(price) < 0 ||
            (stock !== undefined &&
                (!Number.isInteger(Number(stock)) || Number(stock) < 0))
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid product details."
            });
        }

        const product = await Product.create(req.app.locals.db, {
            seller_id: req.seller.id,
            name: name.trim(),
            description: description || "",
            price: Number(price),
            image: image || "",
            category: category || "General",
            stock: stock === undefined ? 0 : Number(stock)
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product
        });

    } catch (error) {
        console.error("Add product error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to add product."
        });
    }
});

// View Logged-in Seller Products API
router.get("/", async (req, res) => {
    try {
        const products = await Product.findBySeller(
            req.app.locals.db,
            req.seller.id
        );

        res.json({
            success: true,
            products
        });

    } catch (error) {
        console.error("Fetch products error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch products."
        });
    }
});

// Update Product API
router.put("/update/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;

        if (
            !Number.isInteger(productId) ||
            productId <= 0 ||
            typeof name !== "string" ||
            !name.trim() ||
            price === undefined ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0 ||
            (stock !== undefined &&
                (!Number.isInteger(Number(stock)) || Number(stock) < 0))
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid product details."
            });
        }

        const updated = await Product.update(
            req.app.locals.db,
            productId,
            req.seller.id,
            {
                name: name.trim(),
                description: description || "",
                price: Number(price),
                image: image || "",
                category: category || "General",
                stock: stock === undefined ? 0 : Number(stock)
            }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.json({
            success: true,
            message: "Product updated successfully."
        });

    } catch (error) {
        console.error("Update product error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to update product."
        });
    }
});

// Delete Product API
router.delete("/delete/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);

        if (!Number.isInteger(productId) || productId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            });
        }

        const deleted = await Product.remove(
            req.app.locals.db,
            productId,
            req.seller.id
        );

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully."
        });

    } catch (error) {
        console.error("Delete product error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to delete product."
        });
    }
});

module.exports = router;
