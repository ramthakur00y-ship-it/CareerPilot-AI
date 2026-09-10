/* =====================================================
   CAREERPILOT AI - COMPLETE FRONTEND JAVASCRIPT
   STEP 2 - JOB-SPECIFIC ATS UPGRADE
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ===================================================
     HELPERS
     =================================================== */

  const $ = (id) => document.getElementById(id);

  const startBtn = $("startBtn");
  const resumeSection = $("resume-section");

  const mobileMenuBtn = $("mobileMenuBtn");
  const navLinks = $("navLinks");
  const themeToggle = $("themeToggle");

  const resumeForm = $("resumeForm");
  const resumeInput = $("resume");
  const fileName = $("fileName");

  const previewContainer = $("previewContainer");
  const pdfMessage = $("pdfMessage");
  const pdfViewer = $("pdfViewer");
  const pdfCanvas = $("pdfCanvas");

  const zoomIn = $("zoomIn");
  const zoomOut = $("zoomOut");
  const closePreview = $("closePreview");

  const resultCard = $("resultCard");
  const resultText = $("resultText");
  const progressBar = $("progressBar");
  const score = $("score");
  const circle = $("circle");
  const resumeStrength = $("resumeStrength");
  const suggestionList = $("suggestionList");

  const matchedKeywords = $("matchedKeywords");
  const missingKeywords = $("missingKeywords");
  const scoreBreakdown = $("scoreBreakdown");

  const resetBtn = $("resetBtn");
  const feedbackBtn = $("feedbackBtn");

  const jobSearch = $("jobSearch");
  const jobLocation = $("jobLocation");
  const jobsTable = $("jobsTable");
  const noJobs = $("noJobs");

  const jobDescription = $("jobDescription");

  const targetJobTitle = $("targetJobTitle");
  const targetCompany = $("targetCompany");

  const jobTargetInfo = $("jobTargetInfo");
  const jobMatchScore = $("jobMatchScore");
  const jobMatchFill = $("jobMatchFill");
  const reportTargetTitle = $("reportTargetTitle");
  const reportTargetCompany = $("reportTargetCompany");
  const reportExperienceFit = $("reportExperienceFit");

  const requiredKeywords = $("requiredKeywords");
  const preferredKeywords = $("preferredKeywords");
  const requiredCount = $("requiredCount");
  const preferredCount = $("preferredCount");

  const criticalMissingSkills = $("criticalMissingSkills");
  const experienceGap = $("experienceGap");
  const improvementPotential = $("improvementPotential");
  const skillPriority = $("skillPriority");

  /* ===================================================
     STATE
     =================================================== */

  let pdfDoc = null;
  let pdfScale = 1;
  let currentPdfBytes = null;
  let toastTimer = null;

  let pdfjsLib = null;
  let mammothLib = null;
  let tesseractLib = null;

  /* ===================================================
     LIBRARY LOADER
     =================================================== */

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[data-careerpilot-src="${src}"]`
      );

      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });

        if (
          existing.dataset.loaded === "true" ||
          existing.readyState === "complete"
        ) {
          resolve();
        }

        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.careerpilotSrc = src;

      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };

      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  async function loadLibraries() {
    if (!pdfjsLib) {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        );

        pdfjsLib = window.pdfjsLib || window["pdfjs-dist/build/pdf"];
      } catch (error) {
        console.warn("PDF.js failed to load.", error);
      }
    }

    if (pdfjsLib) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      } catch (error) {
        console.warn("PDF worker configuration failed.", error);
      }
    }

    if (!mammothLib) {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js"
        );

        mammothLib = window.mammoth;
      } catch (error) {
        console.warn("Mammoth failed to load.", error);
      }
    }

    if (!tesseractLib) {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"
        );

        tesseractLib = window.Tesseract;
      } catch (error) {
        console.warn("Tesseract failed to load.", error);
      }
    }
  }

  /* ===================================================
     TOAST
     =================================================== */

  function showToast(message) {
    const toast = $("toast");

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

  /* ===================================================
     HERO
     =================================================== */

  if (startBtn && resumeSection) {
    startBtn.addEventListener("click", () => {
      resumeSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  /* ===================================================
     MOBILE MENU
     =================================================== */

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      const active = navLinks.classList.toggle("active");

      mobileMenuBtn.setAttribute(
        "aria-expanded",
        String(active)
      );

      mobileMenuBtn.setAttribute(
        "aria-label",
        active ? "Close menu" : "Open menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ===================================================
     DARK MODE
     =================================================== */

  const savedTheme = localStorage.getItem("careerPilotTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");

    if (themeToggle) {
      themeToggle.textContent = "☀️";
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const dark = document.body.classList.toggle("dark-mode");

      localStorage.setItem(
        "careerPilotTheme",
        dark ? "dark" : "light"
      );

      themeToggle.textContent = dark ? "☀️" : "🌙";
    });
  }

  /* ===================================================
     FILE HANDLING
     =================================================== */

  if (resumeInput) {
    resumeInput.addEventListener("change", async () => {
      const file = resumeInput.files && resumeInput.files[0];

      if (!file) {
        fileName.textContent = "No file selected";
        return;
      }

      const extension = getExtension(file.name);

      if (!["pdf", "docx"].includes(extension)) {
        resumeInput.value = "";
        fileName.textContent = "No file selected";
        showToast("Please choose a PDF or DOCX file.");
        return;
      }

      fileName.textContent =
        `${file.name} • ${formatBytes(file.size)}`;

      if (extension === "pdf") {
        await preparePdfPreview(file);
      } else {
        previewContainer.style.display = "none";
      }
    });
  }

  function getExtension(name) {
    const parts = name.toLowerCase().split(".");
    return parts.length > 1 ? parts.pop() : "";
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "0 KB";
    }

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(
      index === 0 ? 0 : 1
    )} ${units[index]}`;
  }

  /* ===================================================
     PDF PREVIEW
     =================================================== */

  async function preparePdfPreview(file) {
    previewContainer.style.display = "block";

    pdfMessage.textContent = "Loading PDF preview...";

    try {
      await loadLibraries();

      if (!pdfjsLib) {
        throw new Error("PDF viewer library could not be loaded.");
      }

      const arrayBuffer = await file.arrayBuffer();

      currentPdfBytes = new Uint8Array(arrayBuffer);

      pdfDoc = await pdfjsLib.getDocument({
        data: currentPdfBytes
      }).promise;

      pdfScale = 1;

      await renderPdfPage(1);

      pdfMessage.textContent =
        `Preview ready • ${pdfDoc.numPages} page${pdfDoc.numPages === 1 ? "" : "s"}`;

    } catch (error) {
      console.error(error);

      pdfMessage.textContent =
        "Preview unavailable. The analyzer can still attempt text extraction.";

      showToast(
        "PDF preview could not be loaded, but analysis may still work."
      );
    }
  }

  async function renderPdfPage(pageNumber) {
    if (!pdfDoc || !pdfCanvas) {
      return;
    }

    const page = await pdfDoc.getPage(pageNumber);

    const viewport = page.getViewport({
      scale: pdfScale
    });

    const context = pdfCanvas.getContext("2d");

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    pdfCanvas.style.transform =
      `scale(${Math.max(pdfScale, 0.7)})`;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;
  }

  if (zoomIn) {
    zoomIn.addEventListener("click", async () => {
      if (!pdfDoc) {
        return;
      }

      pdfScale = Math.min(pdfScale + 0.15, 2.5);

      try {
        await renderPdfPage(1);
      } catch (error) {
        console.error(error);
      }
    });
  }

  if (zoomOut) {
    zoomOut.addEventListener("click", async () => {
      if (!pdfDoc) {
        return;
      }

      pdfScale = Math.max(pdfScale - 0.15, 0.5);

      try {
        await renderPdfPage(1);
      } catch (error) {
        console.error(error);
      }
    });
  }

  if (closePreview) {
    closePreview.addEventListener("click", () => {
      previewContainer.style.display = "none";
    });
  }

  /* ===================================================
     TEXT EXTRACTION
     =================================================== */

  async function extractResumeText(file) {
    const extension = getExtension(file.name);

    if (extension === "pdf") {
      return extractPdfText(file);
    }

    if (extension === "docx") {
      return extractDocxText(file);
    }

    throw new Error("Unsupported resume format.");
  }

  async function extractPdfText(file) {
    await loadLibraries();

    if (!pdfjsLib) {
      throw new Error(
        "PDF reader could not be loaded. Please check your internet connection."
      );
    }

    const buffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer)
    });

    const doc = await loadingTask.promise;

    let allText = "";

    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str || "")
        .join(" ");

      allText += `\n${pageText}\n`;
    }

    const cleaned = cleanText(allText);

    if (isUsefulResumeText(cleaned)) {
      return cleaned;
    }

    showToast(
      "This PDF appears image-based. Starting OCR fallback..."
    );

    return extractPdfWithOCR(doc);
  }

  async function extractPdfWithOCR(doc) {
    await loadLibraries();

    if (!tesseractLib) {
      throw new Error(
        "OCR library could not be loaded for this PDF."
      );
    }

    const worker = await tesseractLib.createWorker("eng");

    let combined = "";

    try {
      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
        pdfMessage.textContent =
          `OCR processing page ${pageNumber} of ${doc.numPages}...`;

        const page = await doc.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: 1.6
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({
          canvasContext: context,
          viewport
        }).promise;

        const result = await worker.recognize(canvas);

        combined += `\n${result.data.text}\n`;
      }
    } finally {
      await worker.terminate();
    }

    return cleanText(combined);
  }

  async function extractDocxText(file) {
    await loadLibraries();

    if (!mammothLib) {
      throw new Error(
        "DOCX reader could not be loaded."
      );
    }

    const buffer = await file.arrayBuffer();

    const result = await mammothLib.extractRawText({
      arrayBuffer: buffer
    });

    return cleanText(result.value);
  }

  function cleanText(text) {
    return String(text || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function isUsefulResumeText(text) {
    if (!text || text.length < 80) {
      return false;
    }

    const words = text.split(/\s+/).filter(Boolean);

    if (words.length < 25) {
      return false;
    }

    const alphabetic = text.replace(/[^a-z]/gi, "");

    return alphabetic.length >= 40;
  }

  /* ===================================================
     ATS SKILL DATABASE
     =================================================== */

  const SKILL_ALIASES = {
    "JavaScript": [
      "javascript",
      "js",
      "ecmascript"
    ],

    "TypeScript": [
      "typescript",
      "ts"
    ],

    "React": [
      "react",
      "react.js",
      "reactjs"
    ],

    "Angular": [
      "angular",
      "angular.js"
    ],

    "Vue.js": [
      "vue",
      "vue.js",
      "vuejs"
    ],

    "Node.js": [
      "node",
      "node.js",
      "nodejs"
    ],

    "Express.js": [
      "express",
      "express.js",
      "expressjs"
    ],

    "Python": [
      "python"
    ],

    "Java": [
      "java"
    ],

    "C++": [
      "c++",
      "cpp"
    ],

    "C": [
      "c programming",
      " c "
    ],

    "HTML": [
      "html",
      "html5"
    ],

    "CSS": [
      "css",
      "css3"
    ],

    "Tailwind CSS": [
      "tailwind",
      "tailwind css"
    ],

    "Bootstrap": [
      "bootstrap"
    ],

    "MongoDB": [
      "mongodb",
      "mongo db",
      "mongo"
    ],

    "MySQL": [
      "mysql"
    ],

    "PostgreSQL": [
      "postgresql",
      "postgres"
    ],

    "SQL": [
      "sql"
    ],

    "NoSQL": [
      "nosql",
      "no sql"
    ],

    "Spring Boot": [
      "spring boot",
      "springboot"
    ],

    "Git": [
      "git"
    ],

    "GitHub": [
      "github",
      "git hub"
    ],

    "AWS": [
      "aws",
      "amazon web services"
    ],

    "Azure": [
      "azure",
      "microsoft azure"
    ],

    "Google Cloud": [
      "google cloud",
      "gcp"
    ],

    "Docker": [
      "docker"
    ],

    "Kubernetes": [
      "kubernetes",
      "k8s"
    ],

    "Jenkins": [
      "jenkins"
    ],

    "REST API": [
      "rest api",
      "restful api",
      "rest services",
      "rest"
    ],

    "GraphQL": [
      "graphql"
    ],

    "Machine Learning": [
      "machine learning",
      "ml"
    ],

    "Artificial Intelligence": [
      "artificial intelligence",
      "ai"
    ],

    "Deep Learning": [
      "deep learning",
      "dl"
    ],

    "TensorFlow": [
      "tensorflow"
    ],

    "PyTorch": [
      "pytorch"
    ],

    "Pandas": [
      "pandas"
    ],

    "NumPy": [
      "numpy",
      "num py"
    ],

    "Power BI": [
      "power bi",
      "powerbi"
    ],

    "Excel": [
      "excel",
      "microsoft excel"
    ],

    "Figma": [
      "figma"
    ],

    "Selenium": [
      "selenium"
    ],

    "Jira": [
      "jira"
    ],

    "Agile": [
      "agile"
    ],

    "Scrum": [
      "scrum"
    ]
  };

  const STOP_WORDS = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "your",
    "you",
    "our",
    "are",
    "will",
    "have",
    "has",
    "not",
    "but",
    "job",
    "role",
    "work",
    "team",
    "using",
    "used",
    "use",
    "into",
    "their",
    "they",
    "them",
    "who",
    "what",
    "when",
    "where",
    "which",
    "while",
    "about",
    "through",
    "such",
    "more",
    "than",
    "also",
    "must",
    "should",
    "would",
    "could",
    "can",
    "may",
    "able",
    "ability",
    "skills",
    "skill",
    "experience",
    "years",
    "year",
    "required",
    "preferred",
    "candidate",
    "candidates",
    "responsibilities",
    "responsibility",
    "requirements",
    "requirement",
    "description",
    "looking",
    "seeking",
    "strong",
    "good",
    "excellent",
    "knowledge",
    "including",
    "etc",
    "please",
    "apply",
    "company",
    "position",
    "opportunity"
  ]);

  const ACTION_VERBS = [
    "developed",
    "designed",
    "built",
    "created",
    "implemented",
    "improved",
    "optimized",
    "automated",
    "managed",
    "led",
    "delivered",
    "deployed",
    "integrated",
    "tested",
    "analyzed",
    "engineered",
    "maintained",
    "configured",
    "collaborated",
    "architected",
    "launched",
    "reduced",
    "increased",
    "streamlined"
  ];

  const SECTION_PATTERNS = {
    summary: /\b(summary|profile|objective|professional summary)\b/i,
    experience: /\b(experience|work experience|employment|professional experience)\b/i,
    education: /\b(education|academic|qualification|degree)\b/i,
    skills: /\b(skills|technical skills|core competencies|technologies)\b/i,
    projects: /\b(projects|personal projects|academic projects)\b/i,
    certifications: /\b(certifications|certificates)\b/i,
    achievements: /\b(achievements|awards|honors)\b/i
  };

  /* ===================================================
     NORMALIZATION
     =================================================== */

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\w+#.\- ]+/g, " ")
      .replace(/[_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function termExists(text, term) {
    const source = normalizeText(text);
    const needle = normalizeText(term);

    if (!source || !needle) {
      return false;
    }

    if (needle.includes(" ")) {
      return source.includes(needle);
    }

    const pattern = new RegExp(
      `(^|\\s)${escapeRegExp(needle)}(?=\\s|$)`,
      "i"
    );

    return pattern.test(source);
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /* ===================================================
     SKILL DETECTION
     =================================================== */

  function detectSkills(text) {
    const found = [];

    Object.entries(SKILL_ALIASES).forEach(([canonical, aliases]) => {
      const match = aliases.some((alias) => termExists(text, alias));

      if (match) {
        found.push(canonical);
      }
    });

    return found;
  }

  function getSelectedSkills() {
    return Array.from(
      document.querySelectorAll(
        'input[name="skills"]:checked'
      )
    ).map((input) => input.value);
  }

  /* ===================================================
     JD KEYWORD EXTRACTION
     =================================================== */

  function extractNGrams(text) {
    const normalized = normalizeText(text);

    const words = normalized
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(
        (word) =>
          word.length >= 3 &&
          !STOP_WORDS.has(word) &&
          !/^\d+$/.test(word)
      );

    const result = new Map();

    for (let i = 0; i < words.length; i++) {
      const one = words[i];

      result.set(one, (result.get(one) || 0) + 1);

      if (i < words.length - 1) {
        const two = `${words[i]} ${words[i + 1]}`;

        if (
          !STOP_WORDS.has(words[i]) &&
          !STOP_WORDS.has(words[i + 1])
        ) {
          result.set(two, (result.get(two) || 0) + 1);
        }
      }

      if (i < words.length - 2) {
        const three =
          `${words[i]} ${words[i + 1]} ${words[i + 2]}`;

        if (
          !STOP_WORDS.has(words[i]) &&
          !STOP_WORDS.has(words[i + 1]) &&
          !STOP_WORDS.has(words[i + 2])
        ) {
          result.set(
            three,
            (result.get(three) || 0) + 1
          );
        }
      }
    }

    return Array.from(result.entries())
      .filter(([, count]) => count >= 1)
      .sort((a, b) => {
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }

        return b[0].length - a[0].length;
      })
      .map(([term]) => term)
      .slice(0, 80);
  }

  function getHighSignalKeywords(jdText) {
    const skillTerms = detectSkills(jdText);

    const ngrams = extractNGrams(jdText);

    const useful = [];

    skillTerms.forEach((skill) => {
      useful.push(skill);
    });

    ngrams.forEach((term) => {
      if (
        term.length >= 4 &&
        !useful.some(
          (item) =>
            normalizeText(item) === normalizeText(term)
        )
      ) {
        useful.push(titleCase(term));
      }
    });

    return uniqueStrings(useful).slice(0, 45);
  }

  function uniqueStrings(items) {
    const map = new Map();

    items.forEach((item) => {
      const value = String(item || "").trim();

      if (!value) {
        return;
      }

      const key = normalizeText(value);

      if (!map.has(key)) {
        map.set(key, value);
      }
    });

    return Array.from(map.values());
  }

  /* ===================================================
     YEARS / EXPERIENCE
     =================================================== */

  function extractYears(text) {
    const matches = [];
    const regex =
      /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/gi;

    let match;

    while ((match = regex.exec(String(text || ""))) !== null) {
      const value = Number(match[1]);

      if (Number.isFinite(value)) {
        matches.push(value);
      }
    }

    return matches;
  }

  function getMaxYears(text) {
    const years = extractYears(text);

    if (!years.length) {
      return 0;
    }

    return Math.max(...years);
  }

  function getResumeExperienceYears(experienceLevel, resumeText) {
    const level = String(experienceLevel || "").toLowerCase();

    if (level.includes("fresher")) {
      return 0;
    }

    const selected = getRangeUpperBound(level);

    const extracted = getMaxYears(resumeText);

    if (extracted > 0) {
      return Math.max(extracted, selected);
    }

    return selected;
  }

  function getRangeUpperBound(value) {
    const text = String(value || "").toLowerCase();

    if (text.includes("10+")) {
      return 10;
    }

    const match = text.match(
      /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/ 
    );

    if (match) {
      return Number(match[2]);
    }

    const single = text.match(
      /(\d+(?:\.\d+)?)/
    );

    return single ? Number(single[1]) : 0;
  }

  /* ===================================================
     ROLE SIGNALS
     =================================================== */

  function inferJobTitle(jdText) {
    const lines = String(jdText || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const rolePatterns = [
      /(?:job title|position|role|designation)\s*[:\-]\s*(.+)/i,
      /(?:hiring|looking for|seeking)\s+(?:a|an)?\s*([a-z0-9 .&/-]{3,60})/i
    ];

    for (const line of lines.slice(0, 20)) {
      for (const pattern of rolePatterns) {
        const match = line.match(pattern);

        if (match && match[1]) {
          return titleCase(
            match[1]
              .replace(
                /\b(?:developer|engineer|analyst|designer|manager|intern)\b.*$/i,
                (value) => value
              )
              .trim()
          );
        }
      }
    }

    const commonRoles = [
      "Frontend Developer",
      "React Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Software Engineer",
      "Python Developer",
      "Java Developer",
      "Data Analyst",
      "ML Engineer",
      "DevOps Engineer",
      "Product Manager",
      "UI UX Designer",
      "QA Engineer"
    ];

    const found = commonRoles.find((role) =>
      termExists(jdText, role)
    );

    return found || "Target Role";
  }

  function getRoleSignals(jdText) {
    const normalized = normalizeText(jdText);

    const roles = [
      "frontend developer",
      "react developer",
      "backend developer",
      "full stack developer",
      "software engineer",
      "python developer",
      "java developer",
      "data analyst",
      "ml engineer",
      "devops engineer",
      "qa engineer",
      "ui ux designer",
      "product manager"
    ];

    return roles.filter((role) =>
      normalized.includes(role)
    );
  }

  /* ===================================================
     REQUIRED / PREFERRED JD PARSING
     =================================================== */

  const REQUIRED_MARKERS = [
    "required",
    "requirements",
    "must have",
    "must-have",
    "must",
    "mandatory",
    "essential",
    "minimum",
    "need to",
    "should have",
    "you have",
    "you should",
    "strong experience"
  ];

  const PREFERRED_MARKERS = [
    "preferred",
    "nice to have",
    "nice-to-have",
    "good to have",
    "plus",
    "bonus",
    "desired",
    "optional",
    "advantage",
    "preferred qualifications"
  ];

  function containsAny(text, markers) {
    const normalized = normalizeText(text);

    return markers.some((marker) =>
      normalized.includes(normalizeText(marker))
    );
  }

  function splitJdSentences(jdText) {
    return String(jdText || "")
      .split(/\n+|(?<=[.!?])\s+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function parseRequirementSections(jdText) {
    const lines = splitJdSentences(jdText);

    const requiredText = [];
    const preferredText = [];
    const neutralText = [];

    lines.forEach((line) => {
      const isPreferred = containsAny(
        line,
        PREFERRED_MARKERS
      );

      const isRequired = containsAny(
        line,
        REQUIRED_MARKERS
      );

      if (isPreferred) {
        preferredText.push(line);
      } else if (isRequired) {
        requiredText.push(line);
      } else {
        neutralText.push(line);
      }
    });

    return {
      requiredText: requiredText.join("\n"),
      preferredText: preferredText.join("\n"),
      neutralText: neutralText.join("\n")
    };
  }

  function extractRequirementTerms(jdText, type) {
    const sections = parseRequirementSections(jdText);

    let source = "";

    if (type === "required") {
      source = sections.requiredText;
    } else if (type === "preferred") {
      source = sections.preferredText;
    } else {
      source = sections.neutralText;
    }

    const skills = detectSkills(source);

    const highSignal = getHighSignalKeywords(source);

    return uniqueStrings([
      ...skills,
      ...highSignal
    ]).slice(0, 30);
  }

  /* ===================================================
     REQUIREMENT CLASSIFICATION
     =================================================== */

  function classifyKeywords(jdText, resumeText) {
    const required = extractRequirementTerms(
      jdText,
      "required"
    );

    const preferred = extractRequirementTerms(
      jdText,
      "preferred"
    );

    const allSkills = detectSkills(jdText);

    const requiredSet = new Set(
      required.map(normalizeText)
    );

    const preferredSet = new Set(
      preferred.map(normalizeText)
    );

    const neutralSkills = allSkills.filter((skill) => {
      const key = normalizeText(skill);

      return (
        !requiredSet.has(key) &&
        !preferredSet.has(key)
      );
    });

    const inferredRequired = [
      ...required,
      ...neutralSkills
    ];

    const finalRequired = uniqueStrings(
      inferredRequired
    ).slice(0, 30);

    const finalPreferred = uniqueStrings(
      preferred
    )
      .filter(
        (item) =>
          !finalRequired.some(
            (req) =>
              normalizeText(req) === normalizeText(item)
          )
      )
      .slice(0, 25);

    const matchedRequired = finalRequired.filter(
      (term) => termExists(resumeText, term)
    );

    const missingRequired = finalRequired.filter(
      (term) => !termExists(resumeText, term)
    );

    const matchedPreferred = finalPreferred.filter(
      (term) => termExists(resumeText, term)
    );

    const missingPreferred = finalPreferred.filter(
      (term) => !termExists(resumeText, term)
    );

    return {
      required: finalRequired,
      preferred: finalPreferred,
      matchedRequired,
      missingRequired,
      matchedPreferred,
      missingPreferred
    };
  }

  /* ===================================================
     KEYWORD MATCH SCORE
     =================================================== */

  function calculateKeywordMatch(jdText, resumeText) {
    const jdKeywords = getHighSignalKeywords(jdText);

    const matched = jdKeywords.filter((term) =>
      termExists(resumeText, term)
    );

    const missing = jdKeywords.filter(
      (term) => !termExists(resumeText, term)
    );

    const scoreValue = jdKeywords.length
      ? Math.round(
          (matched.length / jdKeywords.length) * 100
        )
      : 0;

    return {
      score: scoreValue,
      matched,
      missing,
      jdKeywords,
      resumeSkills: detectSkills(resumeText),
      jdSkills: detectSkills(jdText)
    };
  }

  /* ===================================================
     SKILLS SCORE
     =================================================== */

  function calculateSkillsScore(
    jdText,
    resumeText,
    selectedSkills
  ) {
    const jdSkills = detectSkills(jdText);
    const resumeSkills = detectSkills(resumeText);

    const selected = uniqueStrings([
      ...selectedSkills
    ]);

    const effectiveResumeSkills = uniqueStrings([
      ...resumeSkills,
      ...selected
    ]);

    if (!jdSkills.length) {
      return {
        score: 60,
        matched: [],
        missing: [],
        jdSkills,
        resumeSkills: effectiveResumeSkills
      };
    }

    const matched = jdSkills.filter((skill) =>
      effectiveResumeSkills.some(
        (resumeSkill) =>
          normalizeText(resumeSkill) ===
          normalizeText(skill)
      )
    );

    const missing = jdSkills.filter(
      (skill) =>
        !matched.some(
          (match) =>
            normalizeText(match) === normalizeText(skill)
        )
    );

    const scoreValue = Math.round(
      (matched.length / jdSkills.length) * 100
    );

    return {
      score: scoreValue,
      matched,
      missing,
      jdSkills,
      resumeSkills: effectiveResumeSkills
    };
  }

  /* ===================================================
     EXPERIENCE SCORE
     =================================================== */

  function calculateExperience(
    jdText,
    experienceLevel,
    resumeText
  ) {
    const requiredYears = getMaxYears(jdText);

    const resumeYears = getResumeExperienceYears(
      experienceLevel,
      resumeText
    );

    if (requiredYears <= 0) {
      return {
        score: 75,
        requiredYears: 0,
        resumeYears,
        gap: 0,
        status: "No explicit minimum found"
      };
    }

    const gap = Math.max(
      requiredYears - resumeYears,
      0
    );

    let scoreValue = 100;

    if (resumeYears < requiredYears) {
      scoreValue = Math.max(
        30,
        Math.round(
          (resumeYears / requiredYears) * 100
        )
      );
    }

    return {
      score: scoreValue,
      requiredYears,
      resumeYears,
      gap,
      status:
        gap === 0
          ? "Meets stated experience"
          : "Experience gap detected"
    };
  }

  /* ===================================================
     ATS COMPATIBILITY
     =================================================== */

  function calculateATSCompatibility(resumeText) {
    const text = String(resumeText || "");

    let scoreValue = 45;

    const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const phone =
      /(?:\+?\d[\d\s().-]{8,}\d)/;

    if (email.test(text)) {
      scoreValue += 8;
    }

    if (phone.test(text)) {
      scoreValue += 7;
    }

    if (SECTION_PATTERNS.experience.test(text)) {
      scoreValue += 8;
    }

    if (SECTION_PATTERNS.education.test(text)) {
      scoreValue += 7;
    }

    if (SECTION_PATTERNS.skills.test(text)) {
      scoreValue += 8;
    }

    if (SECTION_PATTERNS.projects.test(text)) {
      scoreValue += 5;
    }

    return Math.min(scoreValue, 100);
  }

  /* ===================================================
     RESUME QUALITY
     =================================================== */

  function calculateResumeQuality(resumeText) {
    const text = String(resumeText || "");

    const words = text
      .split(/\s+/)
      .filter(Boolean);

    let scoreValue = 45;

    if (words.length >= 150) {
      scoreValue += 15;
    }

    if (words.length >= 300) {
      scoreValue += 10;
    }

    if (words.length >= 500) {
      scoreValue += 5;
    }

    const actionVerbCount =
      ACTION_VERBS.filter((verb) =>
        termExists(text, verb)
      ).length;

    scoreValue += Math.min(
      actionVerbCount * 2,
      15
    );

    const bulletLikeLines = text
      .split("\n")
      .filter((line) =>
        /^[•\-*▪]/.test(line.trim())
      ).length;

    scoreValue += Math.min(
      bulletLikeLines,
      10
    );

    return Math.min(scoreValue, 100);
  }

  /* ===================================================
     EDUCATION
     =================================================== */

  function calculateEducationScore(resumeText) {
    if (SECTION_PATTERNS.education.test(resumeText)) {
      return 100;
    }

    if (
      /\b(bachelor|master|b\.?tech|m\.?tech|bca|mca|bsc|msc|degree|diploma)\b/i.test(
        resumeText
      )
    ) {
      return 85;
    }

    return 55;
  }

  /* ===================================================
     JOB MATCH
     =================================================== */

  function calculateJobMatch(
    keywordScore,
    experienceScore,
    requiredMissing,
    requiredTotal
  ) {
    const requiredRatio = requiredTotal
      ? Math.max(
          0,
          (requiredTotal - requiredMissing) /
            requiredTotal
        )
      : keywordScore / 100;

    const requiredScore =
      requiredRatio * 100;

    return Math.round(
      requiredScore * 0.65 +
      keywordScore * 0.20 +
      experienceScore * 0.15
    );
  }

  /* ===================================================
     EXPERIENCE GAP DETAILS
     =================================================== */

  function buildExperienceGap(experience) {
    if (experience.requiredYears <= 0) {
      return {
        ...experience,
        message:
          "The JD does not state a clear minimum experience requirement."
      };
    }

    if (experience.gap <= 0) {
      return {
        ...experience,
        message:
          `Your estimated experience meets the stated ${experience.requiredYears}+ year requirement.`
      };
    }

    return {
      ...experience,
      message:
        `The JD asks for ${formatYears(experience.requiredYears)} while your analysis indicates about ${formatYears(experience.resumeYears)}.`
    };
  }

  function formatYears(value) {
    if (Number.isInteger(value)) {
      return `${value} year${value === 1 ? "" : "s"}`;
    }

    return `${value.toFixed(1)} years`;
  }

  /* ===================================================
     IMPROVEMENT POTENTIAL
     =================================================== */

  function calculateImprovementPotential(
    report
  ) {
    const missingRequiredCount =
      report.requirements.missingRequired.length;

    const requiredTotal =
      report.requirements.required.length;

    const missingRatio =
      requiredTotal > 0
        ? missingRequiredCount / requiredTotal
        : 0;

    let potential = 0;

    potential += Math.round(
      Math.min(missingRatio * 20, 20)
    );

    if (report.ats < 75) {
      potential += 4;
    }

    if (report.quality < 75) {
      potential += 3;
    }

    if (report.experience.gap > 0) {
      potential += 2;
    }

    potential = Math.min(
      Math.max(potential, 0),
      25
    );

    let note =
      "Your current report is already relatively aligned.";

    if (potential >= 15) {
      note =
        "There is meaningful optimization potential, mainly from high-priority JD terms and ATS structure.";
    } else if (potential >= 8) {
      note =
        "Several targeted changes could improve alignment with this JD.";
    }

    return {
      points: potential,
      note
    };
  }

  /* ===================================================
     SKILL PRIORITY
     =================================================== */

  function calculateSkillPriority(
    requirements,
    jdText,
    resumeText
  ) {
    const required = requirements.required.map(
      (term) => ({
        term,
        type: "Required",
        weight: 3
      })
    );

    const preferred = requirements.preferred.map(
      (term) => ({
        term,
        type: "Preferred",
        weight: 2
      })
    );

    const all = [...required, ...preferred];

    const frequencyText = normalizeText(jdText);

    all.forEach((item) => {
      const normalizedTerm =
        normalizeText(item.term);

      let frequency = 0;
      let index = frequencyText.indexOf(
        normalizedTerm
      );

      while (index !== -1) {
        frequency++;
        index = frequencyText.indexOf(
          normalizedTerm,
          index + normalizedTerm.length
        );
      }

      item.score =
        item.weight * 10 +
        Math.min(frequency * 4, 20);

      if (termExists(resumeText, item.term)) {
        item.score += 8;
      }
    });

    return all
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }

  /* ===================================================
     RECOMMENDATIONS
     =================================================== */

  function generateSuggestions(report) {
    const suggestions = [];

    const critical =
      report.criticalMissingSkills;

    if (critical.length) {
      suggestions.push(
        `Prioritize the critical required skills: ${critical.slice(0, 5).join(", ")}. Only add a skill if you genuinely have that experience.`
      );
    }

    if (report.requirements.missingRequired.length) {
      suggestions.push(
        "Review the required JD terms and naturally incorporate supported keywords into your Skills, Experience or Projects sections."
      );
    }

    if (
      report.requirements.matchedRequired.length &&
      report.keyword.score < 70
    ) {
      suggestions.push(
        "Your resume has some required skills, but the overall JD wording is not aligned strongly enough. Mirror relevant terminology from the JD where it truthfully describes your work."
      );
    }

    if (
      report.experience.requiredYears > 0 &&
      report.experience.gap > 0
    ) {
      suggestions.push(
        `The JD states ${formatYears(report.experience.requiredYears)} of experience. Emphasize relevant projects, internships or professional work that demonstrate comparable responsibilities without overstating your years.`
      );
    }

    if (report.ats < 75) {
      suggestions.push(
        "Improve ATS readability by keeping clear section headings such as Summary, Skills, Experience, Education and Projects, and avoid putting important information only inside graphics."
      );
    }

    if (report.quality < 75) {
      suggestions.push(
        "Strengthen experience bullets with action verbs and measurable outcomes where available, such as performance improvements, scale, users, revenue, time saved or defect reduction."
      );
    }

    if (
      report.targetTitle &&
      report.targetTitle !== "Target Role"
    ) {
      suggestions.push(
        `Tailor the resume headline or summary toward the target role: ${report.targetTitle}.`
      );
    }

    if (
      report.targetCompany &&
      report.targetCompany.trim()
    ) {
      suggestions.push(
        `Before applying to ${report.targetCompany}, verify that the resume uses the same relevant terminology as the exact job posting.`
      );
    }

    if (!suggestions.length) {
      suggestions.push(
        "Your resume is reasonably aligned with the supplied JD. Focus on concise achievements, truthful keyword usage and role-specific evidence."
      );
    }

    return uniqueStrings(suggestions).slice(0, 8);
  }

  /* ===================================================
     FINAL REPORT
     =================================================== */

  function calculateReport({
    resumeText,
    jdText,
    experienceLevel,
    selectedSkills,
    targetTitle,
    targetCompany
  }) {
    const keyword = calculateKeywordMatch(
      jdText,
      resumeText
    );

    const skills = calculateSkillsScore(
      jdText,
      resumeText,
      selectedSkills
    );

    const experience = calculateExperience(
      jdText,
      experienceLevel,
      resumeText
    );

    const ats = calculateATSCompatibility(
      resumeText
    );

    const quality = calculateResumeQuality(
      resumeText
    );

    const education =
      calculateEducationScore(resumeText);

    const requirements = classifyKeywords(
      jdText,
      resumeText
    );

    const criticalMissing = requirements.missingRequired
      .filter((term) =>
        detectSkills(term).length > 0 ||
        term.length >= 4
      )
      .slice(0, 10);

    const jobMatch = calculateJobMatch(
      keyword.score,
      experience.score,
      requirements.missingRequired.length,
      requirements.required.length
    );

    const inferredTitle =
      targetTitle.trim() ||
      inferJobTitle(jdText);

    const experienceGapData =
      buildExperienceGap(experience);

    const report = {
      final: 0,
      keyword,
      skills,
      experience,
      ats,
      quality,
      education,
      jobMatch,
      requirements,
      criticalMissingSkills: uniqueStrings(
        criticalMissing
      ),
      targetTitle: inferredTitle,
      targetCompany: targetCompany.trim(),
      experienceGap: experienceGapData,
      improvementPotential: null,
      skillPriority: [],
      recommendations: []
    };

    /*
      Main ATS score:
      Keyword 35%
      Skills 20%
      Experience 15%
      ATS 15%
      Quality 5%
      Education 10%
    */

    report.final = Math.round(
      keyword.score * 0.35 +
      skills.score * 0.20 +
      experience.score * 0.15 +
      ats * 0.15 +
      quality * 0.05 +
      education * 0.10
    );

    report.improvementPotential =
      calculateImprovementPotential(report);

    report.skillPriority =
      calculateSkillPriority(
        requirements,
        jdText,
        resumeText
      );

    report.recommendations =
      generateSuggestions(report);

    return report;
  }

  /* ===================================================
     STRENGTH LABEL
     =================================================== */

  function getStrength(scoreValue) {
    if (scoreValue >= 85) {
      return {
        label: "Excellent",
        color: "#2e9b50"
      };
    }

    if (scoreValue >= 75) {
      return {
        label: "Strong",
        color: "#42a85f"
      };
    }

    if (scoreValue >= 60) {
      return {
        label: "Needs Improvement",
        color: "#c88a27"
      };
    }

    return {
      label: "Needs Major Improvement",
      color: "#c44459"
    };
  }

  /* ===================================================
     HTML ESCAPE
     =================================================== */

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ===================================================
     CHIP RENDERER
     =================================================== */

  function renderChips(
    container,
    items,
    type = ""
  ) {
    if (!container) {
      return;
    }

    container.innerHTML = "";

    if (!items || !items.length) {
      container.innerHTML =
        `<span class="muted">No strong signals detected.</span>`;
      return;
    }

    items.forEach((item) => {
      const chip = document.createElement("span");

      chip.className =
        `keyword-chip ${type}`.trim();

      chip.textContent = item;

      container.appendChild(chip);
    });
  }

  /* ===================================================
     BREAKDOWN RENDER
     =================================================== */

  function renderBreakdown(report) {
    const items = [
      ["Keywords", report.keyword.score],
      ["Skills", report.skills.score],
      ["Experience", report.experience.score],
      ["ATS Format", report.ats],
      ["Quality", report.quality]
    ];

    scoreBreakdown.innerHTML = items
      .map(
        ([label, value]) => `
          <div class="score-item">
            <strong>${Math.round(value)}%</strong>
            <span>${escapeHtml(label)}</span>
          </div>
        `
      )
      .join("");
  }

  /* ===================================================
     JOB TARGET RENDER
     =================================================== */

  function renderJobTarget(report) {
    const title =
      report.targetTitle || "Target Role";

    const company =
      report.targetCompany || "Company not specified";

    jobTargetInfo.innerHTML = `
      <span class="target-pill">🎯 ${escapeHtml(title)}</span>
      <span class="target-pill">🏢 ${escapeHtml(company)}</span>
    `;

    reportTargetTitle.textContent = title;
    reportTargetCompany.textContent =
      report.targetCompany || "Not specified";
  }

  /* ===================================================
     JOB MATCH RENDER
     =================================================== */

  function renderJobMatch(report) {
    const value = Math.round(
      report.jobMatch
    );

    jobMatchScore.textContent =
      `${value}%`;

    reportExperienceFit.textContent =
      report.experience.gap <= 0
        ? "Good fit"
        : `${formatYears(report.experience.gap)} gap`;

    requestAnimationFrame(() => {
      jobMatchFill.style.width =
        `${value}%`;
    });
  }

  /* ===================================================
     REQUIREMENTS RENDER
     =================================================== */

  function renderRequirements(report) {
    renderChips(
      requiredKeywords,
      report.requirements.required,
      "required"
    );

    renderChips(
      preferredKeywords,
      report.requirements.preferred,
      "preferred"
    );

    requiredCount.textContent =
      report.requirements.required.length;

    preferredCount.textContent =
      report.requirements.preferred.length;
  }

  /* ===================================================
     CRITICAL SKILLS RENDER
     =================================================== */

  function renderCriticalSkills(report) {
    if (!criticalMissingSkills) {
      return;
    }

    const items =
      report.criticalMissingSkills;

    if (!items.length) {
      criticalMissingSkills.innerHTML =
        `<span class="muted">🎉 No major critical missing terms detected.</span>`;

      return;
    }

    criticalMissingSkills.innerHTML =
      items
        .map(
          (skill) => `
            <span class="critical-skill">
              🔥 ${escapeHtml(skill)}
            </span>
          `
        )
        .join("");
  }

  /* ===================================================
     EXPERIENCE RENDER
     =================================================== */

  function renderExperienceGap(report) {
    const data = report.experienceGap;

    let className = "gap-good";

    if (data.gap > 0) {
      className =
        data.gap >= 2
          ? "gap-danger"
          : "gap-warning";
    }

    experienceGap.innerHTML = `
      <p>
        <strong>JD requirement:</strong>
        ${data.requiredYears > 0
          ? escapeHtml(formatYears(data.requiredYears))
          : "Not explicitly stated"}
      </p>

      <p>
        <strong>Resume estimate:</strong>
        ${escapeHtml(formatYears(data.resumeYears))}
      </p>

      <p class="${className}">
        ${escapeHtml(data.message)}
      </p>
    `;
  }

  /* ===================================================
     IMPROVEMENT RENDER
     =================================================== */

  function renderImprovementPotential(report) {
    const potential =
      report.improvementPotential;

    improvementPotential.innerHTML = `
      <div class="potential-number">
        +${potential.points} pts
      </div>

      <div class="potential-note">
        ${escapeHtml(potential.note)}
      </div>

      <div class="potential-note">
        This is an estimated optimization opportunity,
        not a guaranteed future score.
      </div>
    `;
  }

  /* ===================================================
     SKILL PRIORITY RENDER
     =================================================== */

  function renderSkillPriority(report) {
    const list =
      report.skillPriority;

    if (!list.length) {
      skillPriority.innerHTML =
        `<span class="muted">No clear skill priority could be extracted from this JD.</span>`;

      return;
    }

    skillPriority.innerHTML =
      list
        .map(
          (item, index) => `
            <div class="priority-row">

              <span class="priority-rank">
                ${index + 1}
              </span>

              <span class="priority-skill">
                ${escapeHtml(item.term)}
              </span>

              <span class="priority-type ${item.type.toLowerCase()}">
                ${escapeHtml(item.type)}
              </span>

            </div>
          `
        )
        .join("");
  }

  /* ===================================================
     SUGGESTIONS RENDER
     =================================================== */

  function renderSuggestions(report) {
    suggestionList.innerHTML =
      report.recommendations
        .map(
          (item) =>
            `<li>${escapeHtml(item)}</li>`
        )
        .join("");
  }

  /* ===================================================
     RESULT TEXT
     =================================================== */

  function buildResultText(report) {
    const job = report.targetTitle;

    if (report.final >= 85) {
      return `Your resume is strongly aligned with ${job}. Focus on preserving truthful job-specific keywords and measurable achievements.`;
    }

    if (report.final >= 75) {
      return `Your resume has a good foundation for ${job}, but targeted JD alignment can make the application stronger.`;
    }

    if (report.final >= 60) {
      return `Your resume shows some alignment with ${job}, but several job-specific terms or ATS signals need attention.`;
    }

    return `Your resume needs significant tailoring for ${job}. Start with the critical missing skills, required keywords and ATS structure.`;
  }

  /* ===================================================
     SCORE ANIMATION
     =================================================== */

  function animateScore(targetScore) {
    const duration = 1300;
    const start = performance.now();

    circle.style.strokeDashoffset = "440";

    function frame(now) {
      const elapsed =
        now - start;

      const progress =
        Math.min(elapsed / duration, 1);

      const eased =
        1 - Math.pow(1 - progress, 3);

      const current =
        Math.round(targetScore * eased);

      score.textContent =
        `${current}%`;

      progressBar.style.width =
        `${current}%`;

      const circumference = 440;

      const offset =
        circumference -
        (circumference * current) / 100;

      circle.style.strokeDashoffset =
        offset;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  /* ===================================================
     SCORE COLOR
     =================================================== */

  function applyScoreColor(value) {
    let color = "#c44459";

    if (value >= 85) {
      color = "#2e9b50";
    } else if (value >= 75) {
      color = "#42a85f";
    } else if (value >= 60) {
      color = "#c88a27";
    }

    circle.style.stroke = color;
    score.style.color = color;
  }

  /* ===================================================
     COMPLETE REPORT RENDER
     =================================================== */

  function renderReport(report) {
    resultCard.style.display = "block";

    renderJobTarget(report);
    renderJobMatch(report);
    renderBreakdown(report);
    renderRequirements(report);

    renderChips(
      matchedKeywords,
      report.keyword.matched,
      "matched"
    );

    renderChips(
      missingKeywords,
      report.keyword.missing,
      "missing"
    );

    renderCriticalSkills(report);
    renderExperienceGap(report);
    renderImprovementPotential(report);
    renderSkillPriority(report);
    renderSuggestions(report);

    const strength =
      getStrength(report.final);

    resumeStrength.textContent =
      strength.label;

    resumeStrength.style.color =
      strength.color;

    resultText.textContent =
      buildResultText(report);

    applyScoreColor(report.final);
    animateScore(report.final);

    resultCard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  /* ===================================================
     FORM SUBMIT
     =================================================== */

  if (resumeForm) {
    resumeForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const file =
        resumeInput.files &&
        resumeInput.files[0];

      const jdText =
        jobDescription.value.trim();

      if (!file) {
        showToast(
          "Please upload your resume first."
        );
        return;
      }

      if (jdText.length < 30) {
        showToast(
          "Please paste a complete job description."
        );
        jobDescription.focus();
        return;
      }

      const submitButton =
        resumeForm.querySelector(
          'button[type="submit"]'
        );

      const originalText =
        submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent =
        "Analyzing...";

      resultCard.style.display = "none";

      try {
        await loadLibraries();

        pdfMessage.textContent =
          "Extracting resume text...";

        const resumeText =
          await extractResumeText(file);

        if (!isUsefulResumeText(resumeText)) {
          throw new Error(
            "Not enough readable resume text was found."
          );
        }

        const selectedSkills =
          getSelectedSkills();

        const experienceLevel =
          $("experience").value;

        const title =
          targetJobTitle.value.trim();

        const company =
          targetCompany.value.trim();

        const report =
          calculateReport({
            resumeText,
            jdText,
            experienceLevel,
            selectedSkills,
            targetTitle: title,
            targetCompany: company
          });

        renderReport(report);

        showToast(
          "Job-specific ATS analysis completed."
        );

      } catch (error) {
        console.error(error);

        showToast(
          error.message ||
          "Analysis failed. Please try again."
        );

      } finally {
        submitButton.disabled = false;
        submitButton.textContent =
          originalText;
      }
    });
  }

  /* ===================================================
     RESET
     =================================================== */

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resumeForm.reset();

      fileName.textContent =
        "No file selected";

      previewContainer.style.display =
        "none";

      resultCard.style.display =
        "none";

      pdfDoc = null;
      currentPdfBytes = null;
      pdfScale = 1;

      if (pdfCanvas) {
        const context =
          pdfCanvas.getContext("2d");

        context.clearRect(
          0,
          0,
          pdfCanvas.width,
          pdfCanvas.height
        );

        pdfCanvas.width = 0;
        pdfCanvas.height = 0;
      }

      progressBar.style.width = "0%";
      score.textContent = "0%";
      circle.style.strokeDashoffset =
        "440";

      showToast(
        "Analyzer has been reset."
      );
    });
  }

  /* ===================================================
     JOB FILTERING
     =================================================== */

  function filterJobs() {
    if (!jobsTable) {
      return;
    }

    const search =
      jobSearch.value
        .trim()
        .toLowerCase();

    const location =
      jobLocation.value
        .trim()
        .toLowerCase();

    const rows =
      Array.from(
        jobsTable.querySelectorAll(
          "tbody tr"
        )
      );

    let visible = 0;

    rows.forEach((row) => {
      const text =
        row.textContent.toLowerCase();

      const rowLocation =
        row.cells[2]
          ? row.cells[2].textContent
              .trim()
              .toLowerCase()
          : "";

      const searchMatch =
        !search ||
        text.includes(search);

      const locationMatch =
        !location ||
        rowLocation === location;

      const show =
        searchMatch &&
        locationMatch;

      row.style.display =
        show ? "" : "none";

      if (show) {
        visible++;
      }
    });

    noJobs.style.display =
      visible === 0
        ? "block"
        : "none";
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

  /* ===================================================
     SAMPLE JOB BUTTONS
     =================================================== */

  if (jobsTable) {
    jobsTable.addEventListener(
      "click",
      (event) => {
        const button =
          event.target.closest(".job-btn");

        if (!button) {
          return;
        }

        const row =
          button.closest("tr");

        if (!row) {
          return;
        }

        const role =
          row.cells[0].textContent.trim();

        const company =
          row.cells[1].textContent.trim();

        const location =
          row.cells[2].textContent.trim();

        targetJobTitle.value =
          role;

        targetCompany.value =
          company;

        showToast(
          `${role} at ${company} selected. Paste its full JD to analyze it.`
        );

        resumeSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        setTimeout(() => {
          jobDescription.focus();
        }, 600);

        console.info(
          "Sample job selected:",
          {
            role,
            company,
            location
          }
        );
      }
    );
  }

  /* ===================================================
     FEEDBACK
     =================================================== */

  if (feedbackBtn) {
    feedbackBtn.addEventListener("click", () => {
      const message =
        prompt(
          "What would you like to improve in CareerPilot AI?"
        );

      if (message && message.trim()) {
        showToast(
          "Thanks for your feedback!"
        );

        console.log(
          "CareerPilot feedback:",
          message.trim()
        );
      }
    });
  }

  /* ===================================================
     INITIAL SCORE STATE
     =================================================== */

  if (circle) {
    circle.style.strokeDashoffset =
      "440";
  }

  if (progressBar) {
    progressBar.style.width =
      "0%";
  }

});