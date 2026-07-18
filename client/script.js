/* ==========================================
   Step 45 - CareerPilot AI JavaScript
========================================== */

console.log("CareerPilot AI Loaded Successfully");

/* ==========================================
   Step 46 - Get Started Button
========================================== */

const startButton = document.getElementById("startBtn");

const resumeSection = document.getElementById("resume-form");

startButton.addEventListener("click", function () {

    resumeSection.scrollIntoView({

        behavior: "smooth"

    });

});


/* ==========================================
   Step 47 - Resume Form Validation
========================================== */

const form = document.getElementById("resumeForm");

form.addEventListener("submit", function (event) {
      console.log("Form Submitted");

    // Form Reload होने से रोकेगा
    event.preventDefault();

    // Name
    const name = document.getElementById("fullname").value.trim();

    // Email
    const email = document.getElementById("email").value.trim();

    // Resume File
    const resume = document.getElementById("resume").files.length;

    // Name Validation
    if (name === "") {

        alert("Please Enter Your Name");

        return;

    }

    // Email Validation
    if (email === "") {

        alert("Please Enter Your Email");

        return;

    }

    // Resume Validation
    if (resume === 0) {

        alert("Please Upload Your Resume");

        return;

    }


    /* ==========================================
       
    ========================================== */

/* ==========================================
   Step 48 - Fake ATS Score
========================================== */

const atsScore = Math.floor(Math.random() * 21) + 80;


/* ==========================================
   Step 49 + Step 51
========================================== */

const resultCard = document.getElementById("resultCard");

const resultText = document.getElementById("resultText");

// Card Show
resultCard.style.display = "block";

// Loading Message
resultText.innerHTML = `
<h2>⏳ Analyzing Resume...</h2>
<p>Please Wait...</p>
`;

// 2 Second Delay
setTimeout(function () {

    let color = "";

    if (atsScore >= 90) {

        color = "green";

    }

    else if (atsScore >= 80) {

        color = "orange";

    }

    else {

        color = "red";

    }

    resultText.innerHTML = `
        <h3>✅ Resume Uploaded Successfully</h3>

        <h2 style="color:${color};">
        🎯 ATS Score : ${atsScore}%
        </h2>
    `;

}, 2000);
    



    /* ==========================================
       Step 50 - ATS Score Color
    ========================================== */

    let color = "";

    if (atsScore >= 90) {

        color = "green";

    }
    else if (atsScore >= 80) {

        color = "orange";

    }
    else {

        color = "red";

    }


  

});