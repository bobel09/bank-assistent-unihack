// models/transactionModel.js
const { addTransaction, getAllTransactions } = require('../services/supabaseService')

// Save a new transaction
async function saveTransaction(transaction) {
  return await addTransaction(transaction)
}

// Fetch all transactions
async function fetchAllTransactions() {
  return await getAllTransactions()
}

module.exports = { saveTransaction, fetchAllTransactions }
