// models/transactionModel.js
const { addTransaction, getAllTransactions } = require('../services/supabaseService')

// Save a new transaction
async function saveTransaction(transaction) {
  return await addTransaction(transaction)
}

// Fetch all transactions
async function fetchAllTransactions(uid) {
  return await getAllTransactions(uid)
}

module.exports = { saveTransaction, fetchAllTransactions }
