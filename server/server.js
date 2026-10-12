const cors = require("cors");
const dns = require("dns");

// MongoDB Atlas DNS issue ke liye
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
const atsRoutes = require("./routes/ats");
const aiRoutes = require("./routes/ai");
const jobRoutes = require("./routes/job");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:");
        console.log(error);
    });


// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "CareerPilot AI Backend is running"
    });
});


// Health Check
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


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobRoutes);


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});