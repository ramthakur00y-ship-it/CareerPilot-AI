const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const mongoose = require("mongoose");

const Job = require("./models/Job");


// ==========================================
// Jobs Data
// ==========================================

const jobs = [

    {
        title: "Java Full Stack Developer",

        company: "Tech Solutions",

        location: "Noida",

        jobType: "Full Time",

        experience: "Fresher",

        skills: [
            "Java",
            "Spring Boot",
            "HTML",
            "CSS",
            "JavaScript",
            "SQL",
            "Git"
        ],

        description:
            "Java Full Stack Developer role involving frontend and backend development.",

        applyLink:
            "https://example.com/apply"
    },


    {
        title: "Frontend Developer",

        company: "Web Technologies",

        location: "Remote",

        jobType: "Full Time",

        experience: "Fresher",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Git"
        ],

        description:
            "Frontend development role working with modern web technologies.",

        applyLink:
            "https://example.com/apply"
    },


    {
        title: "Backend Java Developer",

        company: "Software Systems",

        location: "Bangalore",

        jobType: "Full Time",

        experience: "Fresher",

        skills: [
            "Java",
            "Spring Boot",
            "REST API",
            "SQL",
            "Git"
        ],

        description:
            "Backend development role using Java and Spring Boot.",

        applyLink:
            "https://example.com/apply"
    },


    {
        title: "Full Stack Developer",

        company: "Digital Labs",

        location: "Pune",

        jobType: "Full Time",

        experience: "Fresher",

        skills: [
            "Java",
            "JavaScript",
            "HTML",
            "CSS",
            "MongoDB",
            "SQL",
            "Git"
        ],

        description:
            "Full Stack Developer role involving web application development.",

        applyLink:
            "https://example.com/apply"
    },


    {
        title: "Junior Web Developer",

        company: "WebWorks",

        location: "Remote",

        jobType: "Internship",

        experience: "Fresher",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Git"
        ],

        description:
            "Junior web development opportunity for freshers.",

        applyLink:
            "https://example.com/apply"
    }

];


// ==========================================
// Insert Jobs into MongoDB
// ==========================================

async function seedJobs() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected"
        );


        // Remove old jobs

        await Job.deleteMany({});


        // Insert new jobs

        await Job.insertMany(jobs);


        console.log(
            "Jobs inserted successfully"
        );


        // Close MongoDB connection

        await mongoose.connection.close();


    } catch (error) {

        console.log(
            "Error inserting jobs:"
        );

        console.log(error);

    }

}


// Run function

seedJobs();