/* ============================================================
   HEXA SPORT — shared Tweaks engine
   Used by index.html (app.js) and registrazione.html (signup.js).
   State is connected across pages via localStorage ("hs_tweaks")
   and persisted to disk per-page via __edit_mode_set_keys.
   ============================================================ */
window.HSTweaks = (function () {
  "use strict";

  var STORE = "hs_tweaks";
  var T = {}, knownKeys = [], controls = [], onApplyCb = null;
  var liveAccent = null, liveDecor = null, panel = null;
  var mediaLight = window.matchMedia("(prefers-color-scheme: light)");

  // Functional accent: STABLE brand choices (drive buttons/links/focus/badges).
  var SWATCHES = [["#eda21f", "Ambra"], ["#4aa3f0", "Blu"], ["#35cf72", "Verde"], ["#9b8cf0", "Viola"], ["#ec5b4f", "Rosso"]];

  // Decorative-only palette: 6 curated, harmonised ambient-glow pairs.
  // Used ONLY for the faint background glow (no text sits on them → always legible).
  var DECOR_COMBOS = [
    ["#eda21f", "#4aa3f0"], // ambra + azzurro (caldo/freddo)
    ["#4aa3f0", "#9b8cf0"], // azzurro + viola
    ["#35cf72", "#2bb6c4"], // smeraldo + teal
    ["#9b8cf0", "#e06ec0"], // viola + magenta
    ["#f0a51f", "#ec5b6f"], // tramonto: ambra + rosa
    ["#2bd4c4", "#4a86f0"]  // ghiaccio: teal + azzurro
  ];

  var DEFS = {
    accent:        { label: "Accento (pulsanti, link, focus)", type: "color" },
    themeMode:     { label: "Tema", type: "seg", opts: [["auto", "Auto"], ["light", "Chiaro"], ["dark", "Scuro"]] },
    displayFont:   { label: "Font display", type: "seg", opts: [["Space Grotesk", "Grotesk"], ["Sora", "Sora"], ["Archivo", "Archivo"]] },
    heroLayout:    { label: "Layout hero", type: "seg", opts: [["split", "Split"], ["centered", "Centrato"]] },
    featuredPlan:  { label: "Piano in evidenza", type: "seg", opts: [["pro", "Pro"], ["enterprise", "Enterprise"]] },
    billingDefault:{ label: "Prezzi mostrati", type: "seg", opts: [["annual", "Annuale"], ["monthly", "Mensile"]] },
    headline:      { label: "Titolo hero", type: "text" }
  };

  /* ---------- color helpers ---------- */
  function lighten(hex, a) {
    var c = hex.replace("#", "");
    var r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
  function inkFor(hex) {
    var c = hex.replace("#", "");
    var r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
    return ((0.299 * r + 0.587 * g + 0.114 * b) / 255) > 0.6 ? "#0c0a02" : "#fff";
  }
  // remove now-unused HSL random generator (decor uses curated combos)

  /* ---------- state ---------- */
  function loadState(defaults) {
    T = Object.assign({}, defaults);
    knownKeys = Object.keys(defaults);
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || "{}");
      knownKeys.forEach(function (k) { if (k in saved) T[k] = saved[k]; });
    } catch (e) {}
  }
  function persist(edits) {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || "{}");
      Object.assign(saved, edits);
      localStorage.setItem(STORE, JSON.stringify(saved));
    } catch (e) {}
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: edits }, "*"); } catch (e) {}
  }

  // Decorative ambient glow now follows the chosen accent (stable, no randomisation).
  function resolveColors() {
    liveAccent = T.accent; // STABLE — drives buttons/links/focus AND the ambient glow
    liveDecor = [T.accent, "#4aa3f0"]; // accent-tinted glow + a fixed cool counter-glow
  }
  function effTheme() {
    if (T.themeMode === "light") return "light";
    if (T.themeMode === "dark") return "dark";
    return mediaLight.matches ? "light" : "dark";
  }
  function applyCore() {
    var r = document.documentElement;
    if ("themeMode" in T || r.hasAttribute("data-theme")) r.setAttribute("data-theme", effTheme());
    // functional accent (stable)
    if ("accent" in T && liveAccent) {
      r.style.setProperty("--accent", liveAccent);
      r.style.setProperty("--accent-soft", lighten(liveAccent, .14));
      r.style.setProperty("--accent-line", lighten(liveAccent, .4));
      r.style.setProperty("--accent-ink", inkFor(liveAccent));
    }
    // decorative ambient glow only (low opacity — never carries text)
    if (liveDecor) {
      r.style.setProperty("--decor-a", lighten(liveDecor[0], .14));
      r.style.setProperty("--decor-b", lighten(liveDecor[1], .09));
    }
    if ("displayFont" in T) r.style.setProperty("--display", '"' + T.displayFont + '", system-ui, sans-serif');
  }
  function applyAll() { applyCore(); if (onApplyCb) onApplyCb(T, liveAccent); }

  /* ---------- panel ---------- */
  function set(key, val) {
    T[key] = val;
    var edits = {}; edits[key] = val;
    // accent and decor-randomisation are now INDEPENDENT roles
    if (key === "accent") resolveColors();
    applyAll();
    syncUI();
    persist(edits);
  }

  function buildPanel() {
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "tweaks-panel";
    var html = '<div class="tw-head"><span>Tweaks</span><button id="tw-close" aria-label="Chiudi">✕</button></div><div class="tw-body">';
    controls.forEach(function (key) {
      var d = DEFS[key]; if (!d) return;
      if (d.type === "toggle") {
        html += '<div class="tw-sect" style="margin-bottom:9px;">&nbsp;</div>';
        html += '<div class="tw-row"><span class="tw-rl">' + d.label + '</span>'
             +  '<button class="tw-switch" data-toggle="' + key + '" role="switch"><span class="tw-knob2"></span></button></div>';
        return;
      }
      html += '<div class="tw-sect">' + d.label + '</div>';
      if (d.type === "color") {
        html += '<div class="tw-colors">' + SWATCHES.map(function (o) {
          return '<button class="tw-sw" data-acc="' + o[0] + '" title="' + o[1] + '"><span style="background:' + o[0] + '"></span></button>';
        }).join("") + '</div>';
      } else if (d.type === "seg") {
        html += '<div class="tw-seg">' + d.opts.map(function (o) {
          return '<button data-key="' + key + '" data-val="' + o[0] + '">' + o[1] + '</button>';
        }).join("") + '</div>';
      } else if (d.type === "text") {
        html += '<textarea class="tw-text" data-textkey="' + key + '" rows="3"></textarea>';
      }
    });
    html += '</div>';
    panel.innerHTML = html;
    document.body.appendChild(panel);

    panel.querySelector("#tw-close").addEventListener("click", function () {
      panel.classList.remove("open");
      try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
    });
    panel.querySelectorAll("[data-acc]").forEach(function (s) {
      s.addEventListener("click", function () { set("accent", s.dataset.acc); });
    });
    panel.querySelectorAll("[data-key]").forEach(function (b) {
      b.addEventListener("click", function () { set(b.dataset.key, b.dataset.val); });
    });
    panel.querySelectorAll("[data-toggle]").forEach(function (b) {
      b.addEventListener("click", function () { set(b.dataset.toggle, !T[b.dataset.toggle]); });
    });
    panel.querySelectorAll("[data-textkey]").forEach(function (ta) {
      ta.value = T[ta.dataset.textkey] || "";
      ta.addEventListener("input", function () { set(ta.dataset.textkey, ta.value); });
    });
    syncUI();
    return panel;
  }

  function syncUI() {
    if (!panel) return;
    panel.querySelectorAll("[data-key]").forEach(function (b) { b.classList.toggle("on", T[b.dataset.key] === b.dataset.val); });
    panel.querySelectorAll("[data-acc]").forEach(function (s) { s.classList.toggle("on", T.accent === s.dataset.acc); });
    panel.querySelectorAll("[data-toggle]").forEach(function (b) { b.classList.toggle("on", !!T[b.dataset.toggle]); });
    panel.querySelectorAll("[data-textkey]").forEach(function (ta) { if (document.activeElement !== ta) ta.value = T[ta.dataset.textkey] || ""; });
  }

  /* ---------- public init ---------- */
  function init(opts) {
    controls = opts.controls || [];
    onApplyCb = opts.onApply || null;
    loadState(opts.defaults || {});
    resolveColors();
    applyAll();

    // follow phone theme changes when in auto
    var onMedia = function () { if (T.themeMode === "auto" || !("themeMode" in T)) applyAll(); };
    if (mediaLight.addEventListener) mediaLight.addEventListener("change", onMedia);
    else if (mediaLight.addListener) mediaLight.addListener(onMedia);

    // cross-page / cross-tab connection
    window.addEventListener("storage", function (e) {
      if (e.key !== STORE) return;
      try {
        var saved = JSON.parse(e.newValue || "{}");
        knownKeys.forEach(function (k) { if (k in saved) T[k] = saved[k]; });
      } catch (err) {}
      resolveColors(); applyAll(); syncUI();
    });

    // host protocol — listener before announce
    window.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.type === "__activate_edit_mode") buildPanel().classList.add("open");
      else if (d.type === "__deactivate_edit_mode") { if (panel) panel.classList.remove("open"); }
    });
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
  }

  return { init: init, get: function () { return T; } };
})();
