const widget = document.getElementById("widget");
const signDisplay = document.getElementById("signDisplay");
const text = document.getElementById("text");
const date = document.getElementById("date");

const signBtn = document.getElementById("signBtn");
const signPanel = document.getElementById("signPanel");

const themeBtn = document.getElementById("themeBtn");
const themePanel = document.getElementById("themePanel");

const copyBtn = document.getElementById("copyBtn");

let state = {
  sign: localStorage.getItem("sign") || "aries",
  theme: localStorage.getItem("theme") || "#ffdbe7"
};

function applyState() {
  widget.style.background = state.theme;
  signDisplay.textContent = state.sign;
}

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

/* SIGN UI */
signBtn.addEventListener("click", () => {
  signPanel.classList.toggle("hidden");
});

signPanel.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    state.sign = btn.dataset.sign;
    localStorage.setItem("sign", state.sign);

    applyState();
    loadHoroscope(state.sign);

    signPanel.classList.add("hidden");
  });
});

/* THEME UI */
themeBtn.addEventListener("click", () => {
  themePanel.classList.toggle("hidden");
});

themePanel.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    state.theme = btn.dataset.theme;
    localStorage.setItem("theme", state.theme);

    applyState();
    themePanel.classList.add("hidden");
  });
});

/* CLOSE ON OUTSIDE CLICK */
document.addEventListener("click", (e) => {
  if (!signBtn.contains(e.target) && !signPanel.contains(e.target)) {
    signPanel.classList.add("hidden");
  }

  if (!themeBtn.contains(e.target) && !themePanel.contains(e.target)) {
    themePanel.classList.add("hidden");
  }
});

/* COPY LINK (foundation for embed system) */
copyBtn.addEventListener("click", () => {
  const url = `${window.location.origin}${window.location.pathname}?sign=${state.sign}&theme=${encodeURIComponent(state.theme)}&embed=true`;

  navigator.clipboard.writeText(url);

  showCopyMessage();
});

function showCopyMessage() {
  const message = document.getElementById("copyMessage");

  if (message) {
    message.classList.remove("hidden");
    message.classList.add("show");

    setTimeout(() => {
      message.classList.remove("show");
      message.classList.add("hidden");
    }, 2000);
  }
}

/* INIT */
applyState();
loadHoroscope(state.sign);
