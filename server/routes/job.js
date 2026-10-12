const express = require("express");

const auth = require("../middleware/auth");
const Job = require("../models/Job");
const User = require("../models/User");

const router = express.Router();


// ==========================================
// Get All Jobs
// ==========================================

router.get(
    "/",
    auth,

    async (req, res) => {

        try {

            const jobs = await Job.find()
                .sort({
                    createdAt: -1
                });

            res.json({

                message: "Jobs fetched successfully",

                count: jobs.length,

                jobs: jobs

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                message: "Failed to fetch jobs",

                error: error.message

            });

        }

    }
);


// ==========================================
// Search / Filter Jobs
// ==========================================

router.get(
    "/search",
    auth,

    async (req, res) => {

        try {

            const keyword =
                req.query.keyword || "";

            const location =
                req.query.location || "";

            const jobType =
                req.query.jobType || "";


            let filter = {};


            // Keyword filter

            if (keyword) {

                filter.$or = [

                    {
                        title: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        company: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        skills: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        description: {
                            $regex: keyword,
                            $options: "i"
                        }
                    }

                ];

            }


            // Location filter

            if (location) {

                filter.location = {

                    $regex: location,

                    $options: "i"

                };

            }


            // Job type filter

            if (jobType) {

                filter.jobType = {

                    $regex: jobType,

                    $options: "i"

                };

            }


            const jobs = await Job.find(filter)
                .sort({
                    createdAt: -1
                });


            res.json({

                message:
                    "Jobs searched successfully",

                count: jobs.length,

                jobs: jobs

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                message: "Job search failed",

                error: error.message

            });

        }

    }
);


// ==========================================
// Get Single Job
// ==========================================

router.get(
    "/:id",
    auth,

    async (req, res) => {

        try {

            const job = await Job.findById(
                req.params.id
            );


            if (!job) {

                return res.status(404).json({

                    message: "Job not found"

                });

            }


            res.json({

                message:
                    "Job fetched successfully",

                job: job

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                message: "Failed to fetch job",

                error: error.message

            });

        }

    }
);


// ==========================================
// Job Recommendations
// ==========================================

router.get(
    "/recommendations/me",
    auth,

    async (req, res) => {

        try {

            // Get logged-in user

            const user = await User.findById(
                req.userId
            );


            if (!user) {

                return res.status(404).json({

                    message: "User not found"

                });

            }


            const userSkills =
                (user.skills || []).map(
                    skill => skill.toLowerCase()
                );


            const careerGoal =
                (user.careerGoal || "")
                    .toLowerCase();


            const jobs = await Job.find();


            const recommendedJobs = jobs.map(job => {

                let score = 0;

                const jobSkills =
                    (job.skills || []).map(
                        skill => skill.toLowerCase()
                    );


                // Skill matching

                for (
                    let i = 0;
                    i < userSkills.length;
                    i++
                ) {

                    if (
                        jobSkills.includes(
                            userSkills[i]
                        )
                    ) {

                        score += 10;

                    }

                }


                // Career goal matching

                if (
                    careerGoal &&
                    job.title
                        .toLowerCase()
                        .includes(careerGoal)
                ) {

                    score += 20;

                }


                // Keep score between 0 and 100

                if (score > 100) {

                    score = 100;

                }


                return {

                    job: job,

                    matchScore: score

                };

            });


            // Highest matching jobs first

            recommendedJobs.sort(
                (a, b) =>
                    b.matchScore - a.matchScore
            );


            res.json({

                message:
                    "Job recommendations generated successfully",

                jobs: recommendedJobs

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Failed to generate job recommendations",

                error: error.message

            });

        }

    }
);


module.exports = router;