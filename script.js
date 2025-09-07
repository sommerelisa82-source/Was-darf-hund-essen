const API_KEY = "AIzaSyAfSKpvxCzadP_-yxtsrMzt92ZGjV3a8eM";

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("image-input").files[0];
  if (!file) return;

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "Analysiere...";

  try {
    const base64 = await fileToBase64(file);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Decide if the pictured food is safe for dogs to eat. Answer in German with a short explanation.",
                },
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64,
                  },
                },
              ],
            },
          ],
        }),
      },
    );
    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "Keine Antwort";
    resultDiv.textContent = text;
  } catch (err) {
    console.error(err);
    resultDiv.textContent = "Fehler bei der Analyse.";
  }
});
