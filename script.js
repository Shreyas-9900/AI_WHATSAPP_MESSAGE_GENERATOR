// ================================
// ✅ MODE HANDLING (Final Perfect UX)
// ================================

// If user selects ANY dropdown → clear custom textbox
document.getElementById("context").addEventListener("change", function () {
  document.getElementById("custom").value = "";
});

document.getElementById("tone").addEventListener("change", function () {
  document.getElementById("custom").value = "";
});


// If user types custom situation → reset dropdowns to SELECT
document.getElementById("custom").addEventListener("input", function () {

  if (this.value.trim() !== "") {

    // Reset both dropdowns
    document.getElementById("context").selectedIndex = 0;
    document.getElementById("tone").selectedIndex = 0;
  }
});


// ================================
// ✅ MAIN AI MESSAGE GENERATOR
// ================================

async function generateMessage() {

  let context = document.getElementById("context").value;
  let tone = document.getElementById("tone").value;
  let name = document.getElementById("name").value;
  let customText = document.getElementById("custom").value;

  let outputBox = document.getElementById("output");
  outputBox.value = "Generating... Please wait ⏳";

  let prompt = "";

  // ================================
  // ✅ MODE 2: Custom Situation
  // ================================
  if (customText.trim() !== "") {

    prompt = `
Write a WhatsApp message for this situation:

"${customText}"

Tone: ${tone}

Make it short, clear, and WhatsApp-friendly.
`;

  }

  // ================================
  // ✅ MODE 1: Dropdown Quick Context
  // ================================
  else {

    prompt = `
Write a WhatsApp message for:

Context: ${context}
Person/Details: ${name}
Tone: ${tone}

Keep it short, polite, and nice.
`;

  }

  // ================================
  // ✅ GEMINI API KEY
  // ================================
  const API_KEY = "AIzaSyCTAA3KEO8L-ZPRoWBhaaIVkEHyhKokLxM";

  try {

    // ================================
    // ✅ Gemini 2.5 Flash Model
    // ================================
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // ================================
    // ✅ Error Display
    // ================================
    if (data.error) {
      outputBox.value = "❌ API Error: " + data.error.message;
      return;
    }

    // ================================
    // ✅ Output Message
    // ================================
    outputBox.value = data.candidates[0].content.parts[0].text;

  } catch (err) {

    outputBox.value = "❌ Failed: " + err.message;

  }
}

// ================================
// ✅ COPY BUTTON FUNCTION
// ================================

function copyMessage() {
  let text = document.getElementById("output");

  text.select();
  document.execCommand("copy");

  alert("✅ Message copied! Paste it in WhatsApp 🎉");
}



// ================================
// ✅ WhatsApp Direct Share Feature
// ================================

function shareWhatsApp() {

  let msg = document.getElementById("output").value;

  // If output is empty
  if (msg.trim() === "") {
    alert("❌ Please generate a message first!");
    return;
  }

  // WhatsApp share link
  let whatsappURL = "https://wa.me/?text=" + encodeURIComponent(msg);

  // Open WhatsApp Web in new tab
  window.open(whatsappURL, "_blank");
}
