const dns = require("dns");

// Google/Cloudflare DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:");
        console.log(error);
    });

// Basic server test
app.get("/", (req, res) => {
    res.json({
        message: "CareerPilot AI Backend is running"
    });
});

// MongoDB health check
app.get("/api/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState;

    if (dbStatus === 1) {
        res.json({
            server: "OK",
            database: "MongoDB Connected",
            status: "Healthy"
        });
    } else {
        res.status(500).json({
            server: "OK",
            database: "MongoDB Not Connected",
            status: "Unhealthy"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});