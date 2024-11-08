// utils/transactionGenerator.js
function generateRandomTransaction() {
    return {
      uid: `user-${Math.floor(Math.random() * 1000)}`,
      amount: parseFloat((Math.random() * 100).toFixed(2)),
      currency: 'USD',
      mcc_code: ['5411', '5812', '5814'][Math.floor(Math.random() * 3)],
      category: ['grocery', 'dining', 'entertainment'][Math.floor(Math.random() * 3)],
      date: new Date().toISOString().split('T')[0]
    }
  }
  
  module.exports = { generateRandomTransaction }
  