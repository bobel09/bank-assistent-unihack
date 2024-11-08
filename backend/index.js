// index.js
const express = require('express')
const transactionRoutes = require('./routes/transactionRoutes.js')
const { simulateTransaction } = require('./controllers/transactionController.js')
require('dotenv').config()

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api/transactions', transactionRoutes)

// Schedule a transaction every minute
setInterval(() => {
  simulateTransaction(null, { json: () => {} }) // Trigger without request/response
}, 60000)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
