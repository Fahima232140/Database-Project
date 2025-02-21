require("dotenv").config();  // ✅ Load environment variables at the top!
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session'); 
const passport = require('./config/passport'); 
const bodyParser = require("body-parser");
const mongoose = require('./mongo');

// ✅ Import Routes
const checkSessionRoutes = require('./routes/checkSessionRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userActivityRoutes = require('./routes/user_activityRoutes');
const userActivityController = require('./controllers/user_activityController');

let refreshTokenRoutes, logoutRoutes, authRoutes, bookingRoutes;
try {
    refreshTokenRoutes = require('./routes/refreshTokenRoutes');
    logoutRoutes = require('./routes/logoutRoutes');
    authRoutes = require('./routes/authRoutes');
    bookingRoutes = require('./routes/bookingRoutes'); 
} catch (err) {
    console.error("❌ Route import failed:", err);
    process.exit(1);
}

// ✅ Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Ensure Stripe API key is loaded AFTER dotenv
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("🔑 Stripe Secret Key Loaded");

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// ✅ Single CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// ✅ Debugging Request Logger (Remove in Production)
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// ✅ Set up Handlebars
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'hbs');

// ✅ Routes for rendering pages (No authentication required)
app.get('/signup', (req, res) => res.render('signup'));
app.get('/home', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/booking', (req, res) => res.render('booking')); 
app.get('/payment', (req, res) => res.render('payment')); 
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/', (req, res) => res.send('Server is running...'));

// ✅ Dashboard & User Activity Routes (Authentication Removed)
app.get("/dashboard", (req, res) => res.render("dashboard"));
app.get("/user_activity", (req, res) => res.render("user_activity"));

// ✅ API Routes (Authentication Removed for Testing)
app.use('/api/auth', authRoutes);
app.use('/api/refresh-token', refreshTokenRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/booking', bookingRoutes);  
app.use('/api/payment', paymentRoutes);  
app.use('/api/user', userActivityRoutes); 

// ✅ Change Password Route (No Authentication Required)
app.post('/changePassword', userActivityController.changePassword);

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Environment Debugging (Remove in Production)
console.log("📧 Email User:", process.env.EMAIL_USER);
console.log("🔑 Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
