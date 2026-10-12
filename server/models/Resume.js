const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    resumeTitle: {
        type: String,
        required: true
    },

    fullName: {
        type: String
    },

    email: {
        type: String
    },

    experience: {
        type: String
    },

    jobType: {
        type: String
    },

    careerGoal: {
        type: String
    },

    skills: {
        type: [String],
        default: []
    },

    summary: {
        type: String
    },

    education: {
        type: String
    },

    workExperience: {
        type: String
    },

    projects: {
        type: String
    },

    certificates: {
        type: String
    },

    // ================= ATS DATA =================

    atsScore: {
        type: Number,
        default: 0
    },

    matchedSkills: {
        type: [String],
        default: []
    },

    missingSkills: {
        type: [String],
        default: []
    },

    matchedKeywords: {
        type: [String],
        default: []
    },

    missingKeywords: {
        type: [String],
        default: []
    }

});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;