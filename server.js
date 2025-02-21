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
const { engine } = require('express-handlebars');

// ✅ Import Routes
const checkSessionRoutes = require('./routes/checkSessionRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userActivityRoutes = require('./routes/userActivityRoutes');
const adminRoutes = require("./routes/adminRoutes");

// ✅ Import Controllers
const userActivityController = require('./controllers/userActivityController');

// ✅ Ensure Stripe API key is loaded AFTER dotenv
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("🔑 STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);

// ✅ Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ MongoDB Connection via mongo.js
require('./mongo');

// ✅ Set up Handlebars (HBS)
app.set('views', path.join(__dirname, 'templates'));
app.engine('hbs', engine({ extname: 'hbs', defaultLayout: false }));
app.set('view engine', 'hbs');

// ✅ Routes for rendering pages
app.use("/admin", adminRoutes);
app.use("/user-activity", userActivityRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/refresh-token', require('./routes/refreshTokenRoutes'));
app.use('/api/logout', require('./routes/logoutRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userActivityRoutes);

app.get("/dashboard", (req, res) => res.render("dashboard", { layout: false }));
app.get("/userActivity", (req, res) => res.render("userActivity", { layout: false }));
app.get("/signup", (req, res) => res.render("signup", { layout: false }));
app.get("/home", (req, res) => res.render("home", { layout: false }));
app.get("/login", (req, res) => res.render("login"));
app.get("/booking", (req, res) => res.render("booking", { layout: false }));
app.get("/payment", (req, res) => res.render("payment", { layout: false }));
app.get("/about", (req, res) => res.render("about", { layout: false }));
app.get("/contact", (req, res) => res.render("contact", { layout: false }));
app.get("/", (req, res) => res.send("Server is running..."));

// ✅ Change Password Route (No Authentication Required)
if (userActivityController && userActivityController.changePassword) {
    
} else {
    console.error("❌ Error: userActivityController.changePassword is not defined!");
}

// ✅ Debugging Request Logger (Remove in Production)
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
