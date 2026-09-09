/* =====================================================
   CAREERPILOT AI
   COMPLETE FRONTEND JAVASCRIPT
   JOB-SPECIFIC ATS ANALYZER
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =================================================
       DOM ELEMENTS
    ================================================= */

    const startBtn = document.getElementById("startBtn");
    const resumeSection = document.getElementById("resume-section");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");

    const themeToggle = document.getElementById("themeToggle");

    const resumeForm = document.getElementById("resumeForm");

    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const experience = document.getElementById("experience");

    const resumeInput = document.getElementById("resume");
    const careerGoal = document.getElementById("careergoal");
    const jobDescription = document.getElementById("jobDescription");

    const fileName = document.getElementById("fileName");

    const previewContainer =
        document.getElementById("previewContainer");

    const pdfMessage =
        document.getElementById("pdfMessage");

    const pdfViewer =
        document.getElementById("pdfViewer");

    const pdfCanvas =
        document.getElementById("pdfCanvas");

    const zoomIn =
        document.getElementById("zoomIn");

    const zoomOut =
        document.getElementById("zoomOut");

    const closePreview =
        document.getElementById("closePreview");

    const resultCard =
        document.getElementById("resultCard");

    const resultText =
        document.getElementById("resultText");

    const progressContainer =
        document.getElementById("progressContainer");

    const progressBar =
        document.getElementById("progressBar");

    const circle =
        document.getElementById("circle");

    const score =
        document.getElementById("score");

    const resumeStrength =
        document.getElementById("resumeStrength");

    const scoreSummary =
        document.getElementById("scoreSummary");

    const suggestionList =
        document.getElementById("suggestionList");

    const matchedKeywords =
        document.getElementById("matchedKeywords");

    const missingKeywords =
        document.getElementById("missingKeywords");

    const keywordScore =
        document.getElementById("keywordScore");

    const skillsScore =
        document.getElementById("skillsScore");

    const experienceScore =
        document.getElementById("experienceScore");

    const atsScore =
        document.getElementById("atsScore");

    const qualityScore =
        document.getElementById("qualityScore");

    const keywordScoreBar =
        document.getElementById("keywordScoreBar");

    const skillsScoreBar =
        document.getElementById("skillsScoreBar");

    const experienceScoreBar =
        document.getElementById("experienceScoreBar");

    const atsScoreBar =
        document.getElementById("atsScoreBar");

    const qualityScoreBar =
        document.getElementById("qualityScoreBar");

    const jobSearch =
        document.getElementById("jobSearch");

    const jobLocation =
        document.getElementById("jobLocation");

    const jobsTable =
        document.getElementById("jobsTable");

    const noJobs =
        document.getElementById("noJobs");

    const feedbackBtn =
        document.getElementById("feedbackBtn");

    const resetBtn =
        document.getElementById("resetBtn");

    const toast =
        document.getElementById("toast");


    /* =================================================
       STATE
    ================================================= */

    let pdfDocument = null;

    let pdfScale = 1.25;

    let toastTimer = null;

    let analysisInProgress = false;


    /* =================================================
       UTILITY
    ================================================= */

    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
    }


    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }


    function normalizeText(text) {

        return String(text || "")
            .replace(/\r/g, "\n")
            .replace(/[•●▪◦]/g, " ")
            .replace(/[^\S\n]+/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .toLowerCase()
            .trim();
    }


    function cleanForMatching(text) {

        return normalizeText(text)
            .replace(/[\/|,;:()[\]{}]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }


    function countWords(text) {

        const clean = cleanForMatching(text);

        if (!clean) {
            return 0;
        }

        return clean.split(/\s+/).length;
    }


    function unique(array) {

        return [...new Set(array)];
    }


    function escapeRegex(value) {

        return String(value)
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }


    function containsTerm(text, term) {

        const source = cleanForMatching(text);

        const target = cleanForMatching(term);

        if (!source || !target) {
            return false;
        }

        const escaped = escapeRegex(target)
            .replace(/\s+/g, "\\s+");

        const regex =
            new RegExp(
                `(?:^|\\s)${escaped}(?=\\s|$)`,
                "i"
            );

        return regex.test(source);
    }


    function setProgress(value) {

        if (!progressBar) {
            return;
        }

        const safe = clamp(value, 0, 100);

        progressBar.style.width = `${safe}%`;
    }


    /* =================================================
       START BUTTON
    ================================================= */

    if (startBtn && resumeSection) {

        startBtn.addEventListener("click", () => {

            resumeSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    /* =================================================
       MOBILE MENU
    ================================================= */

    if (mobileMenuBtn && navLinks) {

        mobileMenuBtn.addEventListener("click", () => {

            const active =
                navLinks.classList.toggle("active");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                String(active)
            );

            mobileMenuBtn.textContent =
                active ? "✕" : "☰";

        });


        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuBtn.textContent = "☰";

            });

        });

    }


    /* =================================================
       DARK MODE
    ================================================= */

    const savedTheme =
        localStorage.getItem("careerPilotTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    }


    function updateThemeIcon() {

        if (!themeToggle) {
            return;
        }

        themeToggle.textContent =
            document.body.classList.contains("dark-mode")
                ? "☀️"
                : "🌙";

    }


    updateThemeIcon();


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "careerPilotTheme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();

        });

    }


    /* =================================================
       EXTERNAL SCRIPT LOADER
    ================================================= */

    const scriptCache = new Map();


    function loadExternalScript(src, globalName) {

        if (
            globalName &&
            window[globalName]
        ) {
            return Promise.resolve(
                window[globalName]
            );
        }


        if (scriptCache.has(src)) {
            return scriptCache.get(src);
        }


        const promise =
            new Promise((resolve, reject) => {

                const existing =
                    document.querySelector(
                        `script[src="${src}"]`
                    );


                if (existing) {

                    existing.addEventListener(
                        "load",
                        () => {

                            if (
                                globalName &&
                                window[globalName]
                            ) {
                                resolve(
                                    window[globalName]
                                );
                            } else {
                                resolve(null);
                            }

                        },
                        { once: true }
                    );


                    existing.addEventListener(
                        "error",
                        reject,
                        { once: true }
                    );

                    return;
                }


                const script =
                    document.createElement("script");

                script.src = src;

                script.async = true;

                script.onload = () => {

                    if (
                        globalName &&
                        !window[globalName]
                    ) {

                        reject(
                            new Error(
                                `${globalName} failed to load.`
                            )
                        );

                        return;
                    }

                    resolve(
                        globalName
                            ? window[globalName]
                            : null
                    );

                };


                script.onerror = () => {

                    reject(
                        new Error(
                            `Unable to load external library: ${src}`
                        )
                    );

                };


                document.head.appendChild(script);

            });


        scriptCache.set(src, promise);

        return promise;
    }


    /* =================================================
       PDF.JS
    ================================================= */

    async function loadPDFJS() {

        const pdfjs =
            await loadExternalScript(
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
                "pdfjsLib"
            );


        if (
            pdfjs &&
            pdfjs.GlobalWorkerOptions
        ) {

            pdfjs.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        }


        return pdfjs;
    }


    /* =================================================
       MAMMOTH
    ================================================= */

    async function loadMammoth() {

        return loadExternalScript(
            "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js",
            "mammoth"
        );

    }


    /* =================================================
       TESSERACT
    ================================================= */

    async function loadTesseract() {

        return loadExternalScript(
            "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js",
            "Tesseract"
        );

    }


    /* =================================================
       FILE NAME
    ================================================= */

    if (resumeInput) {

        resumeInput.addEventListener("change", async () => {

            const file =
                resumeInput.files &&
                resumeInput.files[0];


            if (!file) {

                if (fileName) {
                    fileName.textContent =
                        "No file selected";
                }

                return;
            }


            if (fileName) {
                fileName.textContent =
                    `${file.name} • ${formatBytes(file.size)}`;
            }


            try {

                await prepareResumePreview(file);

            } catch (error) {

                console.error(error);

                showToast(
                    "Resume preview could not be prepared."
                );

            }

        });

    }


    function formatBytes(bytes) {

        if (!bytes) {
            return "0 B";
        }

        const units =
            ["B", "KB", "MB", "GB"];

        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );

        const safeIndex =
            Math.min(index, units.length - 1);

        return (
            bytes /
            Math.pow(1024, safeIndex)
        ).toFixed(
            safeIndex === 0 ? 0 : 1
        ) + ` ${units[safeIndex]}`;

    }


    /* =================================================
       PDF PREVIEW
    ================================================= */

    async function prepareResumePreview(file) {

        const extension =
            getExtension(file.name);


        if (previewContainer) {
            previewContainer.classList.add("active");
        }


        if (pdfMessage) {
            pdfMessage.textContent =
                "Preparing resume...";
        }


        if (extension === "pdf") {

            await renderPDF(file);

            return;
        }


        if (extension === "docx") {

            if (pdfMessage) {
                pdfMessage.textContent =
                    "DOCX selected. Text extraction will be used for ATS analysis.";
            }

            if (pdfCanvas) {

                const context =
                    pdfCanvas.getContext("2d");

                context.clearRect(
                    0,
                    0,
                    pdfCanvas.width,
                    pdfCanvas.height
                );

            }

            return;
        }


        if (extension === "doc") {

            if (pdfMessage) {
                pdfMessage.textContent =
                    "Legacy .doc files are not supported. Please upload PDF or DOCX.";
            }

            return;
        }

    }


    function getExtension(filename) {

        const parts =
            String(filename)
                .toLowerCase()
                .split(".");

        return parts.length > 1
            ? parts.pop()
            : "";
    }


    async function renderPDF(file) {

        const pdfjs =
            await loadPDFJS();


        const buffer =
            await file.arrayBuffer();


        const loadingTask =
            pdfjs.getDocument({
                data: buffer
            });


        pdfDocument =
            await loadingTask.promise;


        pdfScale = 1.25;


        await renderPDFPage();


        if (pdfMessage) {

            pdfMessage.textContent =
                `PDF loaded successfully • ${pdfDocument.numPages} page${pdfDocument.numPages === 1 ? "" : "s"}`;

        }

    }


    async function renderPDFPage() {

        if (!pdfDocument || !pdfCanvas) {
            return;
        }


        const page =
            await pdfDocument.getPage(1);


        const viewport =
            page.getViewport({
                scale: pdfScale
            });


        pdfCanvas.width =
            viewport.width;

        pdfCanvas.height =
            viewport.height;


        const context =
            pdfCanvas.getContext("2d");


        await page.render({
            canvasContext: context,
            viewport
        }).promise;

    }


    if (zoomIn) {

        zoomIn.addEventListener("click", async () => {

            if (!pdfDocument) {
                return;
            }

            pdfScale =
                clamp(
                    pdfScale + 0.15,
                    0.5,
                    3
                );

            await renderPDFPage();

        });

    }


    if (zoomOut) {

        zoomOut.addEventListener("click", async () => {

            if (!pdfDocument) {
                return;
            }

            pdfScale =
                clamp(
                    pdfScale - 0.15,
                    0.5,
                    3
                );

            await renderPDFPage();

        });

    }


    if (closePreview) {

        closePreview.addEventListener("click", () => {

            if (previewContainer) {
                previewContainer.classList.remove("active");
            }

        });

    }


    /* =================================================
       PDF TEXT EXTRACTION
    ================================================= */

    async function extractPDFText(file) {

        const pdfjs =
            await loadPDFJS();


        const buffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjs
                .getDocument({
                    data: buffer
                })
                .promise;


        let completeText = "";


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(pageNumber);


            const content =
                await page.getTextContent();


            const pageText =
                content.items
                    .map(item => item.str || "")
                    .join(" ");


            completeText +=
                `\n${pageText}`;

        }


        return completeText.trim();

    }


    /* =================================================
       PDF OCR FALLBACK
    ================================================= */

    async function extractPDFWithOCR(file) {

        const pdfjs =
            await loadPDFJS();

        const Tesseract =
            await loadTesseract();


        const buffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjs
                .getDocument({
                    data: buffer
                })
                .promise;


        let completeText = "";


        const maxPages =
            Math.min(
                pdf.numPages,
                5
            );


        for (
            let pageNumber = 1;
            pageNumber <= maxPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(pageNumber);


            const viewport =
                page.getViewport({
                    scale: 1.8
                });


            const canvas =
                document.createElement("canvas");


            canvas.width =
                Math.ceil(viewport.width);

            canvas.height =
                Math.ceil(viewport.height);


            const context =
                canvas.getContext("2d");


            await page.render({
                canvasContext: context,
                viewport
            }).promise;


            const result =
                await Tesseract.recognize(
                    canvas,
                    "eng",
                    {
                        logger: info => {

                            if (
                                info.status === "recognizing text" &&
                                info.progress
                            ) {

                                const pageProgress =
                                    (
                                        (pageNumber - 1) +
                                        info.progress
                                    ) /
                                    maxPages;

                                setProgress(
                                    20 +
                                    pageProgress * 25
                                );

                            }

                        }
                    }
                );


            completeText +=
                `\n${result.data.text}`;

        }


        return completeText.trim();

    }


    /* =================================================
       DOCX TEXT EXTRACTION
    ================================================= */

    async function extractDOCXText(file) {

        const mammoth =
            await loadMammoth();


        const buffer =
            await file.arrayBuffer();


        const result =
            await mammoth.extractRawText({
                arrayBuffer: buffer
            });


        return (
            result.value ||
            ""
        ).trim();

    }


    /* =================================================
       RESUME EXTRACTION
    ================================================= */

    async function extractResumeText(file) {

        const extension =
            getExtension(file.name);


        if (extension === "pdf") {

            let text =
                await extractPDFText(file);


            if (countWords(text) < 25) {

                if (pdfMessage) {
                    pdfMessage.textContent =
                        "PDF appears image-based. Running OCR...";
                }

                text =
                    await extractPDFWithOCR(file);

            }


            return text;

        }


        if (extension === "docx") {

            return extractDOCXText(file);

        }


        if (extension === "doc") {

            throw new Error(
                "Legacy .doc format is not supported. Please upload PDF or DOCX."
            );

        }


        throw new Error(
            "Unsupported resume format."
        );

    }


    /* =================================================
       SKILL DATABASE
    ================================================= */

    const SKILL_DATABASE = {

        "javascript": [
            "javascript",
            "js"
        ],

        "typescript": [
            "typescript",
            "ts"
        ],

        "react": [
            "react",
            "reactjs",
            "react.js"
        ],

        "node.js": [
            "node.js",
            "nodejs",
            "node"
        ],

        "express.js": [
            "express.js",
            "expressjs",
            "express"
        ],

        "mongodb": [
            "mongodb",
            "mongo db",
            "mongo"
        ],

        "mysql": [
            "mysql"
        ],

        "postgresql": [
            "postgresql",
            "postgres",
            "postgres sql"
        ],

        "sql": [
            "sql"
        ],

        "nosql": [
            "nosql",
            "no sql"
        ],

        "python": [
            "python"
        ],

        "java": [
            "java"
        ],

        "c++": [
            "c++",
            "c plus plus"
        ],

        "c#": [
            "c#",
            "c sharp"
        ],

        "html": [
            "html",
            "html5"
        ],

        "css": [
            "css",
            "css3"
        ],

        "spring boot": [
            "spring boot",
            "springboot"
        ],

        "spring": [
            "spring framework",
            "spring"
        ],

        "git": [
            "git"
        ],

        "github": [
            "github",
            "git hub"
        ],

        "docker": [
            "docker"
        ],

        "kubernetes": [
            "kubernetes",
            "k8s"
        ],

        "aws": [
            "aws",
            "amazon web services"
        ],

        "azure": [
            "azure",
            "microsoft azure"
        ],

        "gcp": [
            "gcp",
            "google cloud",
            "google cloud platform"
        ],

        "machine learning": [
            "machine learning",
            "ml"
        ],

        "artificial intelligence": [
            "artificial intelligence",
            "ai"
        ],

        "deep learning": [
            "deep learning"
        ],

        "data science": [
            "data science"
        ],

        "data analysis": [
            "data analysis",
            "data analytics"
        ],

        "rest api": [
            "rest api",
            "restful api",
            "rest"
        ],

        "graphql": [
            "graphql"
        ],

        "api": [
            "api",
            "apis"
        ],

        "tailwind": [
            "tailwind",
            "tailwind css"
        ],

        "bootstrap": [
            "bootstrap"
        ],

        "next.js": [
            "next.js",
            "nextjs"
        ],

        "angular": [
            "angular"
        ],

        "vue": [
            "vue",
            "vue.js",
            "vuejs"
        ],

        "figma": [
            "figma"
        ],

        "firebase": [
            "firebase"
        ],

        "linux": [
            "linux"
        ],

        "jira": [
            "jira"
        ],

        "agile": [
            "agile"
        ],

        "scrum": [
            "scrum"
        ],

        "jenkins": [
            "jenkins"
        ],

        "ci/cd": [
            "ci/cd",
            "ci cd",
            "continuous integration",
            "continuous deployment"
        ]

    };


    /* =================================================
       ROLE DATABASE
    ================================================= */

    const ROLE_TERMS = {

        "frontend developer": [
            "frontend developer",
            "front end developer",
            "frontend engineer",
            "front end engineer",
            "ui developer",
            "web developer"
        ],

        "backend developer": [
            "backend developer",
            "back end developer",
            "backend engineer",
            "back end engineer"
        ],

        "full stack developer": [
            "full stack developer",
            "fullstack developer",
            "full stack engineer",
            "fullstack engineer"
        ],

        "software engineer": [
            "software engineer",
            "software developer",
            "software development engineer",
            "sde"
        ],

        "data analyst": [
            "data analyst",
            "data analytics",
            "business analyst"
        ],

        "data scientist": [
            "data scientist",
            "data science"
        ],

        "machine learning engineer": [
            "machine learning engineer",
            "ml engineer",
            "machine learning developer"
        ],

        "devops engineer": [
            "devops engineer",
            "devops developer",
            "site reliability engineer",
            "sre"
        ],

        "cloud engineer": [
            "cloud engineer",
            "cloud developer",
            "cloud architect"
        ],

        "java developer": [
            "java developer",
            "java engineer",
            "java software engineer"
        ],

        "python developer": [
            "python developer",
            "python engineer"
        ],

        "react developer": [
            "react developer",
            "react engineer",
            "react.js developer"
        ]

    };


    /* =================================================
       IMPORTANT ATS TERMS
    ================================================= */

    const HIGH_SIGNAL_TERMS = [

        "problem solving",
        "communication",
        "teamwork",
        "leadership",
        "analytical skills",
        "time management",
        "project management",
        "testing",
        "debugging",
        "performance",
        "scalable",
        "scalability",
        "optimization",
        "deployment",
        "database",
        "security",
        "automation",
        "integration",
        "development",
        "software development",
        "web development",
        "version control",
        "object oriented programming",
        "oop",
        "unit testing",
        "code review",
        "documentation",
        "requirements",
        "architecture"
    ];


    /* =================================================
       EXTRACT TERMS FROM JD
    ================================================= */

    function extractJDTerms(jdText) {

        const found = [];


        /* Skills */

        Object.entries(
            SKILL_DATABASE
        ).forEach(([canonical, aliases]) => {

            if (
                aliases.some(
                    alias =>
                        containsTerm(
                            jdText,
                            alias
                        )
                )
            ) {

                found.push({
                    term: canonical,
                    type: "skill"
                });

            }

        });


        /* Roles */

        Object.entries(
            ROLE_TERMS
        ).forEach(([canonical, aliases]) => {

            if (
                aliases.some(
                    alias =>
                        containsTerm(
                            jdText,
                            alias
                        )
                )
            ) {

                found.push({
                    term: canonical,
                    type: "role"
                });

            }

        });


        /* High signal terms */

        HIGH_SIGNAL_TERMS.forEach(term => {

            if (
                containsTerm(
                    jdText,
                    term
                )
            ) {

                found.push({
                    term,
                    type: "general"
                });

            }

        });


        return uniqueObjects(found);

    }


    function uniqueObjects(items) {

        const seen = new Set();

        return items.filter(item => {

            const key =
                `${item.type}:${item.term}`;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;

        });

    }


    /* =================================================
       RESUME KEYWORD MATCH
    ================================================= */

    function compareKeywords(
        resumeText,
        jdTerms
    ) {

        const matched = [];
        const missing = [];


        jdTerms.forEach(item => {

            if (
                containsTerm(
                    resumeText,
                    item.term
                )
            ) {

                matched.push(item);

            } else {

                missing.push(item);

            }

        });


        const total =
            jdTerms.length;


        const keywordPercentage =
            total === 0
                ? 0
                : Math.round(
                    (
                        matched.length /
                        total
                    ) * 100
                );


        return {
            matched,
            missing,
            percentage:
                clamp(
                    keywordPercentage,
                    0,
                    100
                )
        };

    }


    /* =================================================
       SELECTED SKILLS
    ================================================= */

    function getSelectedSkills() {

        return [
            ...document.querySelectorAll(
                'input[name="skills"]:checked'
            )
        ].map(
            input => input.value
        );

    }


    function calculateSkillMatch(
        resumeText,
        jdText,
        selectedSkills
    ) {

        const requiredSkills = [];


        Object.entries(
            SKILL_DATABASE
        ).forEach(([canonical, aliases]) => {

            if (
                aliases.some(
                    alias =>
                        containsTerm(
                            jdText,
                            alias
                        )
                )
            ) {

                requiredSkills.push(
                    canonical
                );

            }

        });


        if (requiredSkills.length === 0) {

            return {
                score: 100,
                required: [],
                matched: [],
                missing: []
            };

        }


        const matched = [];
        const missing = [];


        requiredSkills.forEach(skill => {

            const resumeHasSkill =
                SKILL_DATABASE[skill].some(
                    alias =>
                        containsTerm(
                            resumeText,
                            alias
                        )
                );


            const selectedHasSkill =
                selectedSkills.some(
                    selected =>
                        cleanForMatching(
                            selected
                        ) ===
                        cleanForMatching(
                            skill
                        )
                );


            if (
                resumeHasSkill ||
                selectedHasSkill
            ) {

                matched.push(skill);

            } else {

                missing.push(skill);

            }

        });


        return {
            score:
                Math.round(
                    (
                        matched.length /
                        requiredSkills.length
                    ) * 100
                ),
            required: requiredSkills,
            matched,
            missing
        };

    }


    /* =================================================
       EXPERIENCE MATCH
    ================================================= */

    function extractRequiredYears(jdText) {

        const text =
            cleanForMatching(jdText);


        const patterns = [

            /(\d+)\s*\+\s*(?:years?|yrs?)/i,

            /minimum\s+of\s+(\d+)\s*(?:years?|yrs?)/i,

            /at\s+least\s+(\d+)\s*(?:years?|yrs?)/i,

            /(\d+)\s*(?:to|-)\s*(\d+)\s*(?:years?|yrs?)/i

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


    function experienceYears(value) {

        switch (value) {

            case "fresher":
                return 0;

            case "0-1":
                return 1;

            case "1-3":
                return 2;

            case "3-5":
                return 4;

            case "5-8":
                return 6;

            case "8+":
                return 9;

            default:
                return 0;

        }

    }


    function calculateExperienceScore(
        resumeText,
        jdText,
        selectedExperience,
        careerGoalValue
    ) {

        const requiredYears =
            extractRequiredYears(
                jdText
            );


        const candidateYears =
            experienceYears(
                selectedExperience
            );


        let yearScore = 100;


        if (requiredYears > 0) {

            if (
                candidateYears >=
                requiredYears
            ) {

                yearScore = 100;

            } else {

                const gap =
                    requiredYears -
                    candidateYears;

                yearScore =
                    clamp(
                        100 -
                        gap * 20,
                        20,
                        100
                    );

            }

        }


        const roleMatches =
            Object.entries(
                ROLE_TERMS
            ).filter(
                ([, aliases]) =>
                    aliases.some(
                        alias =>
                            containsTerm(
                                jdText,
                                alias
                            )
                    )
            );


        let roleScore = 100;


        if (roleMatches.length > 0) {

            const hasRelevantRole =
                roleMatches.some(
                    ([, aliases]) =>
                        aliases.some(
                            alias =>
                                containsTerm(
                                    resumeText,
                                    alias
                                ) ||
                                containsTerm(
                                    careerGoalValue,
                                    alias
                                )
                        )
                );


            roleScore =
                hasRelevantRole
                    ? 100
                    : 45;

        }


        return Math.round(
            (
                yearScore * 0.55 +
                roleScore * 0.45
            )
        );

    }


    /* =================================================
       ATS COMPATIBILITY
    ================================================= */

    function calculateATSCompatibility(
        resumeText
    ) {

        const text =
            cleanForMatching(
                resumeText
            );


        if (!text) {
            return 0;
        }


        let points = 0;


        const sections = {

            contact:
                /@/.test(text) ||
                /\b(?:phone|mobile|contact)\b/.test(text),

            summary:
                /\b(?:summary|profile|objective|about me)\b/.test(text),

            experience:
                /\b(?:experience|work history|employment)\b/.test(text),

            education:
                /\b(?:education|academic|qualification)\b/.test(text),

            skills:
                /\b(?:skills|technical skills|technologies)\b/.test(text),

            projects:
                /\b(?:projects|personal projects|academic projects)\b/.test(text)

        };


        Object.values(sections)
            .forEach(present => {

                if (present) {
                    points += 10;
                }

            });


        const words =
            countWords(text);


        if (words >= 150 && words <= 1500) {
            points += 15;
        } else if (words >= 100) {
            points += 8;
        }


        if (
            /\b(?:linkedin|github)\b/i.test(
                text
            )
        ) {

            points += 10;

        }


        if (
            /\b\d{4}\b/.test(text)
        ) {

            points += 5;

        }


        return clamp(
            points,
            0,
            100
        );

    }


    /* =================================================
       RESUME QUALITY
    ================================================= */

    function calculateResumeQuality(
        resumeText
    ) {

        const text =
            cleanForMatching(
                resumeText
            );


        const words =
            countWords(text);


        let points = 0;


        if (
            words >= 250 &&
            words <= 900
        ) {

            points += 25;

        } else if (
            words >= 150 &&
            words <= 1200
        ) {

            points += 18;

        } else {

            points += 8;

        }


        const actionVerbs = [

            "developed",
            "created",
            "built",
            "designed",
            "implemented",
            "managed",
            "led",
            "improved",
            "optimized",
            "delivered",
            "automated",
            "engineered",
            "launched",
            "analyzed",
            "reduced",
            "increased",
            "achieved",
            "maintained",
            "deployed",
            "integrated"

        ];


        const actionCount =
            actionVerbs.filter(
                verb =>
                    containsTerm(
                        text,
                        verb
                    )
            ).length;


        points +=
            Math.min(
                actionCount * 2,
                20
            );


        const numberMatches =
            text.match(
                /\b\d+(?:\.\d+)?%?\b/g
            ) || [];


        points +=
            Math.min(
                numberMatches.length * 3,
                20
            );


        if (
            /\b(?:achievement|achievements)\b/.test(text)
        ) {

            points += 5;

        }


        if (
            /\b(?:certification|certifications|certified)\b/.test(text)
        ) {

            points += 5;

        }


        if (
            /\b(?:project|projects)\b/.test(text)
        ) {

            points += 10;

        }


        if (
            /\b(?:internship|internships)\b/.test(text)
        ) {

            points += 5;

        }


        return clamp(
            points,
            0,
            100
        );

    }


    /* =================================================
       OVERALL SCORE
    ================================================= */

    function calculateOverallScore(
        keywordMatch,
        skillMatch,
        experienceMatch,
        atsCompatibility,
        quality
    ) {

        /*
            CareerPilot heuristic weighting:

            Job Keywords      = 35%
            Skills            = 25%
            Experience        = 20%
            ATS Compatibility = 15%
            Resume Quality    = 5%
        */

        return Math.round(

            keywordMatch * 0.35 +

            skillMatch * 0.25 +

            experienceMatch * 0.20 +

            atsCompatibility * 0.15 +

            quality * 0.05

        );

    }


    /* =================================================
       SCORE STRENGTH
    ================================================= */

    function getStrength(scoreValue) {

        if (scoreValue >= 85) {

            return {
                label: "Excellent",
                color: "#24934a"
            };

        }

        if (scoreValue >= 70) {

            return {
                label: "Strong",
                color: "#42a85f"
            };

        }

        if (scoreValue >= 55) {

            return {
                label: "Moderate",
                color: "#d89424"
            };

        }

        if (scoreValue >= 40) {

            return {
                label: "Needs Improvement",
                color: "#e06a38"
            };

        }

        return {
            label: "Weak",
            color: "#d63d4d"
        };

    }


    /* =================================================
       CIRCLE SCORE
    ================================================= */

    function animateScore(
        targetScore,
        color
    ) {

        const circumference =
            2 * Math.PI * 70;


        if (circle) {

            circle.style.strokeDasharray =
                circumference;

            circle.style.strokeDashoffset =
                circumference;

            circle.style.stroke =
                color;

            circle.style.color =
                color;

            circle.classList.add("glow");

            requestAnimationFrame(() => {

                const offset =
                    circumference -
                    (
                        targetScore /
                        100
                    ) *
                    circumference;


                circle.style.strokeDashoffset =
                    offset;

            });

        }


        if (!score) {
            return;
        }


        const duration = 1300;

        const startTime =
            performance.now();


        function updateCounter(now) {

            const elapsed =
                now - startTime;


            const progress =
                clamp(
                    elapsed / duration,
                    0,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                Math.round(
                    targetScore * eased
                );


            score.textContent =
                `${current}%`;


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            }

        }


        requestAnimationFrame(
            updateCounter
        );

    }


    /* =================================================
       METRIC UI
    ================================================= */

    function updateMetric(
        textElement,
        barElement,
        value
    ) {

        if (textElement) {
            textElement.textContent =
                `${value}%`;
        }

        if (barElement) {

            requestAnimationFrame(() => {

                barElement.style.width =
                    `${value}%`;

            });

        }

    }


    /* =================================================
       KEYWORD UI
    ================================================= */

    function renderKeywords(
        container,
        items,
        className
    ) {

        if (!container) {
            return;
        }


        if (!items.length) {

            container.innerHTML =
                `<span class="keyword-empty">
                    None found
                </span>`;

            return;
        }


        container.innerHTML =
            items
                .map(item => {

                    const text =
                        typeof item === "string"
                            ? item
                            : item.term;

                    return `
                        <span class="keyword-tag ${className}">
                            ${escapeHTML(text)}
                        </span>
                    `;

                })
                .join("");

    }


    /* =================================================
       SUGGESTIONS
    ================================================= */

    function generateSuggestions(
        result
    ) {

        const suggestions = [];


        if (
            result.keywordMatch.percentage < 70
        ) {

            suggestions.push(
                `Improve job keyword coverage. Your current keyword match is ${result.keywordMatch.percentage}%.`
            );

        }


        if (
            result.skillMatch.score < 70
        ) {

            suggestions.push(
                `Add relevant skills from the job description only if you genuinely have those skills.`
            );

        }


        if (
            result.experienceMatch < 70
        ) {

            suggestions.push(
                `Make your relevant experience and target role clearer for this job.`
            );

        }


        if (
            result.atsCompatibility < 75
        ) {

            suggestions.push(
                `Use standard resume sections such as Summary, Experience, Skills, Education and Projects.`
            );

        }


        if (
            result.quality < 70
        ) {

            suggestions.push(
                `Use stronger action verbs and quantify achievements with measurable results where possible.`
            );

        }


        if (
            result.missingKeywords.length > 0
        ) {

            const topMissing =
                result.missingKeywords
                    .slice(0, 5)
                    .map(item => item.term)
                    .join(", ");


            suggestions.push(
                `Review these missing job terms: ${topMissing}. Add them only where they truthfully describe your experience.`
            );

        }


        if (
            countWords(result.resumeText) < 150
        ) {

            suggestions.push(
                "Your extracted resume text is quite short. Make sure the uploaded resume contains selectable text or is properly readable."
            );

        }


        if (!suggestions.length) {

            suggestions.push(
                "Your resume has a strong match. Keep the wording truthful and tailor the final resume to the exact job."
            );

        }


        return unique(
            suggestions
        );

    }


    function renderSuggestions(
        suggestions
    ) {

        if (!suggestionList) {
            return;
        }


        suggestionList.innerHTML =
            suggestions
                .map(
                    suggestion =>
                        `<li>${escapeHTML(suggestion)}</li>`
                )
                .join("");

    }


    /* =================================================
       FORM VALIDATION
    ================================================= */

    function validateForm() {

        if (!resumeForm) {
            return false;
        }


        if (
            !fullname.value.trim()
        ) {

            showToast(
                "Please enter your full name."
            );

            fullname.focus();

            return false;

        }


        if (
            !email.value.trim() ||
            !email.checkValidity()
        ) {

            showToast(
                "Please enter a valid email."
            );

            email.focus();

            return false;

        }


        if (
            !password.value.trim()
        ) {

            showToast(
                "Please enter a password."
            );

            password.focus();

            return false;

        }


        if (
            !experience.value
        ) {

            showToast(
                "Please select your experience."
            );

            experience.focus();

            return false;

        }


        if (
            !resumeInput.files ||
            !resumeInput.files[0]
        ) {

            showToast(
                "Please upload your resume."
            );

            resumeInput.focus();

            return false;

        }


        if (
            !careerGoal.value.trim()
        ) {

            showToast(
                "Please enter your target career/job role."
            );

            careerGoal.focus();

            return false;

        }


        if (
            jobDescription.value.trim().length < 30
        ) {

            showToast(
                "Please paste a complete job description."
            );

            jobDescription.focus();

            return false;

        }


        const jobType =
            document.querySelector(
                'input[name="jobtype"]:checked'
            );


        if (!jobType) {

            showToast(
                "Please select a job type."
            );

            return false;

        }


        const selectedSkills =
            getSelectedSkills();


        if (
            selectedSkills.length === 0
        ) {

            showToast(
                "Please select at least one skill."
            );

            return false;

        }


        return true;

    }


    /* =================================================
       MAIN ANALYSIS
    ================================================= */

    if (resumeForm) {

        resumeForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                if (analysisInProgress) {
                    return;
                }


                if (!validateForm()) {
                    return;
                }


                analysisInProgress = true;


                try {

                    if (resultCard) {
                        resultCard.classList.remove("active");
                    }


                    if (progressContainer) {
                        progressContainer.hidden = false;
                    }


                    setProgress(5);


                    const file =
                        resumeInput.files[0];


                    if (pdfMessage) {

                        pdfMessage.textContent =
                            "Reading resume...";
                    }


                    const resumeText =
                        await extractResumeText(
                            file
                        );


                    setProgress(45);


                    if (
                        countWords(resumeText) < 20
                    ) {

                        throw new Error(
                            "Very little text could be extracted from the resume. Please use a text-readable PDF or DOCX."
                        );

                    }


                    const jdText =
                        jobDescription.value.trim();


                    const goal =
                        careerGoal.value.trim();


                    const selectedSkills =
                        getSelectedSkills();


                    setProgress(55);


                    const jdTerms =
                        extractJDTerms(
                            jdText
                        );


                    const keywordMatch =
                        compareKeywords(
                            resumeText,
                            jdTerms
                        );


                    setProgress(65);


                    const skillMatch =
                        calculateSkillMatch(
                            resumeText,
                            jdText,
                            selectedSkills
                        );


                    const experienceMatch =
                        calculateExperienceScore(
                            resumeText,
                            jdText,
                            experience.value,
                            goal
                        );


                    const atsCompatibility =
                        calculateATSCompatibility(
                            resumeText
                        );


                    const quality =
                        calculateResumeQuality(
                            resumeText
                        );


                    const overall =
                        calculateOverallScore(
                            keywordMatch.percentage,
                            skillMatch.score,
                            experienceMatch,
                            atsCompatibility,
                            quality
                        );


                    const result = {

                        score: overall,

                        keywordMatch,

                        skillMatch,

                        experienceMatch,

                        atsCompatibility,

                        quality,

                        missingKeywords:
                            keywordMatch.missing,

                        resumeText

                    };


                    setProgress(80);


                    renderAnalysis(result);


                    setProgress(100);


                    if (progressContainer) {

                        setTimeout(() => {

                            progressContainer.hidden =
                                true;

                            setProgress(0);

                        }, 700);

                    }


                } catch (error) {

                    console.error(
                        "ATS Analysis Error:",
                        error
                    );


                    if (progressContainer) {
                        progressContainer.hidden =
                            true;
                    }


                    setProgress(0);


                    showToast(
                        error.message ||
                        "Unable to analyze the resume."
                    );


                } finally {

                    analysisInProgress =
                        false;

                }

            }
        );

    }


    /* =================================================
       RENDER ANALYSIS
    ================================================= */

    function renderAnalysis(result) {

        if (!resultCard) {
            return;
        }


        const strength =
            getStrength(
                result.score
            );


        resultCard.classList.add("active");


        if (resultText) {

            resultText.textContent =
                `Your resume matches approximately ${result.score}% of this target job using CareerPilot's heuristic analysis.`;

        }


        if (resumeStrength) {

            resumeStrength.textContent =
                strength.label;

            resumeStrength.style.color =
                strength.color;

        }


        if (scoreSummary) {

            scoreSummary.textContent =
                `Keyword match: ${result.keywordMatch.percentage}% • Skills: ${result.skillMatch.score}% • Experience: ${result.experienceMatch}%`;

        }


        updateMetric(
            keywordScore,
            keywordScoreBar,
            result.keywordMatch.percentage
        );


        updateMetric(
            skillsScore,
            skillsScoreBar,
            result.skillMatch.score
        );


        updateMetric(
            experienceScore,
            experienceScoreBar,
            result.experienceMatch
        );


        updateMetric(
            atsScore,
            atsScoreBar,
            result.atsCompatibility
        );


        updateMetric(
            qualityScore,
            qualityScoreBar,
            result.quality
        );


        const matchedForDisplay =
            unique(
                result.keywordMatch.matched
                    .map(item => item.term)
                    .concat(
                        result.skillMatch.matched
                    )
            );


        const missingForDisplay =
            unique(
                result.keywordMatch.missing
                    .map(item => item.term)
                    .concat(
                        result.skillMatch.missing
                    )
            );


        renderKeywords(
            matchedKeywords,
            matchedForDisplay,
            "matched"
        );


        renderKeywords(
            missingKeywords,
            missingForDisplay,
            "missing"
        );


        const suggestions =
            generateSuggestions(
                result
            );


        renderSuggestions(
            suggestions
        );


        animateScore(
            result.score,
            strength.color
        );


        setTimeout(() => {

            resultCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 150);

    }


    /* =================================================
       RESET
    ================================================= */

    if (resumeForm) {

        resumeForm.addEventListener(
            "reset",
            () => {

                setTimeout(() => {

                    if (fileName) {
                        fileName.textContent =
                            "No file selected";
                    }


                    if (previewContainer) {
                        previewContainer.classList.remove(
                            "active"
                        );
                    }


                    if (resultCard) {
                        resultCard.classList.remove(
                            "active"
                        );
                    }


                    if (progressContainer) {
                        progressContainer.hidden =
                            true;
                    }


                    if (matchedKeywords) {

                        matchedKeywords.innerHTML =
                            `<span class="keyword-empty">
                                No analysis yet.
                            </span>`;

                    }


                    if (missingKeywords) {

                        missingKeywords.innerHTML =
                            `<span class="keyword-empty">
                                No analysis yet.
                            </span>`;

                    }


                    if (suggestionList) {
                        suggestionList.innerHTML = "";
                    }


                    [
                        keywordScore,
                        skillsScore,
                        experienceScore,
                        atsScore,
                        qualityScore
                    ].forEach(element => {

                        if (element) {
                            element.textContent = "0%";
                        }

                    });


                    [
                        keywordScoreBar,
                        skillsScoreBar,
                        experienceScoreBar,
                        atsScoreBar,
                        qualityScoreBar
                    ].forEach(element => {

                        if (element) {
                            element.style.width = "0%";
                        }

                    });


                    if (score) {
                        score.textContent = "0%";
                    }


                    if (resumeStrength) {

                        resumeStrength.textContent =
                            "-";

                    }


                    if (scoreSummary) {

                        scoreSummary.textContent =
                            "Your analysis will appear here.";

                    }


                    if (circle) {

                        circle.style.strokeDashoffset =
                            440;

                        circle.style.stroke =
                            "#42a85f";

                    }


                    pdfDocument = null;


                }, 0);

            }
        );

    }


    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            () => {

                showToast(
                    "Form reset successfully."
                );

            }
        );

    }


    /* =================================================
       JOB SEARCH
    ================================================= */

    function filterJobs() {

        if (!jobsTable) {
            return;
        }


        const rows =
            jobsTable.querySelectorAll(
                "tbody tr"
            );


        const search =
            cleanForMatching(
                jobSearch
                    ? jobSearch.value
                    : ""
            );


        const location =
            jobLocation
                ? jobLocation.value
                : "all";


        let visibleCount = 0;


        rows.forEach(row => {

            const rowText =
                cleanForMatching(
                    row.textContent
                );


            const rowLocation =
                row.cells[2]
                    ? row.cells[2].textContent.trim()
                    : "";


            const searchMatch =
                !search ||
                rowText.includes(search);


            const locationMatch =
                location === "all" ||
                rowLocation === location;


            const visible =
                searchMatch &&
                locationMatch;


            row.style.display =
                visible ? "" : "none";


            if (visible) {
                visibleCount++;
            }

        });


        if (noJobs) {

            noJobs.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";

        }

    }


    if (jobSearch) {

        jobSearch.addEventListener(
            "input",
            filterJobs
        );

    }


    if (jobLocation) {

        jobLocation.addEventListener(
            "change",
            filterJobs
        );

    }


    /* =================================================
       JOB BUTTONS
    ================================================= */

    if (jobsTable) {

        jobsTable.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".job-btn"
                    );


                if (!button) {
                    return;
                }


                const row =
                    button.closest("tr");


                if (!row) {
                    return;
                }


                const company =
                    row.cells[0]
                        ? row.cells[0].textContent.trim()
                        : "";


                const role =
                    row.cells[1]
                        ? row.cells[1].textContent.trim()
                        : "";


                const location =
                    row.cells[2]
                        ? row.cells[2].textContent.trim()
                        : "";


                if (careerGoal) {

                    careerGoal.value =
                        role;

                }


                showToast(
                    `${role} at ${company} selected (${location}). Paste the matching JD to analyze it.`
                );


                if (resumeSection) {

                    resumeSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    }


    /* =================================================
       FEEDBACK
    ================================================= */

    if (feedbackBtn) {

        feedbackBtn.addEventListener(
            "click",
            () => {

                const feedback =
                    window.prompt(
                        "What would you improve in CareerPilot AI?"
                    );


                if (
                    feedback &&
                    feedback.trim()
                ) {

                    showToast(
                        "Thanks! Your feedback has been recorded for this session."
                    );

                }

            }
        );

    }


    /* =================================================
       INITIAL JOB FILTER
    ================================================= */

    filterJobs();


    /* =================================================
       PREVENT DRAG-DROP ACCIDENTS
    ================================================= */

    if (resumeInput) {

        [
            "dragenter",
            "dragover"
        ].forEach(eventName => {

            resumeInput.addEventListener(
                eventName,
                event => {
                    event.preventDefault();
                }
            );

        });

    }

});