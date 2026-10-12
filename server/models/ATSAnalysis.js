const mongoose = require("mongoose");

const atsAnalysisSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume"
    },

    resumeFileName: {
        type: String
    },

    jobDescription: {
        type: String,
        required: true
    },

    atsScore: {
        type: Number,
        required: true
    },

    matchedKeywords: {
        type: [String]
    },

    missingKeywords: {
        type: [String]
    },

    matchedSkills: {
        type: [String]
    },

    missingSkills: {
        type: [String]
    },

    resumeText: {
        type: String
    }

}, {
    timestamps: true
});

const ATSAnalysis = mongoose.model(
    "ATSAnalysis",
    atsAnalysisSchema
);

module.exports = ATSAnalysis;