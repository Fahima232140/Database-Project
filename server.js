require("dotenv").config();  // ✅ Load environment variables at the top!

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const mongoose = require('./mongo');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Ensure Stripe API key is loaded AFTER dotenv

// Logging Stripe key
console.log("🔑 STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);

// Create express app
const app = express();

// Middleware configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Logger for incoming requests
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Routes
const checkSessionRoutes = require('./routes/checkSessionRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const filterRoutes = require("./routes/filter");
const flightRoutes = require('./routes/flightsRoutes'); // Ensure path is correct
app.use('/api/flights', flightRoutes);

// Mounting API routes
app.use('/api/auth', checkSessionRoutes); // Available at /api/auth/check-session
app.use('/api/payment', paymentRoutes); 
app.use('/api/filter', filterRoutes);

// Dynamic imports for routes (error-handling)
let refreshTokenRoutes, logoutRoutes, authRoutes, bookingRoutes;
try {
    refreshTokenRoutes = require('./routes/refreshTokenRoutes');
    logoutRoutes = require('./routes/logoutRoutes');
    authRoutes = require('./routes/authRoutes');
    bookingRoutes = require('./routes/bookingRoutes');
} catch (err) {
    console.error("❌ Route import failed:", err);
    process.exit(1); // Exit if any route import fails
}

// Mounting other API routes
app.use('/api/auth', authRoutes);
app.use('/api/refresh-token', refreshTokenRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/booking', bookingRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars template engine configuration
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'hbs');

// Route for rendering pages
app.get('/signup', (req, res) => res.render('signup'));
app.get('/home', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/booking', (req, res) => res.render('booking')); // Booking page
app.get('/payment', (req, res) => res.render('payment')); // Payment page
app.get('/about', (req, res) => res.render('about')); // About page
app.get('/contact', (req, res) => res.render('contact')); // Contact page

// Root route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Log Email credentials
console.log("📧 Email User:", process.env.EMAIL_USER);
console.log("🔑 Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
