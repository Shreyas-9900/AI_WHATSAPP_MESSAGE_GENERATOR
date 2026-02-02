async function generateMessage() {

  let context = document.getElementById("context").value;
  let tone = document.getElementById("tone").value;
  let name = document.getElementById("name").value;
  let customText = document.getElementById("custom").value;

  let outputBox = document.getElementById("output");
  outputBox.value = "Generating... Please wait ⏳";

  let prompt = "";

  if (customText.trim() !== "") {
    prompt = `Write a WhatsApp message for this situation:
"${customText}"

Tone: ${tone}
Keep it short, WhatsApp-friendly and clear.`;
  } else {
    prompt = `Write a WhatsApp message for:

Context: ${context}
Person/Details: ${name}
Tone: ${tone}

Keep it short and nice.`;
  }

  const API_KEY = "AIzaSyDT_xKgNdXQLehwxcmmh45FE2iiBjzLh2g";

  try {

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    if (data.error) {
      outputBox.value = "❌ API Error: " + data.error.message;
      return;
    }

    outputBox.value = data.candidates[0].content.parts[0].text;

  } catch (err) {
    outputBox.value = "❌ Failed: " + err.message;
  }
}
