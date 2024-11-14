const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
router.post('/create-order', authMiddleware, (req, res) => {
    const amount = 1000;  // Amount in paise (1000 paise = 10 INR)

    // Create an order with Razorpay
    const options = {
        amount: amount,  // Amount to charge in paise
        currency: 'INR',
        receipt: `receipt_${Math.random().toString(36).substr(2, 9)}`,
        notes: {
            description: 'Premium subscription'
        }
    };

    razorpay.orders.create(options, (err, order) => {
        if (err) return res.status(500).json({ error: "Failed to create order" });

        // Send order details to frontend
        res.json({
            id: order.id,
            amount: order.amount
        });
    });
});

// Verify Payment after completion
router.post('/verify-payment', authMiddleware, (req, res) => {
    const { order_id, payment_id, signature } = req.body;

    const generatedSignature = razorpay.utils.generateSignature(order_id, payment_id, process.env.RAZORPAY_KEY_SECRET);

    if (generatedSignature === signature) {
        // Payment successful, mark user as premium
        const user_id = req.user.id;
        db.query("UPDATE users SET premium = 1 WHERE id = ?", [user_id], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Payment successful! Premium account activated." });
        });
    } else {
        res.status(400).json({ error: "Payment verification failed" });
    }
});

module.exports = router;
