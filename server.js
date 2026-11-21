
require("dotenv").config();

const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const dashboardRoutes = require("./routes/dashboard");

const Seller = require("./models/Seller");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log("Request body:", req.body);
    next();
});

// Frontend static files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);

let pool;

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Database Test Route
app.get("/test-db", async (req, res) => {
    try {
        const [result] = await pool.execute(
            "INSERT INTO db_test (message) VALUES (?)",
            ["Seller Website Builder database is working!"]
        );

        res.json({
            success: true,
            message: "MySQL read/write successful!",
            insertId: result.insertId
        });

    } catch (error) {
        console.error("Database test error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database operation failed."
        });
    }
});

// Start Server
async function startServer() {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10
        });

        app.locals.db = pool;

        await pool.query("SELECT 1");

        await Seller.createSellerTable(pool);
        console.log("Seller table ready!");

        await Product.createProductTable(pool);
        console.log("Products table ready!");

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS db_test (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("MySQL connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MySQL connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
