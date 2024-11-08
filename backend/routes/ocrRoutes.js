// routes/ocrRoutes.js
const express = require('express');
const { handleOCR } = require('../controllers/ocrController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/ocr', uploadMiddleware, handleOCR);

module.exports = router;
