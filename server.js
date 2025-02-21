require("dotenv").config();  // ✅ Load environment variables

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const mongoose = require('./mongo'); // MongoDB connection setup
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Stripe API key

// Logging Stripe key for debugging
console.log("🔑 STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);

// Create an Express app
const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Define the frontend URL
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logger middleware for incoming requests
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Import and use the routes
const flightRoutes = require('./routes/flightRoutes');
const checkSessionRoutes = require('./routes/checkSessionRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const filterRoutes = require("./routes/filter");
const adminRoutes = require("./routes/adminRoutes");
const userActivityRoutes = require('./routes/userActivityRoutes');
app.use('/api/flights', flightRoutes);
app.use('/api/auth', checkSessionRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/filter', filterRoutes);
app.use("/admin", adminRoutes);
app.use("/user-activity", userActivityRoutes);

// Setup Handlebars as the view engine
app.set('views', path.join(__dirname, 'templates'));
app.engine('hbs', require('express-handlebars').engine({ extname: 'hbs', defaultLayout: false }));
app.set('view engine', 'hbs');

// Define routes for rendering HTML pages
app.get('/signup', (req, res) => res.render('signup'));
app.get('/home', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/booking', (req, res) => res.render('booking'));
app.get('/payment', (req, res) => res.render('payment'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/dashboard', (req, res) => res.render('dashboard', { layout: false }));
app.get("/userActivity", (req, res) => res.render("userActivity", { layout: false }));

// Root route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Log email credentials for debugging
console.log("📧 Email User:", process.env.EMAIL_USER);
console.log("🔑 Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
