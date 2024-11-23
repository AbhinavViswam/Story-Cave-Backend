const paypal = require('paypal-rest-sdk');

// Configure PayPal with sandbox credentials
paypal.configure({
    mode: 'sandbox', // Change to 'live' for production
    client_id: process.env.PAYPAL_CLIENT_ID, // Replace with your sandbox client ID
    client_secret:process.env.PAYPAL_CLIENT_SECRET , // Replace with your sandbox client secret
});

module.exports = paypal;
