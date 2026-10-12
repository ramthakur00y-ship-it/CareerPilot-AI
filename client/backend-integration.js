/*
    CareerPilot-AI
    Backend Integration JavaScript

    Backend:
    http://localhost:5000/api
*/

(function () {
    "use strict";

   const API_BASE = "https://careerpilot-ai-rjq5.onrender.com/api";

    const TOKEN_KEY = "careerPilotToken";
    const RESUME_ID_KEY = "careerPilotResumeId";


    // =========================================================
    // 1. COMMON API FUNCTION
    // =========================================================

    async function apiFetch(url, options = {}) {

        const token =
            localStorage.getItem(TOKEN_KEY);

        const headers =
            options.headers || {};

        if (token) {

            headers["Authorization"] =
                "Bearer " + token;
        }

        options.headers = headers;

        const response =
            await fetch(
                API_BASE + url,
                options
            );

        let data;

        try {

            data =
                await response.json();

        } catch (error) {

            data = {};

        }

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Something went wrong"
            );
        }

        return data;
    }


    // =========================================================
    // 2. TOAST MESSAGE
    // =========================================================

    function showToast(message) {

        let toast =
            document.getElementById(
                "careerPilotToast"
            );

        if (!toast) {

            toast =
                document.createElement("div");

            toast.id =
                "careerPilotToast";

            toast.style.position =
                "fixed";

            toast.style.bottom =
                "25px";

            toast.style.right =
                "25px";

            toast.style.zIndex =
                "99999";

            toast.style.padding =
                "12px 18px";

            toast.style.borderRadius =
                "8px";

            toast.style.background =
                "#222";

            toast.style.color =
                "#fff";

            toast.style.fontSize =
                "14px";

            toast.style.boxShadow =
                "0 5px 20px rgba(0,0,0,0.25)";

            document.body.appendChild(
                toast
            );
        }

        toast.textContent =
            message;

        toast.style.display =
            "block";

        setTimeout(function () {

            toast.style.display =
                "none";

        }, 3000);
    }


    // =========================================================
    // 3. LOGIN / REGISTER UI
    // =========================================================

    function addLoginRegisterUI() {

        const nav =
            document.querySelector("nav");

        if (!nav) {

            return;
        }

        if (
            document.getElementById(
                "careerPilotAuth"
            )
        ) {

            return;
        }

        const authDiv =
            document.createElement("div");

        authDiv.id =
            "careerPilotAuth";

        authDiv.style.display =
            "flex";

        authDiv.style.gap =
            "8px";

        authDiv.style.alignItems =
            "center";

        authDiv.innerHTML = `

            <button
                id="careerPilotLoginBtn"
                type="button">
                Login
            </button>

            <button
                id="careerPilotRegisterBtn"
                type="button">
                Register
            </button>

            <button
                id="careerPilotLogoutBtn"
                type="button"
                style="display:none;">
                Logout
            </button>

        `;

        nav.appendChild(authDiv);

        createAuthModal();


        document
            .getElementById(
                "careerPilotLoginBtn"
            )
            .addEventListener(
                "click",
                function () {

                    openAuthModal("login");

                }
            );


        document
            .getElementById(
                "careerPilotRegisterBtn"
            )
            .addEventListener(
                "click",
                function () {

                    openAuthModal("register");

                }
            );


        document
            .getElementById(
                "careerPilotLogoutBtn"
            )
            .addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        TOKEN_KEY
                    );

                    localStorage.removeItem(
                        RESUME_ID_KEY
                    );

                    updateAuthButtons();

                    showToast(
                        "Logged out successfully"
                    );

                }
            );


        updateAuthButtons();
    }


    // =========================================================
    // 4. AUTH MODAL
    // =========================================================

    function createAuthModal() {

        if (
            document.getElementById(
                "careerPilotAuthModal"
            )
        ) {

            return;
        }

        const modal =
            document.createElement("div");

        modal.id =
            "careerPilotAuthModal";

        modal.style.display =
            "none";

        modal.style.position =
            "fixed";

        modal.style.top =
            "0";

        modal.style.left =
            "0";

        modal.style.width =
            "100%";

        modal.style.height =
            "100%";

        modal.style.background =
            "rgba(0,0,0,0.6)";

        modal.style.zIndex =
            "100000";


        modal.innerHTML = `

            <div style="
                width:90%;
                max-width:450px;
                margin:80px auto;
                background:white;
                padding:25px;
                border-radius:12px;
            ">

                <button
                    id="careerPilotCloseAuth"
                    type="button"
                    style="float:right;">
                    X
                </button>

                <h2 id="careerPilotAuthTitle">
                    Login
                </h2>

                <form
                    id="careerPilotAuthForm">

                    <div
                        id="careerPilotRegisterFields">

                        <input
                            id="careerPilotName"
                            type="text"
                            placeholder="Full Name">

                        <br><br>

                        <input
                            id="careerPilotExperience"
                            type="text"
                            placeholder="Experience">

                        <br><br>

                        <input
                            id="careerPilotJobType"
                            type="text"
                            placeholder="Job Type">

                        <br><br>

                        <input
                            id="careerPilotCareerGoal"
                            type="text"
                            placeholder="Career Goal">

                        <br><br>

                        <input
                            id="careerPilotSkills"
                            type="text"
                            placeholder="Skills (Java, HTML, CSS)">

                        <br><br>

                    </div>


                    <input
                        id="careerPilotEmail"
                        type="email"
                        placeholder="Email"
                        required>

                    <br><br>


                    <input
                        id="careerPilotPassword"
                        type="password"
                        placeholder="Password"
                        required>

                    <br><br>


                    <button
                        type="submit">
                        Submit
                    </button>

                </form>


                <p
                    id="careerPilotAuthMessage">
                </p>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        document
            .getElementById(
                "careerPilotCloseAuth"
            )
            .addEventListener(
                "click",
                function () {

                    modal.style.display =
                        "none";

                }
            );


        document
            .getElementById(
                "careerPilotAuthForm"
            )
            .addEventListener(
                "submit",
                handleAuthSubmit
            );
    }


    // =========================================================
    // 5. AUTH MODE
    // =========================================================

    let authMode = "login";


    function openAuthModal(mode) {

        authMode =
            mode;

        const modal =
            document.getElementById(
                "careerPilotAuthModal"
            );

        const title =
            document.getElementById(
                "careerPilotAuthTitle"
            );

        const registerFields =
            document.getElementById(
                "careerPilotRegisterFields"
            );


        if (mode === "register") {

            title.textContent =
                "Register";

            registerFields.style.display =
                "block";

        } else {

            title.textContent =
                "Login";

            registerFields.style.display =
                "none";
        }


        document.getElementById(
            "careerPilotAuthMessage"
        ).textContent = "";


        modal.style.display =
            "block";
    }


    // =========================================================
    // 6. LOGIN / REGISTER SUBMIT
    // =========================================================

    async function handleAuthSubmit(event) {

        event.preventDefault();

        const message =
            document.getElementById(
                "careerPilotAuthMessage"
            );


        try {

            if (authMode === "register") {

                const skillsText =
                    document.getElementById(
                        "careerPilotSkills"
                    ).value;


                const skills =
                    skillsText
                        .split(",")
                        .map(
                            function (skill) {

                                return skill.trim();

                            }
                        )
                        .filter(Boolean);


                const body = {

                    name:
                        document.getElementById(
                            "careerPilotName"
                        ).value,

                    email:
                        document.getElementById(
                            "careerPilotEmail"
                        ).value,

                    password:
                        document.getElementById(
                            "careerPilotPassword"
                        ).value,

                    experience:
                        document.getElementById(
                            "careerPilotExperience"
                        ).value,

                    jobType:
                        document.getElementById(
                            "careerPilotJobType"
                        ).value,

                    careerGoal:
                        document.getElementById(
                            "careerPilotCareerGoal"
                        ).value,

                    skills:
                        skills
                };


                const result =
                    await apiFetch(
                        "/auth/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(body)
                        }
                    );


                message.textContent =
                    result.message ||
                    "Registration successful";


                showToast(
                    "Registration successful. Please login."
                );


                setTimeout(
                    function () {

                        openAuthModal(
                            "login"
                        );

                    },
                    1000
                );


            } else {

                const body = {

                    email:
                        document.getElementById(
                            "careerPilotEmail"
                        ).value,

                    password:
                        document.getElementById(
                            "careerPilotPassword"
                        ).value
                };


                const result =
                    await apiFetch(
                        "/auth/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(body)
                        }
                    );


                localStorage.setItem(
                    TOKEN_KEY,
                    result.token
                );


                message.textContent =
                    "Login successful";


                showToast(
                    "Login successful"
                );


                updateAuthButtons();


                setTimeout(
                    function () {

                        document.getElementById(
                            "careerPilotAuthModal"
                        ).style.display =
                            "none";

                    },
                    700
                );
            }


        } catch (error) {

            message.textContent =
                error.message;

            showToast(
                error.message
            );
        }
    }


    // =========================================================
    // 7. UPDATE AUTH BUTTONS
    // =========================================================

    function updateAuthButtons() {

        const token =
            localStorage.getItem(
                TOKEN_KEY
            );


        const login =
            document.getElementById(
                "careerPilotLoginBtn"
            );

        const register =
            document.getElementById(
                "careerPilotRegisterBtn"
            );

        const logout =
            document.getElementById(
                "careerPilotLogoutBtn"
            );


        if (
            !login ||
            !register ||
            !logout
        ) {

            return;
        }


        if (token) {

            login.style.display =
                "none";

            register.style.display =
                "none";

            logout.style.display =
                "inline-block";

        } else {

            login.style.display =
                "inline-block";

            register.style.display =
                "inline-block";

            logout.style.display =
                "none";
        }
    }


    // =========================================================
    // 8. REAL ATS ANALYSIS
    // =========================================================

    function setupRealATS() {

        const resumeForm =
            document.getElementById(
                "resumeForm"
            );

        if (!resumeForm) {
            return;
        }

        // Prevent duplicate ATS setup.
        if (resumeForm.dataset.careerPilotATSBound === "true") {
            return;
        }

        resumeForm.dataset.careerPilotATSBound = "true";
        resumeForm.setAttribute("novalidate", "true");

        // Safety net: never allow the browser to perform the native
        // form navigation/submission. ATS is handled through fetch().
        resumeForm.onsubmit = function (event) {
            event.preventDefault();
            return false;
        };

        // Capture the submit event before any normal form action can run.
        resumeForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                handleRealATS(event);
            },
            true
        );

        // Also handle the actual ATS button directly. This prevents the
        // browser's native submit/navigation action completely.
        const atsButton =
            resumeForm.querySelector(
                'button[type="submit"]'
            );

        if (atsButton) {
            atsButton.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    handleRealATS(event);
                },
                true
            );
        }

        const resetBtn =
            document.getElementById(
                "resetBtn"
            );

        if (resetBtn) {
            resetBtn.addEventListener(
                "click",
                resetATSResult
            );
        }
    }

    // =========================================================
    // 9. SEND RESUME TO BACKEND
    // =========================================================

    async function handleRealATS(event) {

        event.preventDefault();


        // -----------------------------------------------------
        // Check Login
        // -----------------------------------------------------

        const token =
            localStorage.getItem(
                TOKEN_KEY
            );

        if (!token) {

            showToast(
                "Please login before running ATS analysis."
            );

            openAuthModal("login");

            return;
        }


        // -----------------------------------------------------
        // Get Form Values
        // -----------------------------------------------------

        const resumeInput =
            document.getElementById(
                "resume"
            );

        const jobDescription =
            document.getElementById(
                "jobDescription"
            );

        const targetTitle =
            document.getElementById(
                "targetJobTitle"
            );

        const targetCompany =
            document.getElementById(
                "targetCompany"
            );

        const experience =
            document.getElementById(
                "experience"
            );


        // -----------------------------------------------------
        // Check Resume File
        // -----------------------------------------------------

        const selectedFile =
            (resumeInput && resumeInput.files && resumeInput.files.length > 0)
                ? resumeInput.files[0]
                : window.careerPilotSelectedResumeFile;

        if (!selectedFile) {

            showToast(
                "Please select your resume first."
            );

            return;
        }


        // -----------------------------------------------------
        // Check Job Description
        // -----------------------------------------------------

        if (
            !jobDescription ||
            jobDescription.value.trim() === ""
        ) {

            showToast(
                "Please enter the Job Description."
            );

            return;
        }


        const file = selectedFile;


        // -----------------------------------------------------
        // Allowed File Types
        // -----------------------------------------------------

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];


        const allowedExtensions = [
            ".pdf",
            ".doc",
            ".docx"
        ];


        const fileName =
            file.name.toLowerCase();


        const validExtension =
            allowedExtensions.some(
                function (extension) {

                    return fileName.endsWith(
                        extension
                    );

                }
            );


        if (
            !allowedTypes.includes(file.type) &&
            !validExtension
        ) {

            showToast(
                "Please upload PDF, DOC or DOCX file."
            );

            return;
        }


        // -----------------------------------------------------
        // Create FormData
        // -----------------------------------------------------

        const formData =
            new FormData();


        formData.append(
            "resume",
            file
        );


        formData.append(
            "jobDescription",
            jobDescription.value.trim()
        );
        // -----------------------------------------------------
// Existing Resume ID
// -----------------------------------------------------

const resumeId =
    localStorage.getItem(
        RESUME_ID_KEY
    );

if (resumeId) {

    formData.append(
        "resumeId",
        resumeId
    );

    console.log(
        "ATS Resume ID:",
        resumeId
    );

} else {

    console.log(
        "ATS Resume ID: NOT FOUND"
    );
}


        // -----------------------------------------------------
        // Loading State
        // -----------------------------------------------------

        const submitButton =
            resumeForm.querySelector(
                'button[type="submit"]'
            );


        const oldButtonText =
            submitButton
                ? submitButton.textContent
                : "";
                        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Analyzing...";
        }


        showToast(
            "Resume is being analyzed..."
        );


        try {

            // -------------------------------------------------
            // Call REAL Backend ATS API
            // -------------------------------------------------

            const result =
                await apiFetch(
                    "/ats/analyze",
                    {
                        method: "POST",

                        body:
                            formData
                    }
                );


            // -------------------------------------------------
            // Save Analysis / Resume ID if available
            // -------------------------------------------------

            if (result.resumeId) {

                localStorage.setItem(
                    RESUME_ID_KEY,
                    result.resumeId
                );
            }


            // -------------------------------------------------
            // Show Result
            // -------------------------------------------------

            displayATSResult(
                result,
                targetTitle
                    ? targetTitle.value
                    : "Target Role",

                targetCompany
                    ? targetCompany.value
                    : "Target Company",

                experience
                    ? experience.value
                    : "Not specified"
            );


            showToast(
                "ATS analysis completed successfully."
            );


        } catch (error) {

            console.error(
                "ATS Error:",
                error
            );

            showToast(
                error.message ||
                "ATS analysis failed."
            );


        } finally {

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    oldButtonText ||
                    "Run ATS Analysis";
            }
        }
    }


    // =========================================================
    // 10. DISPLAY REAL ATS RESULT
    // =========================================================

    function displayATSResult(
        result,
        targetTitle,
        targetCompany,
        experience
    ) {
          const atsResultCard =
        document.getElementById("resultCard");

    if (atsResultCard) {

        atsResultCard.style.display = "block";
    }

        // -----------------------------------------------------
        // Get Real Score From Backend
        // -----------------------------------------------------

        const finalScore =
            Number(
                result.atsScore || 0
            );

            


        // -----------------------------------------------------
        // Header
        // -----------------------------------------------------

        const reportTitle =
            document.getElementById(
                "reportTargetTitle"
            );

        if (reportTitle) {

            reportTitle.textContent =
                targetTitle || "Target Role";
        }


        const reportCompany =
            document.getElementById(
                "reportTargetCompany"
            );

        if (reportCompany) {

            reportCompany.textContent =
                targetCompany || "Target Company";
        }


        const reportExperience =
            document.getElementById(
                "reportExperienceFit"
            );

        if (reportExperience) {

            reportExperience.textContent =
                experience || "Not specified";
        }


        // -----------------------------------------------------
        // Score
        // -----------------------------------------------------

        const score =
            document.getElementById(
                "score"
            );

        if (score) {

            score.textContent =
                finalScore + "%";
        }


        const progressBar =
            document.getElementById(
                "progressBar"
            );

        if (progressBar) {

            progressBar.style.width =
                finalScore + "%";
        }


        const jobMatchScore =
            document.getElementById(
                "jobMatchScore"
            );

        if (jobMatchScore) {

            jobMatchScore.textContent =
                finalScore + "%";
        }


        const jobMatchFill =
            document.getElementById(
                "jobMatchFill"
            );

        if (jobMatchFill) {

            jobMatchFill.style.width =
                finalScore + "%";
        }


        // -----------------------------------------------------
        // Circle Score
        // -----------------------------------------------------

        const circle =
            document.getElementById(
                "circle"
            );


        if (circle) {

            try {

                const radius =
                    circle.r.baseVal.value;

                const circumference =
                    2 * Math.PI * radius;

                const offset =
                    circumference -
                    (finalScore / 100) *
                    circumference;


                circle.style.strokeDasharray =
                    `${circumference} ${circumference}`;

                circle.style.strokeDashoffset =
                    offset;

            } catch (error) {

                console.log(
                    "Circle update skipped."
                );
            }
        }


        // -----------------------------------------------------
        // Verdict
        // -----------------------------------------------------

        const strengthEl =
            document.getElementById(
                "resumeStrength"
            );

        const resultTextEl =
            document.getElementById(
                "resultText"
            );


        if (finalScore >= 85) {

            if (strengthEl) {

                strengthEl.textContent =
                    "High Optimization";
            }

            if (resultTextEl) {

                resultTextEl.textContent =
                    "Your resume has strong alignment with the provided job description.";
            }


        } else if (finalScore >= 70) {

            if (strengthEl) {

                strengthEl.textContent =
                    "Moderate Optimization";
            }

            if (resultTextEl) {

                resultTextEl.textContent =
                    "Your resume has a reasonable match with the provided job description. Review the missing keywords and skills.";
            }


        } else {

            if (strengthEl) {

                strengthEl.textContent =
                    "Needs Improvement";
            }

            if (resultTextEl) {

                resultTextEl.textContent =
                    "There are several differences between your resume and the provided job description.";
            }
        }


        // -----------------------------------------------------
        // Backend Arrays
        // -----------------------------------------------------
// -----------------------------------------------------
// Backend Arrays - FIXED
// -----------------------------------------------------

function normalizeATSArray(value) {

    // Backend returned actual array
    if (Array.isArray(value)) {

        return value
            .flat(Infinity)
            .map(function (item) {

                if (typeof item === "string") {
                    return item.trim();
                }

                if (item && typeof item === "object") {

                    return (
                        item.name ||
                        item.skill ||
                        item.keyword ||
                        item.value ||
                        item.title ||
                        ""
                    ).toString().trim();
                }

                return "";
            })
            .filter(Boolean);
    }


    // Backend returned string
    // Example:
    // "Java, SQL, HTML, CSS"
    if (typeof value === "string") {

        return value
            .split(/[,|\n]+/)
            .map(function (item) {
                return item.trim();
            })
            .filter(Boolean);
    }


    // Backend returned object
    if (value && typeof value === "object") {

        // Example:
        // { skills: ["Java", "SQL"] }
        // { keywords: ["HTML", "CSS"] }

        const nested =
            value.items ??
            value.skills ??
            value.keywords ??
            value.data ??
            value.values;

        if (nested !== undefined) {

            return normalizeATSArray(nested);
        }


        // Example:
        // { 0: "Java", 1: "SQL", 2: "MongoDB" }

        return Object.values(value)
            .flat(Infinity)
            .map(function (item) {

                if (typeof item === "string") {
                    return item.trim();
                }

                if (item && typeof item === "object") {

                    return (
                        item.name ||
                        item.skill ||
                        item.keyword ||
                        item.value ||
                        item.title ||
                        ""
                    ).toString().trim();
                }

                return "";
            })
            .filter(Boolean);
    }


    return [];
}


// Backend response directly OR inside result.data
const atsData =
    result &&
    result.data &&
    typeof result.data === "object"
        ? result.data
        : result;


// Matched Skills
const matchedSkills = normalizeATSArray(
    atsData.matchedSkills ??
    atsData.matchedSkill
);


// Missing Skills
const missingSkills = normalizeATSArray(
    atsData.missingSkills ??
    atsData.missingSkill
);


// Matched Keywords
const matchedKeywords = normalizeATSArray(
    atsData.matchedKeywords ??
    atsData.matchedKeyword
);


// Missing Keywords
const missingKeywords = normalizeATSArray(
    atsData.missingKeywords ??
    atsData.missingKeyword
);
        

        // -----------------------------------------------------
        // Counts
        // -----------------------------------------------------

        const requiredCount =
            document.getElementById(
                "requiredCount"
            );

        if (requiredCount) {

            requiredCount.textContent =
                matchedSkills.length;
        }


        const preferredCount =
            document.getElementById(
                "preferredCount"
            );

        if (preferredCount) {

            preferredCount.textContent =
                missingSkills.length;
        }


        // -----------------------------------------------------
        // Matched Keywords
        // -----------------------------------------------------

        renderBadges(
            "matchedKeywords",
            matchedKeywords,
            "badge-matched"
        );


        // -----------------------------------------------------
        // Missing Keywords
        // -----------------------------------------------------

        renderBadges(
            "missingKeywords",
            missingKeywords,
            "badge-missing"
        );


        // -----------------------------------------------------
        // Matched Skills
        // -----------------------------------------------------

        renderBadges(
            "requiredKeywords",
            matchedSkills,
            "badge-required"
        );


        // -----------------------------------------------------
        // Missing Skills
        // -----------------------------------------------------

        renderBadges(
            "preferredKeywords",
            missingSkills,
            "badge-preferred"
        );


        // -----------------------------------------------------
        // Critical Missing Skills
        // -----------------------------------------------------

        const criticalBox =
            document.getElementById(
                "criticalMissingSkills"
            );


        if (criticalBox) {

            if (missingSkills.length === 0) {

                criticalBox.innerHTML =
                    "<p>No major missing skills detected.</p>";

            } else {

                criticalBox.innerHTML =
                    missingSkills
                        .map(
                            function (skill) {

                                return `
                                    <div class="pill-tag missing">
                                        ${escapeHTML(skill)}
                                    </div>
                                `;

                            }
                        )
                        .join("");
            }
        }


        // -----------------------------------------------------
        // Experience Gap
        // -----------------------------------------------------

        const experienceGap =
            document.getElementById(
                "experienceGap"
            );


        if (experienceGap) {

            experienceGap.textContent =
                "The ATS score was calculated by comparing your uploaded resume with the provided job description.";
        }


        // -----------------------------------------------------
        // Improvement Potential
        // -----------------------------------------------------

        const improvementPotential =
            document.getElementById(
                "improvementPotential"
            );


        if (improvementPotential) {

            if (missingKeywords.length > 0) {

                improvementPotential.textContent =
                    "Adding relevant missing keywords and skills from the job description may improve the match.";

            } else {

                improvementPotential.textContent =
                    "No major missing keywords were detected in the current analysis.";
            }
        }


        // -----------------------------------------------------
        // Skill Priority
        // -----------------------------------------------------

        const skillPriority =
            document.getElementById(
                "skillPriority"
            );


        if (skillPriority) {

            if (missingSkills.length > 0) {

                skillPriority.innerHTML = `
                    <ol style="margin: 0; padding-left: 20px; color: #334155; line-height: 1.6;">
                        ${missingSkills
                            .slice(0, 5)
                            .map(
                                function (skill) {

                                    return `
                                        <li>
                                            Review the "${escapeHTML(skill)}" requirement in the job description.
                                        </li>
                                    `;

                                }
                            )
                            .join("")}
                    </ol>
                `;

            } else {

                skillPriority.innerHTML =
                    "<p>No missing skills were identified.</p>";
            }
        }


        // -----------------------------------------------------
        // Suggestions
        // -----------------------------------------------------

        const suggestionList =
            document.getElementById(
                "suggestionList"
            );


        if (suggestionList) {

            const suggestions = [];


            if (missingKeywords.length > 0) {

                suggestions.push(
                    "Review the missing keywords identified from the job description."
                );
            }


            if (missingSkills.length > 0) {

                suggestions.push(
                    "Check whether the missing skills are relevant to your target role and add genuine experience where applicable."
                );
            }


            suggestions.push(
                "Keep resume section headings clear and standard, such as Skills, Education, Projects and Work Experience."
            );


            suggestionList.innerHTML =
                suggestions
                    .map(
                        function (suggestion) {

                            return `
                                <li>
                                    ${escapeHTML(suggestion)}
                                </li>
                            `;

                        }
                    )
                    .join("");
        }


        // -----------------------------------------------------
        // Scroll To Result
        // -----------------------------------------------------

        const atsresultCard =
            document.getElementById(
                "resultCard"
            );


        if (atsresultCard) {

            atsresultCard.scrollIntoView({
                behavior: "smooth"
            });
        }
    }


    // =========================================================
    // 11. RENDER BADGES
    // =========================================================

    function renderBadges(
        containerId,
        items,
        className
    ) {

        const container =
            document.getElementById(
                containerId
            );


        if (!container) {

            return;
        }


        if (
            !items ||
            items.length === 0
        ) {

            container.innerHTML =
                "<span>No data</span>";

            return;
        }


        container.innerHTML =
            items
                .map(
                    function (item) {

                        return `
                            <span class="keyword-pill ${className}">
                                ${escapeHTML(item)}
                            </span>
                        `;

                    }
                )
                .join("");
    }


    // =========================================================
    // 12. ESCAPE HTML
    // =========================================================

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            value;

        return div.innerHTML;
    }


    // =========================================================
    // 13. RESET ATS RESULT
    // =========================================================

    function resetATSResult() {

        const score =
            document.getElementById(
                "score"
            );

        if (score) {

            score.textContent =
                "0%";
        }


        const progressBar =
            document.getElementById(
                "progressBar"
            );

        if (progressBar) {

            progressBar.style.width =
                "0%";
        }


        const jobMatchScore =
            document.getElementById(
                "jobMatchScore"
            );

        if (jobMatchScore) {

            jobMatchScore.textContent =
                "0%";
        }


        const jobMatchFill =
            document.getElementById(
                "jobMatchFill"
            );

        if (jobMatchFill) {

            jobMatchFill.style.width =
                "0%";
        }


        const strength =
            document.getElementById(
                "resumeStrength"
            );

        if (strength) {

            strength.textContent =
                "Evaluating...";
        }


        const resultText =
            document.getElementById(
                "resultText"
            );

        if (resultText) {

            resultText.textContent =
                "Your score breakdown across custom matching filters.";
        }


        const containers = [
            "requiredKeywords",
            "preferredKeywords",
            "matchedKeywords",
            "missingKeywords"
        ];


        containers.forEach(
            function (id) {

                const element =
                    document.getElementById(id);

                if (element) {

                    element.innerHTML =
                        "";
                }
            }
        );


        const critical =
            document.getElementById(
                "criticalMissingSkills"
            );

        if (critical) {

            critical.innerHTML =
                "";
        }


        const experienceGap =
            document.getElementById(
                "experienceGap"
            );

        if (experienceGap) {

            experienceGap.textContent =
                "";
        }


        const improvement =
            document.getElementById(
                "improvementPotential"
            );

        if (improvement) {

            improvement.textContent =
                "";
        }


        const skillPriority =
            document.getElementById(
                "skillPriority"
            );

        if (skillPriority) {

            skillPriority.innerHTML =
                "";
        }


        const suggestions =
            document.getElementById(
                "suggestionList"
            );

        if (suggestions) {

            suggestions.innerHTML =
                "";
        }
    }


    // =========================================================
    // 14. START
    // =========================================================

    function startCareerPilotIntegration() {

        addLoginRegisterUI();

        setupRealATS();
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startCareerPilotIntegration
        );

    } else {

        startCareerPilotIntegration();
    }

})();