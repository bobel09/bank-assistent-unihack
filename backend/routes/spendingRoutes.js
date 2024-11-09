
const express = require('express');

const { getTotalSpentHandler } = require('../controllers/spendingController');

const router = express.Router();

router.post('/total-spent', getTotalSpentHandler);

module.exports = router;