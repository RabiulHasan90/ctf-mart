const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/products", require("./src/routes/products"));
app.use("/api/orders", require("./src/routes/orders"));
app.use("/api/reviews", require("./src/routes/reviews"));
app.use("/api/admin", require("./src/routes/admin"));

// Health check
app.get("/api/health", (req, res) => {
	res.json({ success: true, message: "Server is running" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`);
	server.close(() => process.exit(1));
});
