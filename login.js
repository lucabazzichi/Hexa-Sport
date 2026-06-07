/* ========= Hexa Sport — login ========= */
(function () {
  "use strict";

  var REMEMBER = "hs_remember_email";

  /* prefill remembered email */
  try {
    var saved = localStorage.getItem(REMEMBER);
    if (saved) {
      document.getElementById("email").value = saved;
      document.getElementById("remember").checked = true;
    }
  } catch (e) {}

  /* show / hide password */
  var pw = document.getElementById("password");
  var toggle = document.getElementById("pwToggle");
  toggle.addEventListener("click", function () {
    var show = pw.type === "password";
    pw.type = show ? "text" : "password";
    toggle.classList.toggle("on", show);
    toggle.setAttribute("aria-label", show ? "Nascondi password" : "Mostra password");
  });

  /* submit */
  document.getElementById("login").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    try {
      if (document.getElementById("remember").checked) {
        localStorage.setItem(REMEMBER, document.getElementById("email").value.trim());
      } else {
        localStorage.removeItem(REMEMBER);
      }
    } catch (e2) {}
    document.getElementById("form-msg").classList.add("show");
    form.querySelector('button[type="submit"]').textContent = "Accesso effettuato ✓";
  });

  /* ============= TWEAKS (shared engine — connesso al resto del sito) ============= */
  if (window.HSTweaks) {
    HSTweaks.init({
      defaults: (typeof TWEAK_DEFAULTS !== "undefined") ? TWEAK_DEFAULTS : {},
      controls: ["accent", "themeMode", "displayFont"]
    });
  }
})();
