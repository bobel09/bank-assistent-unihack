
const express = require('express');

const { getTotalSpentHandler, compareSpendingHandler, averageSpendingHandler, monthWithHighestSpendingHandler, recurringPaymentsHandler } = require('../controllers/spendingController');
const verifyToken = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/total-spent', verifyToken, getTotalSpentHandler);
router.post('/compare-spending', verifyToken, compareSpendingHandler);
router.post('/average-spending', verifyToken, averageSpendingHandler);
router.post('/month-highest-spending', verifyToken, monthWithHighestSpendingHandler);
router.post('/recurring-payments', verifyToken, recurringPaymentsHandler);

module.exports = router;