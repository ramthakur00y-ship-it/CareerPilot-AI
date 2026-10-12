const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
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
        type: [String]
    }

});

const User = mongoose.model("User", userSchema);

module.exports = User;