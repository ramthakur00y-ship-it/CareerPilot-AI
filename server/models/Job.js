const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    location: {
        type: String
    },

    jobType: {
        type: String
    },

    experience: {
        type: String
    },

    skills: {
        type: [String]
    },

    description: {
        type: String
    },

    applyLink: {
        type: String
    }

}, {
    timestamps: true
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;