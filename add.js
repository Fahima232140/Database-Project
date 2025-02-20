const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://app:xOhA0GVaWKODMz4P@cluster0.bohfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB Atlas!"))
    .catch(err => console.error("❌ Connection Error:", err));

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const Admin = mongoose.model("Admin", adminSchema, "admins"); // Specify collection name

const addAdmin = async () => {
    const newAdmin = new Admin({
        username: "admin",
        email: "admin@example.com",
        password: "$2b$10$fUoHFeCKJNw5l61wHVUDPu76dxH3fbWBZgo0R9MbFSRQIqbq3quD6"
    });

    await newAdmin.save();
    console.log("✅ Admin added successfully!");
    mongoose.connection.close();
};

addAdmin();
