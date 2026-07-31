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
const resumeStrength = document.getElementById("resumeStrength");
const suggestionList = document.getElementById("suggestionList");
const progressContainer = document.getElementById("progressContainer");

const progressBar = document.getElementById("progressBar");
const circle = document.getElementById("circle");
const score = document.getElementById("score");

// Card Show
resultCard.style.display = "block";

// Loading Message
resultText.innerHTML = `
<h2>⏳ Analyzing Resume...</h2>
<p>Please Wait...</p>
`;
progressContainer.style.display = "block";

progressBar.style.width = "0%";

let progress = 0;

const loading = setInterval(function(){

    progress += 5;

    progressBar.style.width = progress + "%";

    if(progress >= 100){

        clearInterval(loading);

    }

},100);

// 2 Second Delay
setTimeout(function () {
    progressContainer.style.display = "none";

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
    /* ==========================================
 ==========================================
 Step 56.3 - Circular ATS Meter
==========================================*/

const radius = 70;

const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;

const offset = circumference - (atsScore / 100) * circumference;

circle.style.strokeDashoffset = offset;
// Glow Animation

circle.classList.remove("glow");

setTimeout(function () {

    circle.classList.add("glow");

}, 100);

// ==========================================
// Step 56.5 - Animated Score Counter
// ==========================================

let currentScore = 0;

const counter = setInterval(function () {

    currentScore++;

    score.innerHTML = currentScore + "%";

    if (currentScore >= atsScore) {

        clearInterval(counter);

    }

}, 20);
// Circle Color

circle.style.stroke = color;

// Percentage Color

score.style.color = color;

    // Resume Strength

if (atsScore >= 90) {

    resumeStrength.innerHTML = "🟢 Excellent Resume";

    resumeStrength.style.color = "green";

}

else if (atsScore >= 80) {

    resumeStrength.innerHTML = "🟡 Good Resume";

    resumeStrength.style.color = "orange";

}

else {

    resumeStrength.innerHTML = "🔴 Needs Improvement";

    resumeStrength.style.color = "red";

}
/* ==========================================
   Step 55 - AI Suggestions
========================================== */

if (atsScore >= 90) {

    suggestionList.innerHTML = `
        <li>✅ Great Resume</li>
        <li>✅ Ready for Most Companies</li>
        <li>✅ Keep Updating Your Projects</li>
    `;

}

else if (atsScore >= 80) {

    suggestionList.innerHTML = `
        <li>📌 Add More Projects</li>
        <li>📌 Improve Resume Formatting</li>
        <li>📌 Add Certifications</li>
    `;

}

else {

    suggestionList.innerHTML = `
        <li>❌ Add More Skills</li>
        <li>❌ Improve Resume Summary</li>
        <li>❌ Add Strong Projects</li>
        <li>❌ Use Action Verbs</li>
    `;

}

}, 2000);
    



    /* ==========================================
       Step 50 - ATS Score Color
    ========================================== */




  

});
/* ==========================================
   Step 52 - Show Uploaded Resume File Name
========================================== */

// Resume Input Select
const resumeInput = document.getElementById("resume");

// Paragraph Select
const fileName = document.getElementById("fileName");

// File Select Event
resumeInput.addEventListener("change", function () {

    // Check File Selected
    if (resumeInput.files.length > 0) {

        // Show File Name
        fileName.innerHTML = "📄 " + resumeInput.files[0].name;

    }

    else{

        // Default Message
        fileName.innerHTML = "No Resume Selected";

    }

});
/* ==========================================
   Step 57.3 - Resume Preview
========================================== */

const previewContainer = document.getElementById("previewContainer");

const previewBox = document.getElementById("previewBox");

resumeInput.addEventListener("change", function () {

    if (resumeInput.files.length > 0) {

        const file = resumeInput.files[0];

        const fileURL = URL.createObjectURL(file);

        previewContainer.style.display = "block";

        previewBox.src = fileURL;

    }

    else{

        previewContainer.style.display = "none";

        previewBox.src = "";

    }

});
/* ==========================================
   Step 58.2 - Preview Controls
========================================== */

const zoomIn = document.getElementById("zoomIn");

const zoomOut = document.getElementById("zoomOut");

const closePreview = document.getElementById("closePreview");

let zoomLevel = 100;

// Zoom In
zoomIn.addEventListener("click", function () {

    zoomLevel += 10;

    previewBox.style.height = zoomLevel + "%";

});

// Zoom Out
zoomOut.addEventListener("click", function () {

    if (zoomLevel > 50) {

        zoomLevel -= 10;

        previewBox.style.height = zoomLevel + "%";

    }

});

// Close Preview
closePreview.addEventListener("click", function () {

    previewContainer.style.display = "none";

    previewBox.src = "";

});