const express = require("express");

const Resume = require("../models/Resume");

const auth = require("../middleware/auth");

const router = express.Router();


// ===============================
// CREATE RESUME
// ===============================

router.post("/", auth, async (req, res) => {

    try {

        const resume = new Resume({

            userId: req.userId,

            resumeTitle: req.body.resumeTitle,

            fullName: req.body.fullName,

            email: req.body.email,

            experience: req.body.experience,

            jobType: req.body.jobType,

            careerGoal: req.body.careerGoal,

            skills: req.body.skills,

            summary: req.body.summary,

            education: req.body.education,

            workExperience: req.body.workExperience,

            projects: req.body.projects,

            certificates: req.body.certificates

        });


        await resume.save();


        res.status(201).json({

            message: "Resume created successfully",

            resume: resume

        });

    } catch (error) {

        res.status(500).json({

            message: "Resume creation failed",

            error: error.message

        });

    }

});


// ===============================
// GET ALL USER RESUMES
// ===============================

router.get("/", auth, async (req, res) => {

    try {

        const resumes = await Resume.find({
            userId: req.userId
        });


        res.json(resumes);

    } catch (error) {

        res.status(500).json({

            message: "Could not get resumes",

            error: error.message

        });

    }

});


// ===============================
// GET SINGLE RESUME
// ===============================

router.get("/:id", auth, async (req, res) => {

    try {

        const resume = await Resume.findOne({

            _id: req.params.id,

            userId: req.userId

        });


        if (!resume) {

            return res.status(404).json({

                message: "Resume not found"

            });

        }


        res.json(resume);

    } catch (error) {

        res.status(500).json({

            message: "Could not get resume",

            error: error.message

        });

    }

});


// ===============================
// UPDATE RESUME
// ===============================

router.put("/:id", auth, async (req, res) => {

    try {

        const resume = await Resume.findOneAndUpdate(

            {
                _id: req.params.id,

                userId: req.userId
            },

            req.body,

            {
                new: true
            }

        );


        if (!resume) {

            return res.status(404).json({

                message: "Resume not found"

            });

        }


        res.json({

            message: "Resume updated successfully",

            resume: resume

        });

    } catch (error) {

        res.status(500).json({

            message: "Resume update failed",

            error: error.message

        });

    }

});


// ===============================
// DELETE RESUME
// ===============================

router.delete("/:id", auth, async (req, res) => {

    try {

        const resume = await Resume.findOneAndDelete({

            _id: req.params.id,

            userId: req.userId

        });


        if (!resume) {

            return res.status(404).json({

                message: "Resume not found"

            });

        }


        res.json({

            message: "Resume deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: "Resume deletion failed",

            error: error.message

        });

    }

});


module.exports = router;