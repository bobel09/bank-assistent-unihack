// routes/chatRoutes.js
const express = require('express')
const { handleUserQuery } = require('../controllers/chatController')

const router = express.Router()

// Route for user query to OpenAI
router.post('/query', handleUserQuery)

module.exports = router
