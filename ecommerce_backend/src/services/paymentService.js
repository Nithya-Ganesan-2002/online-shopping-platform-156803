const { v4: uuidv4 } = require('uuid');
const PaymentLog = require('../models/PaymentLog');

/**
 * PUBLIC_INTERFACE
 * capturePayment
 * Simulate payment capture with a mock provider.
 * In the future, integrate real providers such as Stripe/Adyen by branching here.
 */
async function capturePayment({ amount, currency = process.env.PAYMENT_CURRENCY || 'USD', orderId, provider = 'mock' }) {
  const transactionId = uuidv4();
  const request = { amount, currency, orderId, provider };

  // Mock successful response
  const response = { id: transactionId, status: 'succeeded', amount, currency, provider };

  await PaymentLog.create({
    provider,
    order: orderId,
    request,
    response,
    status: 'success',
  });

  return {
    provider,
    status: 'captured',
    transactionId,
    amount,
    currency,
  };
}

module.exports = {
  capturePayment,
};
