const express = require('express');
const { addExpense, getExpenses } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authMiddleware, addExpense);
router.get('/list', authMiddleware, getExpenses);

module.exports = router;
