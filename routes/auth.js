
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");

const router = express.Router();

// Seller Signup API
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters."
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      !name.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid name and email."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const existingSeller = await Seller.findByEmail(
      req.app.locals.db,
      normalizedEmail
    );

    if (existingSeller) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const seller = await Seller.create(req.app.locals.db, {
      name: normalizedName,
      email: normalizedEmail,
      password
    });

    return res.status(201).json({
      success: true,
      message: "Seller account created successfully.",
      seller
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create account."
    });
  }
});


// Seller Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid login details."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const seller = await Seller.findByEmailForLogin(
      req.app.locals.db,
      normalizedEmail
    );

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      seller.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: seller.id,
        email: seller.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to login."
    });
  }
});

module.exports = router;
