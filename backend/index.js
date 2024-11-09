// index.js
const express = require('express')
const transactionRoutes = require('./routes/transactionRoutes.js')
const ocrRoutes = require('./routes/ocrRoutes.js')
const spendingRoutes = require('./routes/spendingRoutes.js')
const { simulateTransaction } = require('./controllers/transactionController.js')
const chatRoutes = require('./routes/chatRoutes')

require('dotenv').config()

const app = express()
const PORT = 3000



app.use(express.json())
app.use('/api/transactions', transactionRoutes)
app.use('/api', ocrRoutes);
app.use('/api/spending', spendingRoutes)
app.use('/api/chat', chatRoutes)

// Schedule a transaction every minute
// setInterval(() => {
//   simulateTransaction(null, { json: () => {} }) // Trigger without request/response
// }, 60000)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
