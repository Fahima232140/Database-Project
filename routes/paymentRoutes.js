const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");

router.post("/process", async (req, res) => {
    try {
        const { cardholder, amount, currency } = req.body;

        if (!cardholder || !amount) {
            return res.status(400).json({ error: "Missing payment details" });
        }

        // Simulating Stripe Payment (or use actual Stripe API)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: currency || "usd",
            payment_method_types: ["card"],
        });

        // Save payment details to MongoDB
        const newPayment = new Payment({
            cardholder,
            amount,
            currency: currency || "usd",
            transactionId: paymentIntent.id,
            status: "success"
        });

        await newPayment.save();

        res.json({ success: true, message: "Payment successful!", transactionId: paymentIntent.id });

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ success: false, error: "Payment processing failed" });
    }
});

module.exports = router;
