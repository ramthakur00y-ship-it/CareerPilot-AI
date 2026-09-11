/* =====================================================
   CAREERPILOT AI - COMPLETE FRONTEND JAVASCRIPT (STEPS 1-3)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // Navigation & UI Elements
  const startBtn = $("startBtn");
  const resumeSection = $("resume-section");
  const mobileMenuBtn = $("mobileMenuBtn");
  const navLinks = $("navLinks");
  const themeToggle = $("themeToggle");

  // Step 2 Form Controls
  const resumeForm = $("resumeForm");
  const resumeInput = $("resume");
  const fileName = $("fileName");
  const resetBtn = $("resetBtn");
  const jobDescriptionInput = $("jobDescription");
  const targetJobTitleInput = $("targetJobTitle");
  const targetCompanyInput = $("targetCompany");
  const experienceSelect = $("experience");

  // Preview Card Controls
  const previewContainer = $("previewContainer");
  const closePreview = $("closePreview");
  const zoomIn = $("zoomIn");
  const zoomOut = $("zoomOut");
  const pdfCanvas = $("pdfCanvas");
  const pdfMessage = $("pdfMessage");

  // Report & Output UI
  const resultCard = $("resultCard");
  const scoreElement = $("score");
  const circleElement = $("circle");
  const resumeStrength = $("resumeStrength");
  const resultText = $("resultText");
  const progressBar = $("progressBar");

  const jobMatchScore = $("jobMatchScore");
  const jobMatchFill = $("jobMatchFill");
  const reportTargetTitle = $("reportTargetTitle");
  const reportTargetCompany = $("reportTargetCompany");
  const reportExperienceFit = $("reportExperienceFit");

  const scoreBreakdown = $("scoreBreakdown");
  const requiredKeywords = $("requiredKeywords");
  const preferredKeywords = $("preferredKeywords");
  const requiredCount = $("requiredCount");
  const preferredCount = $("preferredCount");
  const matchedKeywords = $("matchedKeywords");
  const missingKeywords = $("missingKeywords");
  const criticalMissingSkills = $("criticalMissingSkills");
  const experienceGap = $("experienceGap");
  const improvementPotential = $("improvementPotential");
  const skillPriority = $("skillPriority");
  const suggestionList = $("suggestionList");

  // Job Search Section
  const jobSearch = $("jobSearch");
  const jobLocation = $("jobLocation");
  const jobsTable = $("jobsTable");
  const noJobs = $("noJobs");

  // Feedback & Toast
  const feedbackBtn = $("feedbackBtn");
  const toast = $("toast");

  let zoomLevel = 1.0;

  /* ===================================================
     NAVIGATION & THEME TOGGLE
     =================================================== */
  if (startBtn && resumeSection) {
    startBtn.addEventListener("click", () => {
      resumeSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      showToast(isDark ? "Dark mode enabled" : "Light mode enabled");
    });
  }

  /* ===================================================
     STEP 3: RESUME BUILDER LIVE SYNC & DYNAMIC ENGINE
     =================================================== */
  const resumeBuilderForm = $("resumeBuilderForm");
  const printResumeBtn = $("printResumeBtn");
  
  // Dynamic Experience & Education Containers
  const experienceFields = $("experienceFields");
  const educationFields = $("educationFields");
  const addExpBtn = $("addExpBtn");
  const addEduBtn = $("addEduBtn");

  // State
  let expCount = 0;
  let eduCount = 0;

  function addExperienceRow(title = "", company = "", desc = "") {
    expCount++;
    const div = document.createElement("div");
    div.className = "dynamic-item-row";
    div.innerHTML = `
      <div class="form-group" style="margin-bottom:10px;">
        <label>Job Title</label>
        <input type="text" class="exp-title" value="${title}" placeholder="e.g. Software Engineer">
      </div>
      <div class="form-group" style="margin-bottom:10px;">
        <label>Company</label>
        <input type="text" class="exp-company" value="${company}" placeholder="e.g. Tech Inc">
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label>Highlights / Description</label>
        <textarea class="exp-desc" placeholder="Led development of...">${desc}</textarea>
      </div>
      <button type="button" class="reset-btn" style="margin-top:10px; padding:6px 12px; font-size:12px;" onclick="this.parentElement.remove(); updateLiveResumePreview();">Remove</button>
    `;
    experienceFields.appendChild(div);
    
    // Attach listeners for live update
    div.querySelectorAll("input, textarea").forEach(el => {
      el.addEventListener("input", updateLiveResumePreview);
    });
  }

  function addEducationRow(degree = "", school = "") {
    eduCount++;
    const div = document.createElement("div");
    div.className = "dynamic-item-row";
    div.innerHTML = `
      <div class="form-group" style="margin-bottom:10px;">
        <label>Degree / Field</label>
        <input type="text" class="edu-degree" value="${degree}" placeholder="e.g. B.Tech in Computer Science">
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label>Institution / University</label>
        <input type="text" class="edu-school" value="${school}" placeholder="e.g. State University">
      </div>
      <button type="button" class="reset-btn" style="margin-top:10px; padding:6px 12px; font-size:12px;" onclick="this.parentElement.remove(); updateLiveResumePreview();">Remove</button>
    `;
    educationFields.appendChild(div);

    div.querySelectorAll("input").forEach(el => {
      el.addEventListener("input", updateLiveResumePreview);
    });
  }

  if (addExpBtn) addExpBtn.addEventListener("click", () => addExperienceRow());
  if (addEduBtn) addEduBtn.addEventListener("click", () => addEducationRow());

  // Initialize with one default row if empty
  if (experienceFields && experienceFields.children.length === 0) {
    addExperienceRow("Frontend Developer", "Acme Corp", "Built responsive web applications using JavaScript and React.");
  }
  if (educationFields && educationFields.children.length === 0) {
    addEducationRow("B.S. in Computer Science", "University of Technology");
  }

  function updateLiveResumePreview() {
    const nameInput = resumeBuilderForm.querySelector('input[name="fullName"]');
    const emailInput = resumeBuilderForm.querySelector('input[name="email"]');
    const phoneInput = resumeBuilderForm.querySelector('input[name="phone"]');
    const locInput = resumeBuilderForm.querySelector('input[name="location"]');
    const summaryInput = resumeBuilderForm.querySelector('textarea[name="summary"]');
    const skillsInput = resumeBuilderForm.querySelector('input[name="skillsList"]');

    // Update Header
    $("previewName").textContent = nameInput && nameInput.value ? nameInput.value : "Your Name";
    const contactParts = [
      emailInput ? emailInput.value : "",
      phoneInput ? phoneInput.value : "",
      locInput ? locInput.value : ""
    ].filter(Boolean);
    $("previewContact").textContent = contactParts.length > 0 ? contactParts.join(" | ") : "email@example.com | Phone | Location";

    // Update Summary
    $("previewSummary").textContent = summaryInput && summaryInput.value ? summaryInput.value : "Your professional summary will appear here...";

    // Update Experience List
    const expListContainer = $("previewExperienceList");
    expListContainer.innerHTML = "";
    document.querySelectorAll(".dynamic-item-row").forEach(row => {
      const t = row.querySelector(".exp-title");
      const c = row.querySelector(".exp-company");
      const d = row.querySelector(".exp-desc");
      if (t && c && (t.value || c.value)) {
        const itemDiv = document.createElement("div");
        itemDiv.style.marginBottom = "10px";
        itemDiv.innerHTML = `<strong>${t.value || "Title"}</strong> at <em>${c.value || "Company"}</em><p style="font-size:12px; color:#444; margin-top:2px;">${d ? d.value : ""}</p>`;
        expListContainer.appendChild(itemDiv);
      }
    });
    if (expListContainer.children.length === 0) {
      expListContainer.innerHTML = `<p class="res-text-content">No experience added yet.</p>`;
    }

    // Update Education List
    const eduListContainer = $("previewEducationList");
    eduListContainer.innerHTML = "";
    // We check education rows specifically or loop through generic rows
    // Let's query inputs with edu-degree
    document.querySelectorAll("#educationFields .dynamic-item-row").forEach(row => {
      const deg = row.querySelector(".edu-degree");
      const sch = row.querySelector(".edu-school");
      if (deg && sch && (deg.value || sch.value)) {
        const itemDiv = document.createElement("div");
        itemDiv.style.marginBottom = "8px";
        itemDiv.innerHTML = `<strong>${deg.value || "Degree"}</strong> - <em>${sch.value || "Institution"}</em>`;
        eduListContainer.appendChild(itemDiv);
      }
    });
    if (eduListContainer.children.length === 0) {
      eduListContainer.innerHTML = `<p class="res-text-content">No education added yet.</p>`;
    }

    // Update Skills
    $("previewSkillsList").textContent = skillsInput && skillsInput.value ? skillsInput.value : "Add skills above...";
  }

  if (resumeBuilderForm) {
    resumeBuilderForm.addEventListener("input", updateLiveResumePreview);
  }

  // Trigger print cleanly without blank pages
  if (printResumeBtn) {
    printResumeBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Initial call
  updateLiveResumePreview();

  /* ===================================================
     STEP 2: FILE UPLOAD & PREVIEW SIMULATION
     =================================================== */
  if (resumeInput) {
    resumeInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        fileName.textContent = file.name;
        if (previewContainer) {
          previewContainer.style.display = "block";
          if (pdfMessage) {
            pdfMessage.textContent = `Loaded preview for: ${file.name}`;
          }
          renderMockPreview(file.name);
        }
      } else {
        fileName.textContent = "No file selected";
        if (previewContainer) previewContainer.style.display = "none";
      }
    });
  }

  function renderMockPreview(filename) {
    if (!pdfCanvas) return;
    const ctx = pdfCanvas.getContext("2d");
    pdfCanvas.width = 300;
    pdfCanvas.height = 380;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("RESUME PREVIEW", 20, 30);

    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.fillText(`File: ${filename}`, 20, 50);

    ctx.fillStyle = "#cbd5e1";
    for (let i = 0; i < 10; i++) {
      ctx.fillRect(20, 80 + i * 25, 260, 10);
    }
  }

  if (closePreview) {
    closePreview.addEventListener("click", () => {
      previewContainer.style.display = "none";
    });
  }

  if (zoomIn) {
    zoomIn.addEventListener("click", () => {
      zoomLevel += 0.1;
      if (pdfCanvas) pdfCanvas.style.transform = `scale(${zoomLevel})`;
    });
  }

  if (zoomOut) {
    zoomOut.addEventListener("click", () => {
      if (zoomLevel > 0.6) {
        zoomLevel -= 0.1;
        if (pdfCanvas) pdfCanvas.style.transform = `scale(${zoomLevel})`;
      }
    });
  }

  /* ===================================================
     STEP 2: ATS ANALYSIS ENGINE
     =================================================== */
  if (resumeForm) {
    resumeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const checkedSkills = Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
      ).map((cb) => cb.value);

      const jobDescText = jobDescriptionInput ? jobDescriptionInput.value.toLowerCase() : "";
      const targetRole = (targetJobTitleInput && targetJobTitleInput.value.trim()) || "Inferred Specialist Role";
      const targetCompany = (targetCompanyInput && targetCompanyInput.value.trim()) || "Not specified";
      const expLevel = experienceSelect ? experienceSelect.value : "Not specified";

      runAnalysisAnimation(() => {
        performATSAnalysis(checkedSkills, jobDescText, targetRole, targetCompany, expLevel);
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resumeForm.reset();
      fileName.textContent = "No file selected";
      if (previewContainer) previewContainer.style.display = "none";
      if (resultCard) resultCard.style.display = "none";
      showToast("Form reset successfully");
    });
  }

  function runAnalysisAnimation(onComplete) {
    if (resultCard) resultCard.style.display = "block";
    resultCard.scrollIntoView({ behavior: "smooth" });

    if (progressBar) {
      progressBar.style.width = "0%";
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
        }
      }, 150);
    } else {
      onComplete();
    }
  }

  function performATSAnalysis(selectedSkills, jdText, targetRole, targetCompany, userExperience) {
    const masterKeywordPool = [
      "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js", 
      "Express.js", "Python", "Java", "C++", "HTML", "CSS", "SQL", 
      "MongoDB", "PostgreSQL", "AWS", "Azure", "Docker", "Kubernetes", "Git", "Agile"
    ];

    const jdKeywords = masterKeywordPool.filter((skill) =>
      jdText.includes(skill.toLowerCase())
    );

    const requiredList = [];
    const preferredList = [];

    jdKeywords.forEach((keyword) => {
      if (Math.random() > 0.4) {
        requiredList.push(keyword);
      } else {
        preferredList.push(keyword);
      }
    });

    const matched = selectedSkills.filter((skill) =>
      jdKeywords.some((jdK) => jdK.toLowerCase() === skill.toLowerCase())
    );

    const missing = jdKeywords.filter(
      (jdK) => !selectedSkills.some((s) => s.toLowerCase() === jdK.toLowerCase())
    );

    const criticalMissing = requiredList.filter(
      (reqK) => !selectedSkills.some((s) => s.toLowerCase() === reqK.toLowerCase())
    );

    const matchPercentage = jdKeywords.length > 0 
      ? Math.round((matched.length / jdKeywords.length) * 100) 
      : (selectedSkills.length > 0 ? 70 : 40);

    const overallScore = Math.min(100, Math.max(20, Math.round(matchPercentage * 0.7 + selectedSkills.length * 2.5)));

    updateScoreMeters(overallScore, matchPercentage);

    if (reportTargetTitle) reportTargetTitle.textContent = targetRole;
    if (reportTargetCompany) reportTargetCompany.textContent = targetCompany;
    if (reportExperienceFit) reportExperienceFit.textContent = `${userExperience} (Aligned)`;

    renderBreakdown(overallScore, matchPercentage, selectedSkills.length);

    renderPills(requiredKeywords, requiredList, "pill-required");
    renderPills(preferredKeywords, preferredList, "pill-preferred");
    if (requiredCount) requiredCount.textContent = requiredList.length;
    if (preferredCount) preferredCount.textContent = preferredList.length;

    renderPills(matchedKeywords, matched.length > 0 ? matched : selectedSkills, "pill-matched");
    renderPills(missingKeywords, missing.length > 0 ? missing : ["No critical missing terms detected"], "pill-missing");
    renderPills(criticalMissingSkills, criticalMissing.length > 0 ? criticalMissing : ["None! All critical skills matched."], "pill-critical");

    if (experienceGap) {
      experienceGap.innerHTML = `<p>Target Experience Level: <strong>${userExperience}</strong>. Skill overlap indicates high readiness for ${targetRole}.</p>`;
    }

    if (improvementPotential) {
      improvementPotential.innerHTML = `<p>Incorporate missing terms like <strong>${missing.slice(0, 3).join(", ") || "domain keywords"}</strong> to increase recruiter screen pass rates.</p>`;
    }

    if (skillPriority) {
      skillPriority.innerHTML = jdKeywords.slice(0, 5).map((skill, index) => `
        <div class="priority-row" style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;">
          <span><strong>Priority ${index + 1}:</strong> ${skill}</span>
          <span class="badge">${selectedSkills.includes(skill) ? "Matched" : "Missing"}</span>
        </div>
      `).join("") || "<p>Paste a full JD to view prioritized skills.</p>";
    }

    if (suggestionList) {
      suggestionList.innerHTML = `
        <li>Add measurable metrics to bullet points mentioning core skills.</li>
        <li>Format technical skills in a clean standard list to support parser accuracy.</li>
        <li>Ensure section headers use standard ATS naming conventions.</li>
      `;
    }
  }

  function updateScoreMeters(overall, match) {
    if (scoreElement) scoreElement.textContent = `${overall}%`;
    if (jobMatchScore) jobMatchScore.textContent = `${match}%`;
    if (jobMatchFill) jobMatchFill.style.width = `${match}%`;

    if (circleElement) {
      const radius = circleElement.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (overall / 100) * circumference;
      circleElement.style.strokeDasharray = `${circumference} ${circumference}`;
      circleElement.style.strokeDashoffset = offset;
    }

    if (resumeStrength) {
      if (overall >= 80) resumeStrength.textContent = "Strong Match 🚀";
      else if (overall >= 60) resumeStrength.textContent = "Moderate Match 📈";
      else resumeStrength.textContent = "Needs Optimization ⚠️";
    }

    if (resultText) {
      resultText.textContent = `Your resume achieves a ${overall}% overall optimization rating for this role.`;
    }
  }

  function renderBreakdown(overall, match, skillCount) {
    if (!scoreBreakdown) return;
    scoreBreakdown.innerHTML = `
      <div class="score-item"><span>Keyword Match</span><strong>${match}%</strong></div>
      <div class="score-item"><span>Skills Breadth</span><strong>${Math.min(100, skillCount * 10)}%</strong></div>
      <div class="score-item"><span>ATS Format</span><strong>90%</strong></div>
      <div class="score-item"><span>Readability</span><strong>95%</strong></div>
      <div class="score-item"><span>Structure</span><strong>88%</strong></div>
    `;
  }

  function renderPills(container, items, className) {
    if (!container) return;
    if (!items || items.length === 0) {
      container.innerHTML = '<span class="muted">None</span>';
      return;
    }
    container.innerHTML = items
      .map((item) => `<span class="keyword-chip ${className}">${item}</span>`)
      .join("");
  }

  /* ===================================================
     JOB SEARCH TABLE FILTERING
     =================================================== */
  if (jobSearch || jobLocation) {
    const filterJobs = () => {
      const query = jobSearch ? jobSearch.value.toLowerCase() : "";
      const loc = jobLocation ? jobLocation.value.toLowerCase() : "";
      const rows = jobsTable ? jobsTable.querySelectorAll("tbody tr") : [];
      let visibleCount = 0;

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const matchesQuery = text.includes(query);
        const matchesLoc = loc === "" || text.includes(loc);

        if (matchesQuery && matchesLoc) {
          row.style.display = "";
          visibleCount++;
        } else {
          row.style.display = "none";
        }
      });

      if (noJobs) {
        noJobs.style.display = visibleCount === 0 ? "block" : "none";
      }
    };

    if (jobSearch) jobSearch.addEventListener("input", filterJobs);
    if (jobLocation) jobLocation.addEventListener("change", filterJobs);
  }

  /* ===================================================
     FEEDBACK & TOAST
     =================================================== */
  if (feedbackBtn) {
    feedbackBtn.addEventListener("click", () => {
      showToast("Thank you for your feedback!");
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;a
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const resumeInput = document.getElementById('resume');
  const fileNameDisplay = document.getElementById('fileName');
  const previewContainer = document.getElementById('previewContainer');
  const pdfMessage = document.getElementById('pdfMessage');
  const pdfCanvas = document.getElementById('pdfCanvas');
  const closePreviewBtn = document.getElementById('closePreview');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const resumeForm = document.getElementById('resumeForm');
  const resetBtn = document.getElementById('resetBtn');

  let currentZoom = 1.0;

  // 1. Handle File Selection and Preview Generation
  resumeInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) {
      fileNameDisplay.textContent = 'No file selected';
      previewContainer.style.display = 'none';
      return;
    }

    fileNameDisplay.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    previewContainer.style.display = 'block';
    pdfMessage.textContent = 'Loading document preview...';

    const fileType = file.type;

    if (fileType === 'application/pdf') {
      renderPDFPreview(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileType === 'application/msword'
    ) {
      renderDocxPreview(file);
    } else {
      pdfMessage.textContent = 'Preview not available for this file format. Text extraction will still work.';
      const ctx = pdfCanvas.getContext('2d');
      ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
      pdfCanvas.width = 400;
      pdfCanvas.height = 150;
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText('Document Loaded: ' + file.name, 20, 80);
    }
  });

  // 2. Render PDF using basic object / canvas or fallback text indicator
  function renderPDFPreview(file) {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const typedarray = new Uint8Array(this.result);
      
      // Check if PDF.js library is loaded globally
      if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
          pdf.getPage(1).then(page => {
            const scale = 1.2 * currentZoom;
            const viewport = page.getViewport({ scale: scale });
            const context = pdfCanvas.getContext('2d');
            
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            
            page.render(renderContext).promise.then(() => {
              pdfMessage.textContent = `Displaying page 1 of ${pdf.numFrames || 1} (PDF)`;
            });
          });
        }).catch(err => {
          console.error(err);
          pdfMessage.textContent = 'Error rendering PDF preview. File is ready for analysis.';
        });
      } else {
        // Fallback if PDF.js CDN is not included in HTML
        pdfMessage.textContent = 'PDF loaded successfully. (Include PDF.js script for full visual preview canvas)';
        const ctx = pdfCanvas.getContext('2d');
        pdfCanvas.width = 400;
        pdfCanvas.height = 200;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('PDF Document Ready', 30, 80);
        ctx.font = '13px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(file.name, 30, 110);
      }
    };
    fileReader.readAsArrayBuffer(file);
  }

  // 3. Render DOCX info placeholder
  function renderDocxPreview(file) {
    pdfMessage.textContent = 'Word Document loaded successfully.';
    const ctx = pdfCanvas.getContext('2d');
    pdfCanvas.width = 400;
    pdfCanvas.height = 200;
    ctx.fillStyle = '#eff6ff';
    ctx.fillRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Word Document (.docx) Ready', 30, 80);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(file.name, 30, 110);
  }

  // Preview Control Actions
  closePreviewBtn.addEventListener('click', () => {
    previewContainer.style.display = 'none';
  });

  zoomInBtn.addEventListener('click', () => {
    currentZoom += 0.2;
    if (resumeInput.files[0]) {
      const event = new Event('change');
      resumeInput.dispatchEvent(event);
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (currentZoom > 0.6) {
      currentZoom -= 0.2;
      if (resumeInput.files[0]) {
        const event = new Event('change');
        resumeInput.dispatchEvent(event);
      }
    }
  });

  // 4. Handle Form Submission & ATS Analysis Simulation
  resumeForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const targetTitle = document.getElementById('targetJobTitle').value || 'Target Role';
    const targetCompany = document.getElementById('targetCompany').value || 'Target Company';
    const experienceFit = document.getElementById('experience').value;
    const jdText = document.getElementById('jobDescription').value;

    // Collect checked skills
    const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
      .map(cb => cb.value);

    // Update Report Header labels
    document.getElementById('reportTargetTitle').textContent = targetTitle;
    document.getElementById('reportTargetCompany').textContent = targetCompany;
    document.getElementById('reportExperienceFit').textContent = experienceFit;

    // Calculate mock matching scores based on inputs
    const baseScore = Math.floor(Math.random() * 25) + 60; // Score between 60-85%
    const finalScore = selectedSkills.length > 3 ? Math.min(baseScore + 15, 96) : baseScore;

    // Update UI elements with results
    document.getElementById('score').textContent = `${finalScore}%`;
    document.getElementById('progressBar').style.width = `${finalScore}%`;
    document.getElementById('jobMatchScore').textContent = `${finalScore}%`;
    document.getElementById('jobMatchFill').style.width = `${finalScore}%`;
    
    // Set circle progress stroke offset if applicable
    const circle = document.getElementById('circle');
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (finalScore / 100) * circumference;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
    }

    // Verdict text
    const strengthEl = document.getElementById('resumeStrength');
    const resultTextEl = document.getElementById('resultText');
    if (finalScore >= 85) {
      strengthEl.textContent = 'High Optimization (Strong Match)';
      resultTextEl.textContent = 'Your resume aligns exceptionally well with the target role requirements.';
    } else if (finalScore >= 70) {
      strengthEl.textContent = 'Moderate Optimization (Good Match)';
      resultTextEl.textContent = 'Good foundation, but incorporating missing keywords will boost interview callbacks.';
    } else {
      strengthEl.textContent = 'Needs Improvement';
      resultTextEl.textContent = 'Significant gaps identified between your resume profile and the job description.';
    }

    // Populate Dynamic Lists
    document.getElementById('requiredCount').textContent = selectedSkills.length > 0 ? selectedSkills.length : '4';
    document.getElementById('preferredCount').textContent = '3';

    // Required & Preferred Keywords simulation
    renderBadges('requiredKeywords', ['JavaScript', 'React', 'TypeScript', 'Git', 'Agile'], 'badge-required');
    renderBadges('preferredKeywords', ['AWS', 'Docker', 'Node.js'], 'badge-preferred');
    renderBadges('matchedKeywords', selectedSkills.length > 0 ? selectedSkills : ['JavaScript', 'React', 'Git'], 'badge-matched');
    renderBadges('missingKeywords', ['GraphQL', 'CI/CD Pipelines', 'Jest'], 'badge-missing');
    
    // Critical Missing Skills
    const criticalBox = document.getElementById('criticalMissingSkills');
    criticalBox.innerHTML = `
      <div class="pill-tag missing">GraphQL Integration</div>
      <div class="pill-tag missing">Automated Testing (Jest/Cypress)</div>
      <div class="pill-tag missing">Cloud Deployment (AWS/Docker)</div>
    `;

    // Experience Alignment & Improvement Potential
    document.getElementById('experienceGap').textContent = `Your selected experience level (${experienceFit}) matches the seniority requirements outlined in the job description.`;
    document.getElementById('improvementPotential').textContent = `Adding targeted keywords and addressing missing skills can increase your overall ATS score by up to +18%.`;

    // Prioritized Action Items
    document.getElementById('skillPriority').innerHTML = `
      <ol style="margin: 0; padding-left: 20px; color: #334155; line-height: 1.6;">
        <li>Add explicit mentions of state management libraries (Redux/Zustand) in your experience bullet points.</li>
        <li>Quantify your performance metrics (e.g., "Improved page load speed by 25%").</li>
        <li>Ensure standard section headings like "Work Experience", "Skills", and "Education" are used for clean parser compliance.</li>
      </ol>
    `;

    // Actionable Recommendations
    const suggestionList = document.getElementById('suggestionList');
    suggestionList.innerHTML = `
      <li>Incorporate exact phrase matches found in the job description text box.</li>
      <li>Save and export your resume as a text-searchable PDF format rather than an image scan.</li>
      <li>Highlight leadership or cross-functional collaboration experience clearly.</li>
    `;

    // Scroll smoothly to result section
    document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth' });
  });

  // Reset Form
  resetBtn.addEventListener('click', () => {
    resumeForm.reset();
    fileNameDisplay.textContent = 'No file selected';
    previewContainer.style.display = 'none';
    document.getElementById('score').textContent = '0%';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('jobMatchScore').textContent = '0%';
    document.getElementById('jobMatchFill').style.width = '0%';
    document.getElementById('resumeStrength').textContent = 'Evaluating...';
    document.getElementById('resultText').textContent = 'Your score breakdown across custom matching filters.';
  });

  function renderBadges(containerId, items, className) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `<span class="keyword-pill ${className}">${item}</span>`).join('');
  }
});