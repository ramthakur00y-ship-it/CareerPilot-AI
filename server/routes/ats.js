const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const { PDFParse } = require("pdf-parse");
const { createWorker } = require("tesseract.js");

const auth = require("../middleware/auth");
const ATSAnalysis = require("../models/ATSAnalysis");
const Resume = require("../models/Resume");

const router = express.Router();

// =====================================================
// MULTER
// =====================================================

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

// =====================================================
// NORMALIZE TEXT
// =====================================================

function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201c\u201d]/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}

// =====================================================
// WORDS
// =====================================================

function getWords(text) {
    return normalizeText(text)
        .replace(/[^a-z0-9+#.\- ]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 2);
}

// =====================================================
// PDF TEXT EXTRACTION
// =====================================================

async function extractPDFText(file) {
    try {
        const parser = new PDFParse({
            data: file.buffer
        });

        const result = await parser.getText();

        await parser.destroy();

        return result.text || "";
    } catch (error) {
        console.log(
            "PDF TEXT EXTRACTION ERROR:",
            error.message
        );

        return "";
    }
}

// =====================================================
// OCR
// =====================================================

async function extractTextUsingOCR(file) {
    console.log("--------------------------------------");
    console.log("OCR STARTED");
    console.log("--------------------------------------");

    let worker = null;
    let document = null;

    try {
        const { pdf } = await import("pdf-to-img");

        const pdfData =
            "data:application/pdf;base64," +
            file.buffer.toString("base64");

        document = await pdf(pdfData, {
            scale: 3
        });

        worker = await createWorker("eng");

        let completeText = "";
        let pageNumber = 0;

        for await (const image of document) {
            pageNumber++;

            console.log(
                `OCR PAGE ${pageNumber}`
            );

            const result =
                await worker.recognize(image);

            const pageText =
                result.data.text || "";

            console.log(
                `OCR PAGE ${pageNumber} TEXT LENGTH:`,
                pageText.length
            );

            completeText += "\n" + pageText;
        }

        await worker.terminate();
        worker = null;

        if (
            document &&
            typeof document.destroy === "function"
        ) {
            await document.destroy();
        }

        document = null;

        console.log("--------------------------------------");
        console.log("OCR COMPLETED");
        console.log(
            "OCR TEXT LENGTH:",
            completeText.length
        );
        console.log("--------------------------------------");

        return completeText;

    } catch (error) {
        console.log(
            "OCR ERROR:",
            error.message
        );

        if (worker) {
            try {
                await worker.terminate();
            } catch (e) {
                console.log(
                    "WORKER TERMINATE ERROR:",
                    e.message
                );
            }
        }

        if (
            document &&
            typeof document.destroy === "function"
        ) {
            try {
                await document.destroy();
            } catch (e) {
                console.log(
                    "PDF DESTROY ERROR:",
                    e.message
                );
            }
        }

        return "";
    }
}

// =====================================================
// EXTRACT RESUME TEXT
// =====================================================

async function extractResumeText(file) {

    const fileName =
        file.originalname.toLowerCase();

    // -------------------------------------------------
    // PDF
    // -------------------------------------------------

    if (fileName.endsWith(".pdf")) {

        console.log(
            "Trying normal PDF text extraction..."
        );

        let text =
            await extractPDFText(file);

        console.log(
            "NORMAL PDF TEXT LENGTH:",
            text.length
        );

        if (
            text &&
            text.trim().length >= 50
        ) {

            console.log(
                "TEXT PDF DETECTED"
            );

            return text;
        }

        console.log(
            "SCANNED PDF DETECTED"
        );

        text =
            await extractTextUsingOCR(file);

        return text;
    }

    // -------------------------------------------------
    // DOCX
    // -------------------------------------------------

    if (fileName.endsWith(".docx")) {

        try {

            const result =
                await mammoth.extractRawText({
                    buffer: file.buffer
                });

            return result.value || "";

        } catch (error) {

            console.log(
                "DOCX EXTRACTION ERROR:",
                error.message
            );

            return "";
        }
    }

    return "";
}

// =====================================================
// COMMON SKILLS
// =====================================================

const commonSkills = [
    "java",
    "python",
    "javascript",
    "typescript",
    "html",
    "css",
    "react",
    "angular",
    "vue",
    "node.js",
    "node",
    "express",
    "mongodb",
    "mysql",
    "sql",
    "oracle",
    "postgresql",
    "spring",
    "spring boot",
    "hibernate",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "c++",
    "c",
    "php",
    "laravel",
    "django",
    "flask",
    "machine learning",
    "artificial intelligence",
    "generative ai",
    "rest api",
    "api",
    "microservices",
    "data structures",
    "algorithms",
    "oop",
    "dbms",
    "software engineering",
    "prompt engineering",
    "groq api",
    "llm",
    "llms",
    "kafka",
    "junit",
    "maven",
    "gradle",
    "bootstrap",
    "tailwind",
    "next.js",
    "nextjs",
    "redux",
    "firebase",
    "redis",
    "jenkins",
    "kubernetes"
];

// =====================================================
// ESCAPE REGEX
// =====================================================

function escapeRegex(text) {
    return String(text).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}

// =====================================================
// FIND SKILLS
// =====================================================

function findSkills(text) {

    const lowerText =
        normalizeText(text);

    const foundSkills = [];

    commonSkills.forEach(skill => {

        const escapedSkill =
            escapeRegex(skill);

        const regex =
            new RegExp(
                "(^|[^a-z0-9+#])" +
                escapedSkill +
                "([^a-z0-9+#]|$)",
                "i"
            );

        if (regex.test(lowerText)) {
            foundSkills.push(skill);
        }
    });

    return [
        ...new Set(foundSkills)
    ];
}

// =====================================================
// JOB TITLE NORMALIZATION
// =====================================================

function normalizeJobTitle(text) {

    return normalizeText(text)
        .replace(
            /\bdevloper\b/g,
            "developer"
        )
        .replace(
            /\bdevelopr\b/g,
            "developer"
        )
        .replace(
            /\bengg\b/g,
            "engineer"
        );
}

// =====================================================
// KEYWORD MATCH
// =====================================================

function calculateKeywordMatch(
    resumeText,
    jobDescription
) {

    const resumeWords =
        new Set(
            getWords(resumeText)
        );

    const jobWords = [
        ...new Set(
            getWords(jobDescription)
        )
    ];

    const ignoredWords = new Set([
        "the",
        "and",
        "for",
        "with",
        "you",
        "your",
        "are",
        "this",
        "that",
        "from",
        "have",
        "has",
        "will",
        "our",
        "job",
        "role",
        "work",
        "years",
        "year",
        "skills",
        "experience",
        "candidate",
        "looking",
        "required",
        "using",
        "about",
        "into",
        "their",
        "they",
        "who",
        "should",
        "must",
        "need",
        "preferred",
        "responsibilities",
        "requirements",
        "good",
        "strong",
        "knowledge",
        "ability",
        "working",
        "team",
        "including",
        "also",
        "such",
        "like",
        "based",
        "build",
        "building",
        "develop",
        "development"
    ]);

    const usefulWords =
        jobWords.filter(
            word =>
                !ignoredWords.has(word)
        );

    const matchedKeywords = [];
    const missingKeywords = [];

    usefulWords.forEach(word => {

        if (resumeWords.has(word)) {
            matchedKeywords.push(word);
        } else {
            missingKeywords.push(word);
        }
    });

    let keywordScore = 0;

    if (usefulWords.length > 0) {

        keywordScore =
            (
                matchedKeywords.length /
                usefulWords.length
            ) * 100;
    }

    return {
        keywordScore,
        matchedKeywords,
        missingKeywords
    };
}

// =====================================================
// SKILL MATCH
// =====================================================

function calculateSkillMatch(
    resumeText,
    jobDescription
) {

    const resumeSkills =
        findSkills(resumeText);

    const jobSkills =
        findSkills(jobDescription);

    const matchedSkills =
        jobSkills.filter(
            skill =>
                resumeSkills.includes(skill)
        );

    const missingSkills =
        jobSkills.filter(
            skill =>
                !resumeSkills.includes(skill)
        );

    let skillScore = 0;

    if (jobSkills.length > 0) {

        skillScore =
            (
                matchedSkills.length /
                jobSkills.length
            ) * 100;

    } else {

        skillScore = 0;
    }

    return {
        resumeSkills,
        jobSkills,
        matchedSkills,
        missingSkills,
        skillScore
    };
}

// =====================================================
// SECTION SCORE
// =====================================================

function calculateSectionScore(
    resumeText
) {

    const text =
        normalizeText(resumeText);

    const sections = {

        contact:
            /email|phone|mobile|linkedin|github|leetcode/.test(
                text
            ),

        summary:
            /summary|profile|objective|career objective/.test(
                text
            ),

        education:
            /education|degree|bachelor|master|mca|bca|b\.?sc/.test(
                text
            ),

        experience:
            /experience|employment|work history|internship/.test(
                text
            ),

        projects:
            /project|projects/.test(
                text
            ),

        skills:
            /skills|technical skills|technologies/.test(
                text
            ),

        certificates:
            /certificate|certification|certifications/.test(
                text
            )
    };

    const totalSections =
        Object.keys(sections).length;

    const foundSections =
        Object.values(sections)
            .filter(Boolean)
            .length;

    return (
        foundSections /
        totalSections
    ) * 100;
}

// =====================================================
// JOB TITLE SCORE
// =====================================================

function calculateJobTitleScore(
    resumeText,
    jobDescription
) {

    const resume =
        normalizeJobTitle(resumeText);

    const jd =
        normalizeJobTitle(jobDescription);

    const jobTitles = [

        "full stack developer",
        "frontend developer",
        "backend developer",
        "software developer",
        "software engineer",
        "java developer",
        "python developer",
        "web developer",
        "data analyst",
        "data scientist",
        "devops engineer",
        "android developer",
        "mobile application developer"
    ];

    let detectedTitle = null;

    for (const title of jobTitles) {

        if (jd.includes(title)) {

            detectedTitle = title;

            break;
        }
    }

    if (!detectedTitle) {
        return 50;
    }

    if (resume.includes(detectedTitle)) {
        return 100;
    }

    if (
        detectedTitle === "java developer"
    ) {

        if (resume.includes("java")) {
            return 50;
        }
    }

    if (
        detectedTitle.includes("developer") &&
        resume.includes("developer")
    ) {
        return 50;
    }

    return 0;
}

// =====================================================
// EXPERIENCE REQUIREMENT
// =====================================================

function extractRequiredYears(
    jobDescription
) {

    const jd =
        normalizeText(jobDescription);

    const patterns = [

        /(\d+)\s*\+?\s*years?/,

        /minimum\s*(\d+)\s*years?/,

        /at least\s*(\d+)\s*years?/,

        /(\d+)\s*-\s*(\d+)\s*years?/
    ];

    for (const pattern of patterns) {

        const match =
            jd.match(pattern);

        if (match) {

            return Number(match[1]);
        }
    }

    return null;
}

// =====================================================
// RESUME EXPERIENCE
// =====================================================

function extractResumeYears(
    resumeText
) {

    const text =
        normalizeText(resumeText);

    const patterns = [

        /(\d+)\s*\+?\s*years?\s*(of)?\s*experience/,

        /experience\s*[:\-]?\s*(\d+)\s*years?/
    ];

    for (const pattern of patterns) {

        const match =
            text.match(pattern);

        if (match) {

            return Number(match[1]);
        }
    }

    return 0;
}

// =====================================================
// EXPERIENCE SCORE
// =====================================================

function calculateExperienceScore(
    resumeText,
    jobDescription
) {

    const jd =
        normalizeText(jobDescription);

    const requiredYears =
        extractRequiredYears(jd);

    const resumeYears =
        extractResumeYears(resumeText);

    const fresherJob =
        /fresher|entry level|fresh graduate|0\s*(to|-)\s*1\s*years?/.test(
            jd
        );

    if (fresherJob) {
        return 100;
    }

    if (requiredYears === null) {
        return 100;
    }

    if (
        resumeYears >= requiredYears
    ) {
        return 100;
    }

    if (resumeYears === 0) {
        return 20;
    }

    return Math.round(
        (
            resumeYears /
            requiredYears
        ) * 100
    );
}

// =====================================================
// EDUCATION SCORE
// =====================================================

function calculateEducationScore(
    resumeText,
    jobDescription
) {

    const resume =
        normalizeText(resumeText);

    const jd =
        normalizeText(jobDescription);

    const educationTerms = [

        "bachelor",
        "bachelor's",
        "master",
        "master's",
        "b.tech",
        "btech",
        "m.tech",
        "mtech",
        "mca",
        "bca",
        "b.sc",
        "bsc",
        "computer science",
        "computer applications"
    ];

    const requiredEducation =
        educationTerms.filter(
            term =>
                jd.includes(term)
        );

    if (
        requiredEducation.length === 0
    ) {
        return 100;
    }

    const matched =
        requiredEducation.some(
            term =>
                resume.includes(term)
        );

    return matched ? 100 : 0;
}

// =====================================================
// CONTENT SCORE
// =====================================================

function calculateContentScore(
    resumeText
) {

    const text =
        normalizeText(resumeText);

    const checks = [

        /education/.test(text),

        /experience|internship|employment/.test(
            text
        ),

        /project|projects/.test(
            text
        ),

        /skills|technical skills/.test(
            text
        ),

        /summary|objective|profile|career objective/.test(
            text
        ),

        /certificate|certification/.test(
            text
        ),

        /email|phone|mobile/.test(
            text
        )
    ];

    const found =
        checks.filter(Boolean).length;

    return (
        found /
        checks.length
    ) * 100;
}

// =====================================================
// ATS SCORE
// =====================================================

function calculateATSScore(data) {

    const score =

        (data.keywordScore * 0.35) +

        (data.skillScore * 0.30) +

        (data.titleScore * 0.10) +

        (data.experienceScore * 0.10) +

        (data.educationScore * 0.05) +

        (data.sectionScore * 0.05) +

        (data.contentScore * 0.05);

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(score)
        )
    );
}

// =====================================================
// ANALYZE RESUME
// =====================================================

router.post(
    "/analyze",
    auth,
    upload.single("resume"),

    async (req, res) => {

        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "ATS ANALYSIS STARTED"
        );
        console.log(
            "======================================"
        );

        try {

            // -----------------------------------------
            // FILE
            // -----------------------------------------

            console.log(
                "ATS FILE:",
                req.file
                    ? req.file.originalname
                    : "NO FILE"
            );

            console.log(
                "ATS BODY:",
                req.body
            );

            if (!req.file) {

                return res.status(400).json({
                    message:
                        "Resume file was not received by backend"
                });
            }

            // -----------------------------------------
            // FILE TYPE
            // -----------------------------------------

            const fileName =
                req.file.originalname.toLowerCase();

            const validFile =
                fileName.endsWith(".pdf") ||
                fileName.endsWith(".docx");

            if (!validFile) {

                return res.status(400).json({
                    message:
                        "Only PDF and DOCX files are allowed"
                });
            }

            // -----------------------------------------
            // JOB DESCRIPTION
            // -----------------------------------------

            const jobDescription =
                req.body.jobDescription;

            if (
                !jobDescription ||
                jobDescription.trim() === ""
            ) {

                return res.status(400).json({
                    message:
                        "Job description is required"
                });
            }

            // -----------------------------------------
            // EXISTING RESUME ID
            // -----------------------------------------

            const existingResumeId =
                req.body.resumeId;

            console.log(
                "RECEIVED RESUME ID:",
                existingResumeId || "NO RESUME ID"
            );

            // -----------------------------------------
            // RESUME TEXT
            // -----------------------------------------

            const resumeText =
                await extractResumeText(
                    req.file
                );

            console.log(
                "Resume text extracted:",
                resumeText.length,
                "characters"
            );

            if (
                !resumeText ||
                resumeText.trim().length < 20
            ) {

                return res.status(400).json({
                    message:
                        "Could not read text from resume. Please upload a clear PDF or DOCX file."
                });
            }

            // -----------------------------------------
            // KEYWORDS
            // -----------------------------------------

            const keywordResult =
                calculateKeywordMatch(
                    resumeText,
                    jobDescription
                );

            // -----------------------------------------
            // SKILLS
            // -----------------------------------------

            const skillResult =
                calculateSkillMatch(
                    resumeText,
                    jobDescription
                );

            // -----------------------------------------
            // SECTIONS
            // -----------------------------------------

            const sectionScore =
                calculateSectionScore(
                    resumeText
                );

            // -----------------------------------------
            // TITLE
            // -----------------------------------------

            const titleScore =
                calculateJobTitleScore(
                    resumeText,
                    jobDescription
                );

            // -----------------------------------------
            // EXPERIENCE
            // -----------------------------------------

            const experienceScore =
                calculateExperienceScore(
                    resumeText,
                    jobDescription
                );

            // -----------------------------------------
            // EDUCATION
            // -----------------------------------------

            const educationScore =
                calculateEducationScore(
                    resumeText,
                    jobDescription
                );

            // -----------------------------------------
            // CONTENT
            // -----------------------------------------

            const contentScore =
                calculateContentScore(
                    resumeText
                );

            // -----------------------------------------
            // FINAL ATS SCORE
            // -----------------------------------------

            const atsScore =
                calculateATSScore({

                    keywordScore:
                        keywordResult.keywordScore,

                    skillScore:
                        skillResult.skillScore,

                    titleScore:
                        titleScore,

                    experienceScore:
                        experienceScore,

                    educationScore:
                        educationScore,

                    sectionScore:
                        sectionScore,

                    contentScore:
                        contentScore
                });

            // =================================================
            // DEBUG
            // =================================================

            console.log("");
            console.log(
                "========== ATS DEBUG =========="
            );

            console.log(
                "RESUME SKILLS:",
                skillResult.resumeSkills
            );

            console.log(
                "JOB SKILLS:",
                skillResult.jobSkills
            );

            console.log(
                "MATCHED SKILLS:",
                skillResult.matchedSkills
            );

            console.log(
                "MISSING SKILLS:",
                skillResult.missingSkills
            );

            console.log(
                "MATCHED KEYWORDS:",
                keywordResult.matchedKeywords
            );

            console.log(
                "MISSING KEYWORDS:",
                keywordResult.missingKeywords
            );

            console.log(
                "KEYWORD SCORE:",
                Math.round(
                    keywordResult.keywordScore
                )
            );

            console.log(
                "SKILL SCORE:",
                Math.round(
                    skillResult.skillScore
                )
            );

            console.log(
                "SECTION SCORE:",
                Math.round(
                    sectionScore
                )
            );

            console.log(
                "TITLE SCORE:",
                titleScore
            );

            console.log(
                "EXPERIENCE SCORE:",
                experienceScore
            );

            console.log(
                "EDUCATION SCORE:",
                educationScore
            );

            console.log(
                "CONTENT SCORE:",
                Math.round(
                    contentScore
                )
            );

            console.log(
                "REAL ATS SCORE:",
                atsScore
            );

            console.log(
                "======================================"
            );

            // =================================================
            // FIND OR CREATE RESUME
            // =================================================

            let resume;

            if (existingResumeId) {

                console.log(
                    "Trying to update existing resume..."
                );

                resume =
                    await Resume.findOne({
                        _id: existingResumeId,
                        userId: req.userId
                    });

                if (!resume) {

                    return res.status(404).json({
                        message:
                            "Resume not found for this user"
                    });
                }

                console.log(
                    "EXISTING RESUME FOUND:",
                    resume._id
                );

            } else {

                console.log(
                    "No resumeId received. Creating new resume..."
                );

                resume =
                    new Resume({

                        userId:
                            req.userId,

                        resumeTitle:
                            req.file.originalname,

                        resumeText:
                            resumeText
                    });

                await resume.save();

                console.log(
                    "NEW RESUME CREATED:",
                    resume._id
                );
            }

            // =================================================
            // UPDATE RESUME WITH LATEST ATS RESULT
            // =================================================

            resume.resumeText =
                resumeText;

            resume.atsScore =
                atsScore;

            resume.matchedSkills =
                Array.isArray(
                    skillResult.matchedSkills
                )
                    ? skillResult.matchedSkills
                    : [];

            resume.missingSkills =
                Array.isArray(
                    skillResult.missingSkills
                )
                    ? skillResult.missingSkills
                    : [];

            resume.matchedKeywords =
                Array.isArray(
                    keywordResult.matchedKeywords
                )
                    ? keywordResult.matchedKeywords
                    : [];

            resume.missingKeywords =
                Array.isArray(
                    keywordResult.missingKeywords
                )
                    ? keywordResult.missingKeywords
                    : [];

            await resume.save();

            console.log("");
            console.log(
                "========== RESUME UPDATED =========="
            );

            console.log(
                "Resume ID:",
                resume._id
            );

            console.log(
                "Resume ATS Score:",
                resume.atsScore
            );

            console.log(
                "Resume Matched Skills:",
                resume.matchedSkills
            );

            console.log(
                "Resume Missing Skills:",
                resume.missingSkills
            );

            console.log(
                "Resume Matched Keywords:",
                resume.matchedKeywords
            );

            console.log(
                "Resume Missing Keywords:",
                resume.missingKeywords
            );

            console.log(
                "===================================="
            );

            // =================================================
            // SAVE ATS ANALYSIS HISTORY
            // =================================================

            const analysis =
                new ATSAnalysis({

                    userId:
                        req.userId,

                    resumeId:
                        resume._id,

                    resumeFileName:
                        req.file.originalname,

                    jobDescription:
                        jobDescription,

                    atsScore:
                        atsScore,

                    matchedKeywords:
                        resume.matchedKeywords,

                    missingKeywords:
                        resume.missingKeywords,

                    matchedSkills:
                        resume.matchedSkills,

                    missingSkills:
                        resume.missingSkills,

                    resumeText:
                        resumeText
                });

            await analysis.save();

            // =================================================
            // DATABASE SAVE CONFIRMATION
            // =================================================

            console.log("");
            console.log(
                "========== DATABASE SAVE =========="
            );

            console.log(
                "Resume ID:",
                resume._id
            );

            console.log(
                "Analysis ID:",
                analysis._id
            );

            console.log(
                "Saved Resume ATS Score:",
                resume.atsScore
            );

            console.log(
                "Saved Resume Matched Skills:",
                resume.matchedSkills
            );

            console.log(
                "Saved Resume Missing Skills:",
                resume.missingSkills
            );

            console.log(
                "Saved Analysis Matched Skills:",
                analysis.matchedSkills
            );

            console.log(
                "Saved Analysis Missing Skills:",
                analysis.missingSkills
            );

            console.log(
                "==================================="
            );

            // =================================================
            // RESPONSE
            // =================================================

            return res.json({

                message:
                    "Resume analyzed successfully",

                atsScore:
                    resume.atsScore,

                matchedSkills:
                    resume.matchedSkills,

                missingSkills:
                    resume.missingSkills,

                matchedKeywords:
                    resume.matchedKeywords,

                missingKeywords:
                    resume.missingKeywords,

                resumeId:
                    resume._id,

                analysisId:
                    analysis._id
            });

        } catch (error) {

            console.log(
                "ATS ERROR:",
                error
            );

            return res.status(500).json({

                message:
                    "Resume analysis failed",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// ATS HISTORY
// =====================================================

router.get(
    "/history",
    auth,

    async (req, res) => {

        try {

            const analyses =
                await ATSAnalysis.find({
                    userId:
                        req.userId
                })
                .sort({
                    createdAt: -1
                });

            return res.json(
                analyses
            );

        } catch (error) {

            return res.status(500).json({

                message:
                    "Could not get ATS history",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;