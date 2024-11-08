// services/supabaseService.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function addTransaction(transaction) {
  const { data, error } = await supabase.from('transactions').insert([transaction])
  if (error) {
    console.error("Error adding transaction:", error)
  } else {
    console.log("Transaction added:", data)
  }
  return { data, error }
}

async function getAllTransactions() {
  const { data, error } = await supabase.from('transactions').select('*')
  if (error) {
    console.error("Error fetching transactions:", error)
  }
  return { data, error }
}


module.exports = { addTransaction, getAllTransactions, supabase }
