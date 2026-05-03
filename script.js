const widget = document.getElementById("horoscopeWidget");
const signDisplay = document.getElementById("signDisplay");
const text = document.getElementById("text");
const date = document.getElementById("date");

const signBtn = document.getElementById("signBtn");
const signPopup = document.getElementById("signPopup");

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");

const fontBtn = document.getElementById("fontToggle");
const fontPanel = document.getElementById("fontOptions");

const copyBtn = document.getElementById("copyLinkBtn");

const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

/* ---------------- EMBED MODE ---------------- */
if (isEmbed) {
  const builder = document.querySelector(".builder-ui");
  const footer = document.querySelector(".footer-links");

  if (builder) builder.style.display = "none";
  if (footer) footer.style.display = "none";
}

/* ---------------- STATE ---------------- */
let state = {
  sign: params.get("sign") || localStorage.getItem("sign") || "aries",
  theme: params.get("theme") || localStorage.getItem("theme") || "pink",
  font: params.get("font") || localStorage.getItem("font") || "default"
};

/* ---------------- APPLY STATE ---------------- */
function applyState() {
  widget.className = `widget ${state.theme}`;
  widget.classList.add(`font-${state.font}`);

  signDisplay.textContent = state.sign;
}

/* ---------------- HOROSCOPE ---------------- */
async function loadHoroscope(sign) {
  text.textContent = "checking stars…";

  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v1/horoscope?zodiac=${sign}`,
      {
        headers: {
          "X-Api-Key": "blbTUv2CVt9YgApgn2mioA==nKrg5ySEuPnb5cPE"
        }
      }
    );

    const data = await res.json();

    text.textContent = data.horoscope;
    date.textContent = new Date().toLocaleDateString();

  } catch {
    text.textContent = "stars unavailable ✨";
  }
}

/* ---------------- SIGN ---------------- */
signBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  const isHidden = signPopup.classList.contains("hidden");

  // close others first (important for consistency)
  themeOptions.classList.add("hidden");
  fontPanel.classList.add("hidden");

  if (isHidden) {
    signPopup.classList.remove("hidden");
  } else {
    signPopup.classList.add("hidden");
  }
});

signPopup.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    state.sign = btn.dataset.sign;

    localStorage.setItem("sign", state.sign);

    applyState();
    loadHoroscope(state.sign);

    signPopup.classList.add("hidden");
  });
});

function highlightActiveSign() {
  signPopup.querySelectorAll("button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.sign === state.sign);
  });
}
/* ---------------- THEME ---------------- */
themeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  themeOptions.classList.toggle("hidden");
});

themeOptions.querySelectorAll(".theme-circle").forEach(circle => {
  circle.addEventListener("click", () => {
    state.theme = circle.dataset.theme;

    localStorage.setItem("theme", state.theme);

    applyState();
    themeOptions.classList.add("hidden");
  });
});

/* ---------------- FONT ---------------- */
fontBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fontPanel.classList.toggle("hidden");
});

fontPanel.querySelectorAll(".font-option").forEach(btn => {
  btn.addEventListener("click", () => {
    state.font = btn.dataset.font;

    localStorage.setItem("font", state.font);

    applyState();
    fontPanel.classList.add("hidden");
  });
});

/* ---------------- OUTSIDE CLICK ---------------- */
document.addEventListener("click", (e) => {
  if (!signBtn.contains(e.target) && !signPopup.contains(e.target)) {
    signPopup.classList.add("hidden");
  }

  if (!themeBtn.contains(e.target) && !themeOptions.contains(e.target)) {
    themeOptions.classList.add("hidden");
  }

  if (!fontBtn.contains(e.target) && !fontPanel.contains(e.target)) {
    fontPanel.classList.add("hidden");
  }
});

/* ---------------- COPY LINK (WEATHER STYLE) ---------------- */
function buildEmbedURL() {
  const base = window.location.origin + window.location.pathname;

  return `${base}?sign=${state.sign}&theme=${state.theme}&font=${state.font}&embed=true`;
}

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(buildEmbedURL());

  const msg = document.getElementById("copyMessage");
  if (msg) {
    msg.classList.remove("hidden");
    msg.classList.add("show");

    setTimeout(() => {
      msg.classList.remove("show");
      msg.classList.add("hidden");
    }, 2000);
  }
});

/* ---------------- INIT ---------------- */
applyState();
loadHoroscope(state.sign);
