/* =====================================================
   CAREERPILOT AI - COMPLETE FRONTEND JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* =====================================================
     NAVIGATION & UI ELEMENTS
     ===================================================== */

  const startBtn = $("startBtn");
  const resumeSection = $("resume-section");
  const mobileMenuBtn = $("mobileMenuBtn");
  const navLinks = $("navLinks");
  const themeToggle = $("themeToggle");

  /* =====================================================
     RESUME / ATS UI ELEMENTS
     ===================================================== */

  const resumeForm = $("resumeForm");
  const resumeInput = $("resume");
  const fileName = $("fileName");
  const resetBtn = $("resetBtn");

  const previewContainer = $("previewContainer");
  const closePreview = $("closePreview");
  const zoomIn = $("zoomIn");
  const zoomOut = $("zoomOut");

  const pdfCanvas = $("pdfCanvas");
  const pdfMessage = $("pdfMessage");

  let currentZoom = 1.0;

  /* =====================================================
     JOB SEARCH ELEMENTS
     ===================================================== */

  const jobSearch = $("jobSearch");
  const jobLocation = $("jobLocation");
  const jobsTable = $("jobsTable");
  const noJobs = $("noJobs");

  /* =====================================================
     FEEDBACK
     ===================================================== */

  const feedbackBtn = $("feedbackBtn");


  /* =====================================================
     NAVIGATION
     ===================================================== */

  if (startBtn && resumeSection) {

    startBtn.addEventListener("click", () => {

      resumeSection.scrollIntoView({
        behavior: "smooth"
      });

    });

  }


  /* =====================================================
     MOBILE MENU
     ===================================================== */

  if (mobileMenuBtn && navLinks) {

    mobileMenuBtn.addEventListener("click", () => {

      const isExpanded =
        mobileMenuBtn.getAttribute("aria-expanded") === "true";

      mobileMenuBtn.setAttribute(
        "aria-expanded",
        !isExpanded
      );

      navLinks.classList.toggle("active");

    });

  }


  /* =====================================================
     DARK / LIGHT MODE
     ===================================================== */

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      document.body.classList.toggle("dark-mode");

      const isDark =
        document.body.classList.contains("dark-mode");

      themeToggle.textContent =
        isDark ? "☀️" : "🌙";

    });

  }


  /* =====================================================
     STEP 3 - RESUME BUILDER
     ===================================================== */

  const resumeBuilderForm = $("resumeBuilderForm");
  const printResumeBtn = $("printResumeBtn");

  const experienceFields = $("experienceFields");
  const educationFields = $("educationFields");

  const addExpBtn = $("addExpBtn");
  const addEduBtn = $("addEduBtn");


  /* =====================================================
     LIVE RESUME PREVIEW
     ===================================================== */

  window.updateLiveResumePreview = function () {

    if (!resumeBuilderForm) {
      return;
    }


    /* -----------------------------------------------------
       BASIC INFORMATION
       ----------------------------------------------------- */

    const nameInput =
      resumeBuilderForm.querySelector(
        'input[name="fullName"]'
      );

    const emailInput =
      resumeBuilderForm.querySelector(
        'input[name="email"]'
      );

    const phoneInput =
      resumeBuilderForm.querySelector(
        'input[name="phone"]'
      );

    const locInput =
      resumeBuilderForm.querySelector(
        'input[name="location"]'
      );

    const summaryInput =
      resumeBuilderForm.querySelector(
        'textarea[name="summary"]'
      );

    const skillsInput =
      resumeBuilderForm.querySelector(
        'input[name="skillsList"]'
      );


    /* -----------------------------------------------------
       NAME
       ----------------------------------------------------- */

    const previewName = $("previewName");

    if (previewName) {

      previewName.textContent =
        nameInput && nameInput.value
          ? nameInput.value
          : "Your Name";

    }


    /* -----------------------------------------------------
       CONTACT
       ----------------------------------------------------- */

    const contactParts = [

      emailInput
        ? emailInput.value
        : "",

      phoneInput
        ? phoneInput.value
        : "",

      locInput
        ? locInput.value
        : ""

    ].filter(Boolean);


    const previewContact =
      $("previewContact");

    if (previewContact) {

      previewContact.textContent =
        contactParts.length > 0
          ? contactParts.join(" | ")
          : "email@example.com | Phone | Location";

    }


    /* -----------------------------------------------------
       SUMMARY
       ----------------------------------------------------- */

    const previewSummary =
      $("previewSummary");

    if (previewSummary) {

      previewSummary.textContent =
        summaryInput && summaryInput.value
          ? summaryInput.value
          : "Your professional summary will appear here...";

    }


    /* -----------------------------------------------------
       EXPERIENCE
       ----------------------------------------------------- */

    const expListContainer =
      $("previewExperienceList");

    if (expListContainer) {

      expListContainer.innerHTML = "";


      document
        .querySelectorAll(
          "#experienceFields .dynamic-item-row"
        )
        .forEach((row) => {

          const title =
            row.querySelector(".exp-title");

          const company =
            row.querySelector(".exp-company");

          const description =
            row.querySelector(".exp-desc");


          if (
            title &&
            company &&
            (title.value || company.value)
          ) {

            const itemDiv =
              document.createElement("div");

            itemDiv.style.marginBottom =
              "10px";


            const strong =
              document.createElement("strong");

            strong.textContent =
              title.value || "Title";


            const companyText =
              document.createTextNode(
                " at "
              );


            const em =
              document.createElement("em");

            em.textContent =
              company.value || "Company";


            const p =
              document.createElement("p");

            p.style.fontSize =
              "12px";

            p.style.color =
              "#444";

            p.style.marginTop =
              "2px";

            p.textContent =
              description
                ? description.value
                : "";


            itemDiv.appendChild(strong);
            itemDiv.appendChild(companyText);
            itemDiv.appendChild(em);
            itemDiv.appendChild(p);


            expListContainer.appendChild(
              itemDiv
            );

          }

        });


      if (
        expListContainer.children.length === 0
      ) {

        expListContainer.innerHTML = `
          <p class="res-text-content">
            No experience added yet.
          </p>
        `;

      }

    }


    /* -----------------------------------------------------
       EDUCATION
       ----------------------------------------------------- */

    const eduListContainer =
      $("previewEducationList");

    if (eduListContainer) {

      eduListContainer.innerHTML = "";


      document
        .querySelectorAll(
          "#educationFields .dynamic-item-row"
        )
        .forEach((row) => {

          const degree =
            row.querySelector(".edu-degree");

          const school =
            row.querySelector(".edu-school");


          if (
            degree &&
            school &&
            (degree.value || school.value)
          ) {

            const itemDiv =
              document.createElement("div");

            itemDiv.style.marginBottom =
              "8px";


            const strong =
              document.createElement("strong");

            strong.textContent =
              degree.value || "Degree";


            const separator =
              document.createTextNode(
                " - "
              );


            const em =
              document.createElement("em");

            em.textContent =
              school.value || "Institution";


            itemDiv.appendChild(strong);
            itemDiv.appendChild(separator);
            itemDiv.appendChild(em);


            eduListContainer.appendChild(
              itemDiv
            );

          }

        });


      if (
        eduListContainer.children.length === 0
      ) {

        eduListContainer.innerHTML = `
          <p class="res-text-content">
            No education added yet.
          </p>
        `;

      }

    }


    /* -----------------------------------------------------
       SKILLS
       ----------------------------------------------------- */

    const previewSkillsList =
      $("previewSkillsList");

    if (previewSkillsList) {

      previewSkillsList.textContent =
        skillsInput && skillsInput.value
          ? skillsInput.value
          : "Add skills above...";

    }

  };


  /* =====================================================
     ADD EXPERIENCE ROW
     ===================================================== */

  function addExperienceRow(
    title = "",
    company = "",
    desc = ""
  ) {

    const div =
      document.createElement("div");

    div.className =
      "dynamic-item-row";


    div.innerHTML = `
      <div
        class="form-group"
        style="margin-bottom:10px;"
      >

        <label>
          Job Title
        </label>

        <input
          type="text"
          class="exp-title"
          value="${title}"
          placeholder="e.g. Software Engineer"
        >

      </div>


      <div
        class="form-group"
        style="margin-bottom:10px;"
      >

        <label>
          Company
        </label>

        <input
          type="text"
          class="exp-company"
          value="${company}"
          placeholder="e.g. Tech Inc"
        >

      </div>


      <div
        class="form-group"
        style="margin-bottom:0;"
      >

        <label>
          Highlights / Description
        </label>

        <textarea
          class="exp-desc"
          placeholder="Led development of..."
        >${desc}</textarea>

      </div>


      <button
        type="button"
        class="reset-btn"
        style="
          margin-top:10px;
          padding:6px 12px;
          font-size:12px;
        "
      >
        Remove
      </button>
    `;


    if (experienceFields) {

      experienceFields.appendChild(div);

    }


    /* -----------------------------------------------------
       REMOVE BUTTON
       ----------------------------------------------------- */

    const removeButton =
      div.querySelector(".reset-btn");

    if (removeButton) {

      removeButton.addEventListener(
        "click",
        () => {

          div.remove();

          if (
            typeof window.updateLiveResumePreview ===
            "function"
          ) {

            window.updateLiveResumePreview();

          }

        }
      );

    }


    /* -----------------------------------------------------
       LIVE PREVIEW
       ----------------------------------------------------- */

    div
      .querySelectorAll("input, textarea")
      .forEach((element) => {

        element.addEventListener(
          "input",
          () => {

            if (
              typeof window.updateLiveResumePreview ===
              "function"
            ) {

              window.updateLiveResumePreview();

            }

          }
        );

      });

  }


  /* =====================================================
     ADD EDUCATION ROW
     ===================================================== */

  function addEducationRow(
    degree = "",
    school = ""
  ) {

    const div =
      document.createElement("div");

    div.className =
      "dynamic-item-row";


    div.innerHTML = `
      <div
        class="form-group"
        style="margin-bottom:10px;"
      >

        <label>
          Degree / Field
        </label>

        <input
          type="text"
          class="edu-degree"
          value="${degree}"
          placeholder="e.g. B.Tech in Computer Science"
        >

      </div>


      <div
        class="form-group"
        style="margin-bottom:0;"
      >

        <label>
          Institution / University
        </label>

        <input
          type="text"
          class="edu-school"
          value="${school}"
          placeholder="e.g. State University"
        >

      </div>


      <button
        type="button"
        class="reset-btn"
        style="
          margin-top:10px;
          padding:6px 12px;
          font-size:12px;
        "
      >
        Remove
      </button>
    `;


    if (educationFields) {

      educationFields.appendChild(div);

    }


    /* -----------------------------------------------------
       REMOVE BUTTON
       ----------------------------------------------------- */

    const removeButton =
      div.querySelector(".reset-btn");

    if (removeButton) {

      removeButton.addEventListener(
        "click",
        () => {

          div.remove();

          if (
            typeof window.updateLiveResumePreview ===
            "function"
          ) {

            window.updateLiveResumePreview();

          }

        }
      );

    }


    /* -----------------------------------------------------
       LIVE PREVIEW
       ----------------------------------------------------- */

    div
      .querySelectorAll("input")
      .forEach((element) => {

        element.addEventListener(
          "input",
          () => {

            if (
              typeof window.updateLiveResumePreview ===
              "function"
            ) {

              window.updateLiveResumePreview();

            }

          }
        );

      });

  }


  /* =====================================================
     ADD EXPERIENCE BUTTON
     ===================================================== */

  if (addExpBtn) {

    addExpBtn.addEventListener(
      "click",
      () => {

        addExperienceRow();

      }
    );

  }


  /* =====================================================
     ADD EDUCATION BUTTON
     ===================================================== */

  if (addEduBtn) {

    addEduBtn.addEventListener(
      "click",
      () => {

        addEducationRow();

      }
    );

  }


  /* =====================================================
     DEFAULT EXPERIENCE
     ===================================================== */

  if (
    experienceFields &&
    experienceFields.children.length === 0
  ) {

    addExperienceRow(
      "Frontend Developer",
      "Acme Corp",
      "Built responsive web applications using JavaScript and React."
    );

  }


  /* =====================================================
     DEFAULT EDUCATION
     ===================================================== */

  if (
    educationFields &&
    educationFields.children.length === 0
  ) {

    addEducationRow(
      "B.S. in Computer Science",
      "University of Technology"
    );

  }


  /* =====================================================
     RESUME BUILDER INPUT LISTENER
     ===================================================== */

  if (resumeBuilderForm) {

    resumeBuilderForm.addEventListener(
      "input",
      () => {

        if (
          typeof window.updateLiveResumePreview ===
          "function"
        ) {

          window.updateLiveResumePreview();

        }

      }
    );

  }


  /* =====================================================
     INITIAL RESUME PREVIEW
     ===================================================== */

  if (
    typeof window.updateLiveResumePreview ===
    "function"
  ) {

    window.updateLiveResumePreview();

  }


  /* =====================================================
     PRINT RESUME
     ===================================================== */

  if (printResumeBtn) {

    printResumeBtn.addEventListener(
      "click",
      () => {

        window.print();

      }
    );

  }


  /* =====================================================
     FILE UPLOAD & PREVIEW
     
     IMPORTANT:
     ATS SUBMIT IS NOT HANDLED HERE.

     backend-integration.js handles:

     POST /api/ats/analyze

     Therefore this file NEVER calls:
     resumeForm.reset()
     resumeForm.submit()
     location.reload()
     ===================================================== */

  if (resumeInput) {

    resumeInput.addEventListener(
      "change",
      function (event) {

        const file =
          event.target.files[0];
          window.careerPilotSelectedResumeFile = file || null;


        /* -------------------------------------------------
           NO FILE
           ------------------------------------------------- */

        if (!file) {

          if (fileName) {

            fileName.textContent =
              "No file selected";

          }


          if (previewContainer) {

            previewContainer.style.display =
              "none";

          }

          return;

        }


        /* -------------------------------------------------
           FILE NAME
           ------------------------------------------------- */

        if (fileName) {

          fileName.textContent =
            `Selected: ${file.name} (${(
              file.size / 1024
            ).toFixed(1)} KB)`;

        }


        /* -------------------------------------------------
           SHOW PREVIEW
           ------------------------------------------------- */

        if (previewContainer) {

          previewContainer.style.display =
            "block";

        }


        if (pdfMessage) {

          pdfMessage.textContent =
            "Loading document preview...";

        }


        const fileType =
          file.type;


        /* -------------------------------------------------
           PDF
           ------------------------------------------------- */

        if (
          fileType ===
          "application/pdf"
        ) {

          renderPDFPreview(file);

        }


        /* -------------------------------------------------
           DOCX / DOC
           ------------------------------------------------- */

        else if (
          fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          fileType ===
            "application/msword"
        ) {

          renderDocxPreview(file);

        }


        /* -------------------------------------------------
           OTHER FILE
           ------------------------------------------------- */

        else {

          if (pdfMessage) {

            pdfMessage.textContent =
              "Document ready for ATS analysis.";

          }


          if (pdfCanvas) {

            const context =
              pdfCanvas.getContext("2d");


            pdfCanvas.width =
              400;

            pdfCanvas.height =
              150;


            context.fillStyle =
              "#f1f5f9";

            context.fillRect(
              0,
              0,
              pdfCanvas.width,
              pdfCanvas.height
            );


            context.fillStyle =
              "#475569";

            context.font =
              "14px sans-serif";


            context.fillText(
              "Document Loaded: " +
              file.name,
              20,
              80
            );

          }

        }

      }
    );

  }


  /* =====================================================
     PDF PREVIEW
     ===================================================== */

  function renderPDFPreview(file) {

    const fileReader =
      new FileReader();


    fileReader.onload =
      function () {

        const typedArray =
          new Uint8Array(
            this.result
          );


        /*
          PDF.js is only used for preview.
          ATS analysis is done by backend.
        */

        if (
          typeof pdfjsLib !==
          "undefined"
        ) {

          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";


          pdfjsLib
            .getDocument(typedArray)
            .promise
            .then((pdf) => {

              return pdf
                .getPage(1)
                .then((page) => {

                  const scale =
                    1.2 * currentZoom;


                  const viewport =
                    page.getViewport({
                      scale: scale
                    });


                  if (!pdfCanvas) {
                    return;
                  }


                  const context =
                    pdfCanvas.getContext(
                      "2d"
                    );


                  pdfCanvas.height =
                    viewport.height;

                  pdfCanvas.width =
                    viewport.width;


                  const renderContext = {
                    canvasContext:
                      context,

                    viewport:
                      viewport
                  };


                  return page
                    .render(renderContext)
                    .promise
                    .then(() => {

                      if (pdfMessage) {

                        pdfMessage.textContent =
                          `Displaying page 1 of ${pdf.numPages} (PDF)`;

                      }

                    });

                });

            })
            .catch((error) => {

              console.error(
                "PDF Preview Error:",
                error
              );


              if (pdfMessage) {

                pdfMessage.textContent =
                  "Preview error. File is ready for analysis.";

              }

            });

        }

        else {

          if (pdfMessage) {

            pdfMessage.textContent =
              "PDF loaded successfully.";

          }

        }

      };


    fileReader.readAsArrayBuffer(file);

  }


  /* =====================================================
     DOCX / DOC PREVIEW
     ===================================================== */

  function renderDocxPreview(file) {

    if (pdfMessage) {

      pdfMessage.textContent =
        "Word Document loaded successfully.";

    }


    if (!pdfCanvas) {
      return;
    }


    const context =
      pdfCanvas.getContext("2d");


    pdfCanvas.width =
      400;

    pdfCanvas.height =
      200;


    context.fillStyle =
      "#eff6ff";

    context.fillRect(
      0,
      0,
      pdfCanvas.width,
      pdfCanvas.height
    );


    context.fillStyle =
      "#1e40af";

    context.font =
      "bold 16px sans-serif";


    context.fillText(
      "Word Document (.docx) Ready",
      30,
      80
    );


    context.font =
      "13px sans-serif";

    context.fillStyle =
      "#3b82f6";


    context.fillText(
      file.name,
      30,
      110
    );

  }


  /* =====================================================
     CLOSE PREVIEW
     ===================================================== */

  if (closePreview) {

    closePreview.addEventListener(
      "click",
      () => {

        if (previewContainer) {

          previewContainer.style.display =
            "none";

        }

      }
    );

  }


  /* =====================================================
     ZOOM IN
     ===================================================== */

  if (zoomIn) {

    zoomIn.addEventListener(
      "click",
      () => {

        currentZoom += 0.2;


        if (
          resumeInput &&
          resumeInput.files[0]
        ) {

          resumeInput.dispatchEvent(
            new Event("change")
          );

        }

      }
    );

  }


  /* =====================================================
     ZOOM OUT
     ===================================================== */

  if (zoomOut) {

    zoomOut.addEventListener(
      "click",
      () => {

        if (currentZoom > 0.6) {

          currentZoom -= 0.2;


          if (
            resumeInput &&
            resumeInput.files[0]
          ) {

            resumeInput.dispatchEvent(
              new Event("change")
            );

          }

        }

      }
    );

  }


  /* =====================================================
     JOB SEARCH TABLE FILTERING
     ===================================================== */

  if (jobSearch || jobLocation) {

    const filterJobs = () => {

      const query =
        jobSearch
          ? jobSearch.value.toLowerCase()
          : "";


      const location =
        jobLocation
          ? jobLocation.value.toLowerCase()
          : "";


      const rows =
        jobsTable
          ? jobsTable.querySelectorAll(
              "tbody tr"
            )
          : [];


      let visibleCount =
        0;


      rows.forEach((row) => {

        const text =
          row.textContent.toLowerCase();


        const matchesQuery =
          text.includes(query);


        const matchesLocation =
          location === "" ||
          text.includes(location);


        if (
          matchesQuery &&
          matchesLocation
        ) {

          row.style.display =
            "";

          visibleCount++;

        }

        else {

          row.style.display =
            "none";

        }

      });


      if (noJobs) {

        noJobs.style.display =
          visibleCount === 0
            ? "block"
            : "none";

      }

    };


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

  }


  /* =====================================================
     FEEDBACK BUTTON
     ===================================================== */

  if (feedbackBtn) {

    feedbackBtn.addEventListener(
      "click",
      () => {

        alert(
          "💬 We'd love to hear your feedback!"
        );

      }
    );

  }


  /* =====================================================
     IMPORTANT ATS NOTE
     =====================================================

     This script.js does NOT submit the ATS form.

     ATS submission is handled ONLY by:

     backend-integration.js

     API:
     POST /api/ats/analyze

     This prevents multiple submit handlers from
     interfering with the selected resume file.

     ===================================================== */

});



/* =========================================================
   CAREERPILOT - RESUME BUILDER IMPROVEMENTS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const resumeBuilderForm =
    document.getElementById("resumeBuilderForm");

  if (!resumeBuilderForm) {
    return;
  }


  /* =======================================================
     DATA
     ======================================================= */

  let skills = [];

  let experienceCount = 0;

  let educationCount = 0;

  let projectCount = 0;

  let certificationCount = 0;


  /* =======================================================
     ELEMENTS
     ======================================================= */

  const skillInput =
    document.getElementById("skillInput");

  const addSkillBtn =
    document.getElementById("addSkillBtn");

  const skillsContainer =
    document.getElementById("skillsContainer");

  const experienceFields =
    document.getElementById("experienceFields");

  const educationFields =
    document.getElementById("educationFields");

  const projectFields =
    document.getElementById("projectFields");

  const certificationFields =
    document.getElementById("certificationFields");


  /* =======================================================
     ADD SKILL
     ======================================================= */

  function addSkill() {

    if (!skillInput) {
      return;
    }

    const value =
      skillInput.value.trim();

    if (!value) {
      return;
    }


    /*
      Prevent duplicate skills
    */

    const alreadyExists =
      skills.some(
        skill =>
          skill.toLowerCase() === value.toLowerCase()
      );


    if (alreadyExists) {

      skillInput.value = "";

      return;
    }


    skills.push(value);

    skillInput.value = "";

    renderSkills();

    updateResumePreview();
  }


  /* =======================================================
     RENDER SKILLS
     ======================================================= */

  function renderSkills() {

    if (!skillsContainer) {
      return;
    }

    skillsContainer.innerHTML = "";


    skills.forEach(function (skill, index) {

      const tag =
        document.createElement("div");

      tag.className =
        "skill-tag";


      const text =
        document.createElement("span");

      text.textContent =
        skill;


      const removeBtn =
        document.createElement("button");

      removeBtn.type =
        "button";

      removeBtn.className =
        "skill-remove";

      removeBtn.innerHTML =
        "×";

      removeBtn.setAttribute(
        "aria-label",
        "Remove " + skill
      );


      removeBtn.addEventListener(
        "click",
        function () {

          skills.splice(index, 1);

          renderSkills();

          updateResumePreview();

        }
      );


      tag.appendChild(text);

      tag.appendChild(removeBtn);

      skillsContainer.appendChild(tag);

    });

  }


  /* =======================================================
     SKILL BUTTON
     ======================================================= */

  if (addSkillBtn) {

    addSkillBtn.addEventListener(
      "click",
      addSkill
    );

  }


  /* =======================================================
     SKILL ENTER KEY
     ======================================================= */

  if (skillInput) {

    skillInput.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Enter") {

          event.preventDefault();

          addSkill();

        }

      }
    );

  }


  /* =======================================================
     ADD EXPERIENCE
     ======================================================= */

  const addExperience =
    function () {

      experienceCount++;


      const card =
        document.createElement("div");

      card.className =
        "builder-dynamic-card experience-card";


      card.innerHTML = `

        <button
          type="button"
          class="remove-builder-item"
          title="Remove experience"
        >
          ×
        </button>

        <h4>Experience ${experienceCount}</h4>

        <div class="form-group">

          <label>Job Title</label>

          <input
            type="text"
            class="experience-job-title"
            placeholder="e.g. Software Developer Intern"
          >

        </div>

        <div class="form-group">

          <label>Company</label>

          <input
            type="text"
            class="experience-company"
            placeholder="e.g. ABC Technologies"
          >

        </div>

        <div class="form-group">

          <label>Duration</label>

          <input
            type="text"
            class="experience-duration"
            placeholder="e.g. June 2026 - August 2026"
          >

        </div>

        <div class="form-group">

          <label>Responsibilities</label>

          <textarea
            class="experience-description"
            placeholder="Describe your responsibilities and achievements..."
          ></textarea>

        </div>

      `;


      const removeBtn =
        card.querySelector(
          ".remove-builder-item"
        );


      removeBtn.addEventListener(
        "click",
        function () {

          card.remove();

          updateResumePreview();

        }
      );


      experienceFields.appendChild(card);


      attachPreviewListeners(card);

      updateResumePreview();

    };


  /* =======================================================
     ADD EDUCATION
     ======================================================= */

  const addEducation =
    function () {

      educationCount++;


      const card =
        document.createElement("div");

      card.className =
        "builder-dynamic-card education-card";


      card.innerHTML = `

        <button
          type="button"
          class="remove-builder-item"
          title="Remove education"
        >
          ×
        </button>

        <h4>Education ${educationCount}</h4>

        <div class="form-group">

          <label>Degree / Course</label>

          <input
            type="text"
            class="education-degree"
            placeholder="e.g. Master of Computer Application"
          >

        </div>

        <div class="form-group">

          <label>Institution</label>

          <input
            type="text"
            class="education-institution"
            placeholder="e.g. Pranveer Singh Institute of Technology"
          >

        </div>

        <div class="form-group">

          <label>Year / Duration</label>

          <input
            type="text"
            class="education-year"
            placeholder="e.g. 2025 - 2027"
          >

        </div>

        <div class="form-group">

          <label>Grade / CGPA</label>

          <input
            type="text"
            class="education-grade"
            placeholder="e.g. CGPA: 8.59"
          >

        </div>

      `;


      const removeBtn =
        card.querySelector(
          ".remove-builder-item"
        );


      removeBtn.addEventListener(
        "click",
        function () {

          card.remove();

          updateResumePreview();

        }
      );


      educationFields.appendChild(card);


      attachPreviewListeners(card);

      updateResumePreview();

    };


  /* =======================================================
     ADD PROJECT
     ======================================================= */

  const addProject =
    function () {

      projectCount++;


      const card =
        document.createElement("div");

      card.className =
        "builder-dynamic-card project-card";


      card.innerHTML = `

        <button
          type="button"
          class="remove-builder-item"
          title="Remove project"
        >
          ×
        </button>

        <h4>Project ${projectCount}</h4>

        <div class="form-group">

          <label>Project Name</label>

          <input
            type="text"
            class="project-name"
            placeholder="e.g. CareerPilot AI"
          >

        </div>

        <div class="form-group">

          <label>Technologies</label>

          <input
            type="text"
            class="project-technologies"
            placeholder="e.g. HTML, CSS, JavaScript"
          >

        </div>

        <div class="form-group">

          <label>Project Description</label>

          <textarea
            class="project-description"
            placeholder="Describe what you built and what problem it solves..."
          ></textarea>

        </div>

        <div class="form-group">

          <label>Project Link</label>

          <input
            type="text"
            class="project-link"
            placeholder="https://github.com/username/project"
          >

        </div>

      `;


      const removeBtn =
        card.querySelector(
          ".remove-builder-item"
        );


      removeBtn.addEventListener(
        "click",
        function () {

          card.remove();

          updateResumePreview();

        }
      );


      projectFields.appendChild(card);


      attachPreviewListeners(card);

      updateResumePreview();

    };


  /* =======================================================
     ADD CERTIFICATION
     ======================================================= */

  const addCertification =
    function () {

      certificationCount++;


      const card =
        document.createElement("div");

      card.className =
        "builder-dynamic-card certification-card";


      card.innerHTML = `

        <button
          type="button"
          class="remove-builder-item"
          title="Remove certification"
        >
          ×
        </button>

        <h4>Certification ${certificationCount}</h4>

        <div class="form-group">

          <label>Certification Name</label>

          <input
            type="text"
            class="certification-name"
            placeholder="e.g. Generative AI Essentials"
          >

        </div>

        <div class="form-group">

          <label>Issuing Organization</label>

          <input
            type="text"
            class="certification-organization"
            placeholder="e.g. TCS iON"
          >

        </div>

        <div class="form-group">

          <label>Issue Date</label>

          <input
            type="text"
            class="certification-date"
            placeholder="e.g. May 2026"
          >

        </div>

      `;


      const removeBtn =
        card.querySelector(
          ".remove-builder-item"
        );


      removeBtn.addEventListener(
        "click",
        function () {

          card.remove();

          updateResumePreview();

        }
      );


      certificationFields.appendChild(card);


      attachPreviewListeners(card);

      updateResumePreview();

    };


  /* =======================================================
     BUTTONS
     ======================================================= */

  const addExpBtn =
    document.getElementById("addExpBtn");

  const addEduBtn =
    document.getElementById("addEduBtn");

  const addProjectBtn =
    document.getElementById("addProjectBtn");

  const addCertificationBtn =
    document.getElementById(
      "addCertificationBtn"
    );


  if (addExpBtn) {

    addExpBtn.addEventListener(
      "click",
      addExperience
    );

  }


  if (addEduBtn) {

    addEduBtn.addEventListener(
      "click",
      addEducation
    );

  }


  if (addProjectBtn) {

    addProjectBtn.addEventListener(
      "click",
      addProject
    );

  }


  if (addCertificationBtn) {

    addCertificationBtn.addEventListener(
      "click",
      addCertification
    );

  }


  /* =======================================================
     LIVE PREVIEW LISTENERS
     ======================================================= */

  function attachPreviewListeners(container) {

    const inputs =
      container.querySelectorAll(
        "input, textarea"
      );


    inputs.forEach(function (input) {

      input.addEventListener(
        "input",
        updateResumePreview
      );

    });

  }


  /* =======================================================
     UPDATE PREVIEW
     ======================================================= */

  function updateResumePreview() {

    updatePersonalInformation();

    updateSummary();

    updateSkills();

    updateExperience();

    updateEducation();

    updateProjects();

    updateCertifications();

    updateAchievements();

  }


  /* =======================================================
     PERSONAL INFORMATION
     ======================================================= */

  function updatePersonalInformation() {

    const formData =
      new FormData(
        resumeBuilderForm
      );


    const name =
      formData.get("fullName") ||
      "Your Name";


    const email =
      formData.get("email") ||
      "email@example.com";


    const phone =
      formData.get("phone") ||
      "Phone";


    const location =
      formData.get("location") ||
      "Location";


    const linkedin =
      formData.get("linkedin") ||
      "";


    const github =
      formData.get("github") ||
      "";


    const previewName =
      document.getElementById(
        "previewName"
      );


    const previewContact =
      document.getElementById(
        "previewContact"
      );


    const previewLinks =
      document.getElementById(
        "previewLinks"
      );


    if (previewName) {

      previewName.textContent =
        name;

    }


    if (previewContact) {

      previewContact.textContent =
        `${email} | ${phone} | ${location}`;

    }


    if (previewLinks) {

      const links = [];


      if (linkedin.trim()) {

        links.push(
          linkedin.trim()
        );

      }


      if (github.trim()) {

        links.push(
          github.trim()
        );

      }


      previewLinks.textContent =
        links.join(" | ");

    }

  }


  /* =======================================================
     SUMMARY
     ======================================================= */

  function updateSummary() {

    const summary =
      resumeBuilderForm.elements
        .summary?.value
        ?.trim();


    const previewSummary =
      document.getElementById(
        "previewSummary"
      );


    if (!previewSummary) {
      return;
    }


    if (summary) {

      previewSummary.textContent =
        summary;

    } else {

      previewSummary.textContent =
        "Your professional summary will appear here...";

    }

  }


  /* =======================================================
     SKILLS PREVIEW
     ======================================================= */

  function updateSkills() {

    const preview =
      document.getElementById(
        "previewSkillsList"
      );


    if (!preview) {
      return;
    }


    preview.innerHTML = "";


    skills.forEach(function (skill) {

      const span =
        document.createElement("span");

      span.className =
        "preview-skill";

      span.textContent =
        skill;

      preview.appendChild(span);

    });


    toggleSection(
      "previewSkillsSection",
      skills.length > 0
    );

  }


  /* =======================================================
     EXPERIENCE PREVIEW
     ======================================================= */

  function updateExperience() {

    const preview =
      document.getElementById(
        "previewExperienceList"
      );


    if (!preview) {
      return;
    }


    preview.innerHTML = "";


    const cards =
      experienceFields.querySelectorAll(
        ".experience-card"
      );


    cards.forEach(function (card) {

      const title =
        card.querySelector(
          ".experience-job-title"
        )?.value.trim();


      const company =
        card.querySelector(
          ".experience-company"
        )?.value.trim();


      const duration =
        card.querySelector(
          ".experience-duration"
        )?.value.trim();


      const description =
        card.querySelector(
          ".experience-description"
        )?.value.trim();


      if (
        !title &&
        !company &&
        !duration &&
        !description
      ) {
        return;
      }


      const item =
        document.createElement("div");

      item.className =
        "preview-experience";


      const titleElement =
        document.createElement("div");

      titleElement.className =
        "preview-item-title";

      titleElement.textContent =
        title;


      const meta =
        document.createElement("div");

      meta.className =
        "preview-item-meta";

      meta.textContent =
        [company, duration]
          .filter(Boolean)
          .join(" | ");


      const descriptionElement =
        document.createElement("div");

      descriptionElement.textContent =
        description;


      item.appendChild(
        titleElement
      );

      item.appendChild(
        meta
      );

      item.appendChild(
        descriptionElement
      );


      preview.appendChild(item);

    });


    toggleSection(
      "previewExperienceSection",
      cards.length > 0
    );

  }


  /* =======================================================
     EDUCATION PREVIEW
     ======================================================= */

  function updateEducation() {

    const preview =
      document.getElementById(
        "previewEducationList"
      );


    if (!preview) {
      return;
    }


    preview.innerHTML = "";


    const cards =
      educationFields.querySelectorAll(
        ".education-card"
      );


    cards.forEach(function (card) {

      const degree =
        card.querySelector(
          ".education-degree"
        )?.value.trim();


      const institution =
        card.querySelector(
          ".education-institution"
        )?.value.trim();


      const year =
        card.querySelector(
          ".education-year"
        )?.value.trim();


      const grade =
        card.querySelector(
          ".education-grade"
        )?.value.trim();


      if (
        !degree &&
        !institution &&
        !year &&
        !grade
      ) {
        return;
      }


      const item =
        document.createElement("div");

      item.className =
        "preview-education";


      const title =
        document.createElement("div");

      title.className =
        "preview-item-title";

      title.textContent =
        degree;


      const meta =
        document.createElement("div");

      meta.className =
        "preview-item-meta";

      meta.textContent =
        [
          institution,
          year,
          grade
        ]
          .filter(Boolean)
          .join(" | ");


      item.appendChild(title);

      item.appendChild(meta);


      preview.appendChild(item);

    });


    toggleSection(
      "previewEducationSection",
      cards.length > 0
    );

  }


  /* =======================================================
     PROJECTS PREVIEW
     ======================================================= */

  function updateProjects() {

    const preview =
      document.getElementById(
        "previewProjectsList"
      );


    if (!preview) {
      return;
    }


    preview.innerHTML = "";


    const cards =
      projectFields.querySelectorAll(
        ".project-card"
      );


    cards.forEach(function (card) {

      const name =
        card.querySelector(
          ".project-name"
        )?.value.trim();


      const technologies =
        card.querySelector(
          ".project-technologies"
        )?.value.trim();


      const description =
        card.querySelector(
          ".project-description"
        )?.value.trim();


      const link =
        card.querySelector(
          ".project-link"
        )?.value.trim();


      if (
        !name &&
        !technologies &&
        !description &&
        !link
      ) {
        return;
      }


      const item =
        document.createElement("div");

      item.className =
        "preview-project";


      const title =
        document.createElement("div");

      title.className =
        "preview-project-title";

      title.textContent =
        name;


      const tech =
        document.createElement("div");

      tech.className =
        "preview-project-tech";

      tech.textContent =
        technologies;


      const desc =
        document.createElement("div");

      desc.textContent =
        description;


      item.appendChild(title);


      if (technologies) {

        item.appendChild(tech);

      }


      if (description) {

        item.appendChild(desc);

      }


      if (link) {

        const linkElement =
          document.createElement("div");

        linkElement.textContent =
          link;

        item.appendChild(
          linkElement
        );

      }


      preview.appendChild(item);

    });


    toggleSection(
      "previewProjectsSection",
      cards.length > 0
    );

  }


  /* =======================================================
     CERTIFICATIONS PREVIEW
     ======================================================= */

  function updateCertifications() {

    const preview =
      document.getElementById(
        "previewCertificationsList"
      );


    if (!preview) {
      return;
    }


    preview.innerHTML = "";


    const cards =
      certificationFields.querySelectorAll(
        ".certification-card"
      );


    cards.forEach(function (card) {

      const name =
        card.querySelector(
          ".certification-name"
        )?.value.trim();


      const organization =
        card.querySelector(
          ".certification-organization"
        )?.value.trim();


      const date =
        card.querySelector(
          ".certification-date"
        )?.value.trim();


      if (
        !name &&
        !organization &&
        !date
      ) {
        return;
      }


      const item =
        document.createElement("div");

      item.className =
        "preview-certification";


      const title =
        document.createElement("strong");

      title.textContent =
        name;


      const meta =
        document.createElement("span");

      meta.textContent =
        [
          organization,
          date
        ]
          .filter(Boolean)
          .join(" | ");


      item.appendChild(title);


      if (meta.textContent) {

        item.appendChild(
          document.createTextNode(
            " — "
          )
        );

        item.appendChild(meta);

      }


      preview.appendChild(item);

    });


    toggleSection(
      "previewCertificationsSection",
      cards.length > 0
    );

  }


  /* =======================================================
     ACHIEVEMENTS PREVIEW
     ======================================================= */

  function updateAchievements() {

    const preview =
      document.getElementById(
        "previewAchievementsList"
      );


    const achievements =
      resumeBuilderForm.elements
        .achievements?.value
        ?.trim();


    if (!preview) {
      return;
    }


    if (!achievements) {

      preview.innerHTML = "";

      toggleSection(
        "previewAchievementsSection",
        false
      );

      return;

    }


    const lines =
      achievements
        .split("\n")
        .map(
          line => line.trim()
        )
        .filter(Boolean);


    preview.innerHTML = "";


    const ul =
      document.createElement("ul");


    lines.forEach(function (line) {

      const li =
        document.createElement("li");

      li.textContent =
        line;

      ul.appendChild(li);

    });


    preview.appendChild(ul);


    toggleSection(
      "previewAchievementsSection",
      true
    );

  }


  /* =======================================================
     SHOW / HIDE PREVIEW SECTION
     ======================================================= */

  function toggleSection(
    id,
    show
  ) {

    const element =
      document.getElementById(id);


    if (!element) {
      return;
    }


    element.style.display =
      show
        ? ""
        : "none";

  }


  /* =======================================================
     FORM INPUT LISTENER
     ======================================================= */

  resumeBuilderForm.addEventListener(
    "input",
    function () {

      updateResumePreview();

    }
  );


  /* =======================================================
     PRINT / SAVE PDF
     ======================================================= */

  const printResumeBtn =
    document.getElementById(
      "printResumeBtn"
    );


  if (printResumeBtn) {

    printResumeBtn.addEventListener(
      "click",
      function () {

        const resume =
          document.getElementById(
            "printableResume"
          );


        if (!resume) {
          return;
        }


        const printWindow =
          window.open(
            "",
            "_blank"
          );


        if (!printWindow) {

          alert(
            "Please allow pop-ups to print your resume."
          );

          return;

        }


        printWindow.document.write(`

          <!DOCTYPE html>

          <html>

          <head>

            <title>Resume</title>

            <style>

              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 30px;
                color: #222;
                background: #fff;
              }

              .printable-resume-container {
                max-width: 800px;
                margin: auto;
              }

              .res-header-block {
                text-align: center;
                margin-bottom: 25px;
              }

              .res-header-block h1 {
                margin-bottom: 8px;
              }

              .res-header-block p {
                margin: 4px 0;
              }

              .res-body-block {
                margin-top: 20px;
              }

              .res-body-block h3 {
                border-bottom: 1px solid #333;
                padding-bottom: 5px;
                margin-bottom: 10px;
              }

              .preview-skill-list {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
              }

              .preview-skill {
                border: 1px solid #555;
                padding: 4px 8px;
                border-radius: 3px;
              }

              .preview-project,
              .preview-experience,
              .preview-education,
              .preview-certification {
                margin-bottom: 12px;
              }

              .preview-project-title,
              .preview-item-title {
                font-weight: bold;
              }

              .preview-project-tech,
              .preview-item-meta {
                font-size: 12px;
                margin: 3px 0;
              }

              @media print {

                body {
                  padding: 0;
                }

              }

            </style>

          </head>

          <body>

            ${resume.outerHTML}

          </body>

          </html>

        `);


        printWindow.document.close();

        printWindow.focus();

        setTimeout(
          function () {

            printWindow.print();

            printWindow.close();

          },
          300
        );

      }
    );

  }


  /* =======================================================
     INITIAL PREVIEW
     ======================================================= */

  updateResumePreview();


});
/* =========================================================
   FEEDBACK BUTTON
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const feedbackBtn = document.getElementById("feedbackBtn");

    if (!feedbackBtn) {
        return;
    }

    feedbackBtn.addEventListener("click", function () {

        /* Remove old modal if somehow already exists */
        const oldModal = document.getElementById("feedbackModal");

        if (oldModal) {
            oldModal.remove();
        }

        /* Create modal */
        const modal = document.createElement("div");

        modal.id = "feedbackModal";

        modal.innerHTML = `
            <div class="feedback-overlay">

                <div class="feedback-modal">

                    <button
                        type="button"
                        class="feedback-close"
                        id="closeFeedback">
                        ×
                    </button>
<h2>Send Feedback</h2>

<p class="feedback-subtitle">
    💬 We'd love to hear your feedback!
</p>

<p class="feedback-info">
    Please rate your experience and tell us how we can improve CareerPilot AI.
</p>

                    <div class="feedback-rating">

                        <label>
                            How would you rate CareerPilot AI?
                        </label>

                        <div class="rating-buttons">

                            <button type="button" data-rating="1">1</button>
                            <button type="button" data-rating="2">2</button>
                            <button type="button" data-rating="3">3</button>
                            <button type="button" data-rating="4">4</button>
                            <button type="button" data-rating="5">5</button>

                        </div>

                    </div>

                    <div class="feedback-field">

                        <label for="feedbackMessage">
                            Your Feedback
                        </label>

                        <textarea
                            id="feedbackMessage"
                            placeholder="Tell us what you think..."
                            rows="5"></textarea>

                    </div>

                    <button
                        type="button"
                        class="primary-btn"
                        id="submitFeedback">
                        Submit Feedback
                    </button>

                    <!-- IMPORTANT: Initially EMPTY -->
                    <p
                        id="feedbackStatus"
                        class="feedback-status"></p>

                </div>

            </div>
        `;

        document.body.appendChild(modal);


        /* =====================================================
           ELEMENTS
           ===================================================== */

        const closeFeedback =
            modal.querySelector("#closeFeedback");

        const overlay =
            modal.querySelector(".feedback-overlay");

        const ratingButtons =
            modal.querySelectorAll("[data-rating]");

        const feedbackMessage =
            modal.querySelector("#feedbackMessage");

        const submitFeedback =
            modal.querySelector("#submitFeedback");

        const feedbackStatus =
            modal.querySelector("#feedbackStatus");

        let selectedRating = "";


        /* =====================================================
           CLOSE
           ===================================================== */

        closeFeedback.addEventListener("click", function () {
            modal.remove();
        });


        overlay.addEventListener("click", function (event) {

            if (event.target === overlay) {
                modal.remove();
            }

        });


        /* =====================================================
           RATING
           ===================================================== */

        ratingButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                ratingButtons.forEach(function (btn) {
                    btn.classList.remove("selected");
                });

                button.classList.add("selected");

                selectedRating =
                    button.getAttribute("data-rating");

            });

        });


        /* =====================================================
           SUBMIT FEEDBACK
           ===================================================== */

        submitFeedback.addEventListener("click", function () {

            const message =
                feedbackMessage.value.trim();


            /* Validation */

            if (!selectedRating) {

                feedbackStatus.textContent =
                    "Please select a rating.";

                feedbackStatus.className =
                    "feedback-status error";

                return;
            }


            if (!message) {

                feedbackStatus.textContent =
                    "Please enter your feedback.";

                feedbackStatus.className =
                    "feedback-status error";

                return;
            }


            /* =================================================
               SAVE FEEDBACK
               ================================================= */

            const feedback = {

                rating: Number(selectedRating),

                message: message,

                date: new Date().toISOString()

            };


            let feedbackList = [];

            try {

                feedbackList =
                    JSON.parse(
                        localStorage.getItem(
                            "careerPilotFeedback"
                        )
                    ) || [];

            } catch (error) {

                feedbackList = [];

            }


            feedbackList.push(feedback);


            localStorage.setItem(
                "careerPilotFeedback",
                JSON.stringify(feedbackList)
            );


            /* =================================================
               SUCCESS MESSAGE
               ================================================= */

            feedbackStatus.textContent =
                "✓ Thank you! Your feedback has been submitted.";

            feedbackStatus.className =
                "feedback-status success";


            /* Disable submit button */

            submitFeedback.disabled = true;


            /* Close after success */

            setTimeout(function () {
                modal.remove();
            }, 1800);

        });

    });

});

/* =========================================================
   JOB SEARCH - MINI PROJECT DEMO
   ========================================================= */

function showJobDemo(jobTitle) {

    alert(
        "CareerPilot AI - Demo Preview\n\n" +

        "Role: " + jobTitle + "\n\n" +

        "This is a demonstration of the Smart Job Matching feature.\n\n" +

        "The Major Project version will include:\n" +
        "• Real job matching\n" +
        "• Job application support\n" +
        "• Application tracking\n" +
        "• AI-powered mock interviews"
    );

}cd