const API_BASE = "https://gen.pollinations.ai";
const STORAGE_KEY = "pollinationsApiKey";

const keyInput = document.getElementById("apiKey");
const keyStatus = document.getElementById("keyStatus");

function getKey() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

function refreshKeyStatus() {
  const key = getKey();
  keyStatus.textContent = key
    ? "Nøgle gemt. Du kan generere billeder og videoer."
    : "Ingen nøgle gemt endnu.";
}

document.getElementById("saveKey").addEventListener("click", () => {
  const value = keyInput.value.trim();
  if (!value) return;
  localStorage.setItem(STORAGE_KEY, value);
  keyInput.value = "";
  refreshKeyStatus();
});

refreshKeyStatus();

function setStatus(container, message, kind) {
  let status = container.querySelector(".status");
  if (!status) {
    status = document.createElement("p");
    status.className = "status";
    container.appendChild(status);
  }
  status.className = "status" + (kind ? " " + kind : "");
  status.textContent = message;
  return status;
}

async function generateMedia({ prompt, kind, url, button, container, mediaTag, fileExt }) {
  const key = getKey();
  if (!key) {
    setStatus(container, "Indsæt og gem din gratis nøgle først (se trin 1).", "error");
    return;
  }
  if (!prompt.trim()) {
    setStatus(container, "Skriv en beskrivelse først.", "error");
    return;
  }

  container.innerHTML = "";
  setStatus(container, "Genererer " + kind + "…").innerHTML =
    '<span class="spinner"></span> Genererer ' + kind + "…";
  button.disabled = true;

  try {
    const response = await fetch(url, { headers: { Authorization: "Bearer " + key } });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        throw new Error(
          "For mange forespørgsler. Prøv igen om " + (retryAfter || "lidt") + " sekunder."
        );
      }
      if (response.status === 503) {
        throw new Error("Tjenesten er midlertidigt overbelastet. Prøv igen om lidt.");
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error("Nøglen blev afvist. Tjek at du har indsat den korrekt i trin 1.");
      }
      throw new Error("Noget gik galt (fejlkode " + response.status + ").");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    container.innerHTML = "";
    const media = document.createElement(mediaTag);
    media.src = objectUrl;
    if (mediaTag === "video") {
      media.controls = true;
      media.autoplay = true;
      media.loop = true;
    }
    container.appendChild(media);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = kind + "-" + Date.now() + "." + fileExt;
    link.className = "download-link";
    link.textContent = "Download " + kind;
    container.appendChild(link);
  } catch (err) {
    setStatus(container, err.message, "error");
  } finally {
    button.disabled = false;
  }
}

document.getElementById("genImage").addEventListener("click", () => {
  const prompt = document.getElementById("imagePrompt").value;
  const url =
    API_BASE + "/image/" + encodeURIComponent(prompt) + "?model=flux&width=1024&height=1024";
  generateMedia({
    prompt,
    kind: "billede",
    url,
    button: document.getElementById("genImage"),
    container: document.getElementById("imageOutput"),
    mediaTag: "img",
    fileExt: "jpg",
  });
});

document.getElementById("genVideo").addEventListener("click", () => {
  const prompt = document.getElementById("videoPrompt").value;
  const url =
    API_BASE + "/video/" + encodeURIComponent(prompt) + "?model=wan&width=1024&height=576&aspectRatio=16:9";
  generateMedia({
    prompt,
    kind: "video",
    url,
    button: document.getElementById("genVideo"),
    container: document.getElementById("videoOutput"),
    mediaTag: "video",
    fileExt: "mp4",
  });
});
