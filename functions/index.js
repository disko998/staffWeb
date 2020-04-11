const functions = require('firebase-functions');
const admin = require('firebase-admin');

// initializes application
admin.initializeApp(functions.config().firebase);

module.exports = {
    ...require("./updateContract/ContractUpdate"),
    ...require("./chatMessages/ChatMessageReceived"),
    ...require("./payments/stripeApis"),
    ...require("./shifts/shifts"),
};


