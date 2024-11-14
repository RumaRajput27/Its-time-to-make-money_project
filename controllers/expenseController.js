const db = require('../config/db');

exports.addExpense = (req, res) => {
    const { description, amount, date } = req.body;
    const user_id = req.user.id;
    db.query(
        "INSERT INTO expenses (user_id, description, amount, date) VALUES (?, ?, ?, ?)",
        [user_id, description, amount, date],
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Expense added successfully" });
        }
    );
};

exports.getExpenses = (req, res) => {
    const user_id = req.user.id;
    db.query("SELECT * FROM expenses WHERE user_id = ?", [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
};
