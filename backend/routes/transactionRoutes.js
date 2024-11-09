// routes/transactionRoutes.js
const express = require('express')
const { simulateTransaction, getTransactions } = require('../controllers/transactionController')
const verifyToken = require('../middleware/authMiddleware')

const router = express.Router()

// Route to simulate a transaction with authentication
router.get('/simulate', verifyToken, simulateTransaction)

// Route to fetch all transactions with authentication
router.get('/', verifyToken, getTransactions)

module.exports = router
