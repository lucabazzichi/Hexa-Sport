/* ========= Hexa Sport — signup (pagina unica: piani sempre visibili, il form compare sotto) ========= */
(function () {
  "use strict";

  var CK = '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="rgba(53,207,114,.14)" stroke="rgba(53,207,114,.4)"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#35cf72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var OFF = '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)"/><path d="M7 7l6 6M13 7l-6 6" stroke="#6b7585" stroke-width="1.8" stroke-linecap="round"/></svg>';
  document.querySelectorAll(".pos-ck").forEach(function (e) { e.innerHTML = CK; });
  document.querySelectorAll(".off-ck").forEach(function (e) { e.innerHTML = OFF; });

  var NAMES = { free: "Free", pro: "Pro", enterprise: "Enterprise" };
  var selectedPlan = null;
  var period = "annual";

  var planSection = document.getElementById("planSection");
  var accountSection = document.getElementById("accountSection");

  /* ---------- billing toggle ---------- */
  var regToggle = document.getElementById("reg-billing");
  var regKnob = document.getElementById("reg-knob");
  function applyRegBilling(p) {
    period = p;
    regToggle.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.period === p); });
    var active = regToggle.querySelector('button[data-period="' + p + '"]');
    if (active) { regKnob.style.width = active.offsetWidth + "px"; regKnob.style.transform = "translateX(" + (active.offsetLeft - 5) + "px)"; }
    document.querySelectorAll("#reg-plans .plan[data-plan] .price").forEach(function (pr) {
      var v = pr.getAttribute("data-" + p); if (v) pr.innerHTML = v + "&nbsp;€";
    });
    document.querySelectorAll("#reg-plans .plan[data-plan]").forEach(function (plan) {
      var old = plan.querySelector(".price-old"), save = plan.querySelector(".price-save");
      if (p === "annual") {
        if (old && old.dataset.old) { old.innerHTML = old.dataset.old; old.style.visibility = "visible"; }
        if (save) { save.innerHTML = save.dataset.saveAnnual || ""; save.style.visibility = save.dataset.saveAnnual ? "visible" : "hidden"; }
      } else {
        if (old) { old.innerHTML = "&nbsp;"; old.style.visibility = "hidden"; }
        if (save) { save.innerHTML = "&nbsp;"; save.style.visibility = "hidden"; }
      }
    });
  }
  regToggle.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () { applyRegBilling(b.dataset.period); });
  });

  /* ---------- center featured (mobile carousel) ---------- */
  var regPlansEl = document.getElementById("reg-plans");
  function regCenterFeatured() {
    if (!regPlansEl || window.innerWidth > 940) return;
    var f = regPlansEl.querySelector(".plan.featured");
    if (!f) return;
    regPlansEl.scrollLeft = Math.max(0, f.offsetLeft - (regPlansEl.clientWidth - f.offsetWidth) / 2);
  }
  window.addEventListener("resize", function () {
    var on = regToggle.querySelector(".on"); if (on) applyRegBilling(on.dataset.period);
    regCenterFeatured();
  });

  /* ---------- center a specific plan card in the carousel ---------- */
  function centerPlanCard(key) {
    if (!regPlansEl || window.innerWidth > 940) return; // only in carousel (narrow) mode
    var card = regPlansEl.querySelector('.plan[data-plan="' + key + '"]');
    if (!card) return;
    var target = Math.max(0, card.offsetLeft - (regPlansEl.clientWidth - card.offsetWidth) / 2);
    regPlansEl.scrollTo({ left: target, behavior: "smooth" });
  }

  /* ---------- select plan → reveal form + scroll ---------- */
  function selectPlan(key, scroll) {
    selectedPlan = key;
    // highlight chosen card
    document.querySelectorAll("#reg-plans .plan[data-plan]").forEach(function (p) {
      p.classList.toggle("chosen", p.dataset.plan === key);
    });
    document.querySelectorAll("[data-select]").forEach(function (b) {
      var lbl = b.querySelector(".sel-label");
      var mine = b.dataset.select === key;
      if (lbl) lbl.textContent = mine ? "✓ Piano selezionato" : "Seleziona piano";
      b.classList.toggle("is-chosen", mine);
    });
    // labels in form
    document.getElementById("selPlanName").textContent = NAMES[key];
    document.getElementById("btn-plan-label").textContent = key === "free" ? "" : "· " + NAMES[key];
    // reveal
    accountSection.classList.add("revealed");
    accountSection.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () { accountSection.classList.add("show"); });
    if (scroll !== false) {
      // first slide the carousel to centre the chosen plan, then scroll down to the form
      centerPlanCard(key);
      var narrow = window.innerWidth <= 940;
      setTimeout(function () {
        var y = accountSection.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, narrow ? 340 : 0);
    }
  }
  document.querySelectorAll("[data-select]").forEach(function (btn) {
    btn.addEventListener("click", function () { selectPlan(btn.dataset.select, true); });
  });

  /* ---------- change plan → scroll back ---------- */
  document.getElementById("change-plan").addEventListener("click", function () {
    var y = planSection.getBoundingClientRect().top + window.scrollY - 12;
    window.scrollTo({ top: y, behavior: "smooth" });
  });

  /* ---------- role segmented ---------- */
  document.getElementById("role-seg").querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#role-seg button").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      document.getElementById("role").value = b.dataset.val;
    });
  });

  /* ---------- submit ---------- */
  document.getElementById("signup").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    document.getElementById("form-msg").classList.add("show");
    form.querySelector('button[type="submit"]').textContent = "Account creato ✓";
  });

  /* ---------- init ---------- */
  applyRegBilling("annual");
  setTimeout(regCenterFeatured, 80);
  var deep = (new URLSearchParams(location.search).get("plan") || "").toLowerCase();
  if (NAMES[deep]) selectPlan(deep, false);

  /* ============= TWEAKS (shared engine — connesso a index) ============= */
  if (window.HSTweaks) {
    HSTweaks.init({
      defaults: (typeof TWEAK_DEFAULTS !== "undefined") ? TWEAK_DEFAULTS : {},
      controls: ["accent", "themeMode", "displayFont"]
    });
  }
})();
