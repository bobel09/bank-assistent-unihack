// utils/transactionGenerator.js
function generateRandomTransaction() {
    return {
      uid: ['1IDAHxOppbeXEfs11FpfdOqgn333','AxkozPyZ2OXab6viMS8I2rKXyd82', 'YWbpGxYI70ZMnD8ELSfdyiGsULu2', 'qKR9YP02TZQ7vSC9xBHVw27nnmY2','q5kc0RfLAHb3lesdz8nk1uHmaoe2'][Math.floor(Math.random() * 5)],
      amount: parseFloat((Math.random() * 100).toFixed(2)),
      currency: 'RON',
      mcc_code: ['5411', '5812', '4111','5311','5814','5541','7011','4812','5944','7298'][Math.floor(Math.random() * 10)],
      date: new Date().toISOString()
    }
  }
  
  module.exports = { generateRandomTransaction }
  