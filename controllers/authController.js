const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: "Server error" });
        db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hash],
            (err) => {
                if (err) return res.status(400).json({ error: "User already exists" });
                res.json({ message: "User registered successfully" });
            }
        );
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ error: "User not found" });
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (!isMatch) return res.status(400).json({ error: "Incorrect password" });
            const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ message: "Logged in successfully", token });
        });
    });
};
