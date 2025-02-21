const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    cardholder: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    transactionId: { type: String },
    status: { type: String, enum: ["success", "failed"], default: "success" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
