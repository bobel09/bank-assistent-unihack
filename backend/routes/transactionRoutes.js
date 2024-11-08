// routes/transactionRoutes.js
const express = require('express')
const { simulateTransaction, getTransactions } = require('../controllers/transactionController')

const router = express.Router()

// Route to simulate a transaction
router.get('/simulate', simulateTransaction)

// Route to fetch all transactions
router.get('/', getTransactions)

module.exports = router
