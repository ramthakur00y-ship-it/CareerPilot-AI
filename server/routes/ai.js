const express = require("express");
const Groq = require("groq-sdk");

const auth = require("../middleware/auth");
const Resume = require("../models/Resume");

const router = express.Router();


// ==========================================
// Groq AI
// ==========================================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// ==========================================
// Test AI
// ==========================================

router.post(
    "/test",
    auth,

    async (req, res) => {

        try {

            const prompt = req.body.prompt;

            if (!prompt) {

                return res.status(400).json({
                    message: "Prompt is required"
                });

            }

            const completion =
                await groq.chat.completions.create({

                    model: "openai/gpt-oss-20b",

                    messages: [

                        {
                            role: "system",

                            content:
                                "You are a helpful AI career assistant for a resume analyzer application."
                        },

                        {
                            role: "user",

                            content: prompt
                        }

                    ],

                    temperature: 0.3

                });

            const answer =
                completion.choices[0].message.content;

            res.json({

                message:
                    "AI response generated successfully",

                answer: answer

            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                message: "AI request failed",

                error: error.message

            });

        }

    }
);


// ==========================================
// AI Resume Suggestions
// ==========================================

router.post(
    "/suggestions",
    auth,

    async (req, res) => {

        try {

            const resumeId = req.body.resumeId;

            if (!resumeId) {

                return res.status(400).json({
                    message: "resumeId is required"
                });

            }


            const resume = await Resume.findOne({

                _id: resumeId,

                userId: req.userId

            });


            if (!resume) {

                return res.status(404).json({
                    message: "Resume not found"
                });

            }


            const resumeText = `

Name:
${resume.fullName || ""}

Email:
${resume.email || ""}

Experience:
${resume.experience || ""}

Job Type:
${resume.jobType || ""}

Career Goal:
${resume.careerGoal || ""}

Skills:
${(resume.skills || []).join(", ")}

Summary:
${resume.summary || ""}

Education:
${resume.education || ""}

Work Experience:
${resume.workExperience || ""}

Projects:
${resume.projects || ""}

Certificates:
${resume.certificates || ""}

`;


            const prompt = `

Analyze the following resume for a fresher/full-stack developer.

Resume:

${resumeText}

Give useful and practical resume improvement suggestions.

Cover these points:

1. Summary improvement
2. Skills improvement
3. Project improvement
4. Education section improvement
5. Missing technical skills
6. ATS keyword suggestions
7. Overall resume improvement

Do not invent information about the candidate.

Keep the suggestions simple and suitable for a fresher.

Give the response in this format:

SUMMARY:
...

SKILLS:
...

PROJECTS:
...

EDUCATION:
...

MISSING SKILLS:
...

ATS KEYWORDS:
...

OVERALL SUGGESTIONS:
...

`;


            const completion =
                await groq.chat.completions.create({

                    model: "openai/gpt-oss-20b",

                    messages: [

                        {
                            role: "system",

                            content:
                                "You are an AI resume expert helping students improve their resumes for software development jobs."
                        },

                        {
                            role: "user",

                            content: prompt
                        }

                    ],

                    temperature: 0.3

                });


            const suggestions =
                completion.choices[0].message.content;


            res.json({

                message:
                    "AI resume suggestions generated successfully",

                resumeId: resume._id,

                suggestions: suggestions

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Failed to generate AI resume suggestions",

                error: error.message

            });

        }

    }
);


// ==========================================
// AI Cover Letter
// ==========================================

router.post(
    "/cover-letter",
    auth,

    async (req, res) => {

        try {

            const resumeId = req.body.resumeId;
            const jobDescription = req.body.jobDescription;


            // Check resume ID

            if (!resumeId) {

                return res.status(400).json({

                    message: "resumeId is required"

                });

            }


            // Check job description

            if (!jobDescription) {

                return res.status(400).json({

                    message:
                        "jobDescription is required"

                });

            }


            // Find resume of logged-in user

            const resume = await Resume.findOne({

                _id: resumeId,

                userId: req.userId

            });


            if (!resume) {

                return res.status(404).json({

                    message: "Resume not found"

                });

            }


            // Prepare resume information

            const resumeText = `

Name:
${resume.fullName || ""}

Email:
${resume.email || ""}

Experience:
${resume.experience || ""}

Job Type:
${resume.jobType || ""}

Career Goal:
${resume.careerGoal || ""}

Skills:
${(resume.skills || []).join(", ")}

Summary:
${resume.summary || ""}

Education:
${resume.education || ""}

Work Experience:
${resume.workExperience || ""}

Projects:
${resume.projects || ""}

Certificates:
${resume.certificates || ""}

`;


            // AI prompt

            const prompt = `

You are an AI career assistant.

Create a professional and personalized cover letter
for the candidate using the resume and job description below.

CANDIDATE RESUME:

${resumeText}


JOB DESCRIPTION:

${jobDescription}


Instructions:

1. Write a professional cover letter.
2. Make it suitable for a fresher if the candidate has no experience.
3. Mention relevant skills from the resume.
4. Mention relevant projects from the resume when useful.
5. Connect the candidate's skills with the job description.
6. Do not invent companies, experience, skills, projects or achievements.
7. Do not claim that the candidate has experience if the resume says fresher.
8. Keep the letter concise and professional.
9. Do not add fake contact information.
10. Do not use markdown headings such as "Cover Letter".

Return only the final cover letter.

`;


            // Call Groq AI

            const completion =
                await groq.chat.completions.create({

                    model: "openai/gpt-oss-20b",

                    messages: [

                        {
                            role: "system",

                            content:
                                "You are a professional AI assistant that creates honest and personalized job application cover letters."
                        },

                        {
                            role: "user",

                            content: prompt
                        }

                    ],

                    temperature: 0.3

                });


            const coverLetter =
                completion.choices[0].message.content;


            // Send response

            res.json({

                message:
                    "AI cover letter generated successfully",

                resumeId: resume._id,

                coverLetter: coverLetter

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Failed to generate AI cover letter",

                error: error.message

            });

        }

    }
);


module.exports = router;