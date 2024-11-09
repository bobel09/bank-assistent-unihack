// controllers/transactionController.js
const { saveTransaction, fetchAllTransactions } = require('../models/transactionModel')
const { generateRandomTransaction } = require('../utils/transactionGenerator')

// Simulate and save a random transaction
async function simulateTransaction(req, res) {
  const transaction = generateRandomTransaction()
  const { data, error } = await saveTransaction(transaction)
  if (error) {
    if (res) res.status(500).json({ error: "Error saving transaction" })
    console.error("Error saving transaction:", error)
  } else {
    if (res) res.json({ success: true, transaction: data })
    console.log("Simulated transaction saved:", data)
  }
}

// Fetch all transactions
async function getTransactions(req, res) {
  const uid = req.user.uid
  const { data, error } = await fetchAllTransactions(uid)
  if (error) {
    res.status(500).json({ error: "Error fetching transactions" })
  } else {
    res.json({ success: true, transactions: data })
  }
}

module.exports = { simulateTransaction, getTransactions }
