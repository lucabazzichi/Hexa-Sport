/* ========= Hexa Sport — landing interactions ========= */
(function () {
  "use strict";

  /* ---- inject check / cross icons in pricing ---- */
  var CK = '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="rgba(53,207,114,.14)" stroke="rgba(53,207,114,.4)"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#35cf72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var OFF = '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)"/><path d="M7 7l6 6M13 7l-6 6" stroke="#6b7585" stroke-width="1.8" stroke-linecap="round"/></svg>';
  document.querySelectorAll(".pos-ck").forEach(function (e) { e.innerHTML = CK; });
  document.querySelectorAll(".off-ck").forEach(function (e) { e.innerHTML = OFF; });

  /* ---- billing toggle ---- */
  var toggle = document.getElementById("billing-toggle");
  var knob = document.getElementById("toggle-knob");
  function applyBilling(period) {
    toggle.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.period === period); });
    var active = toggle.querySelector('button[data-period="' + period + '"]');
    if (active) {
      knob.style.width = active.offsetWidth + "px";
      knob.style.transform = "translateX(" + (active.offsetLeft - 5) + "px)";
    }
    document.querySelectorAll(".plan[data-plan] .price").forEach(function (p) {
      var v = p.getAttribute("data-" + period);
      if (v) p.innerHTML = v + "&nbsp;€";
    });
    document.querySelectorAll(".plan[data-plan]").forEach(function (plan) {
      var old = plan.querySelector(".price-old");
      var save = plan.querySelector(".price-save");
      if (period === "annual") {
        if (old && old.dataset.old) { old.innerHTML = old.dataset.old; old.style.visibility = "visible"; }
        if (save) { save.innerHTML = save.dataset.saveAnnual || ""; save.style.visibility = save.dataset.saveAnnual ? "visible" : "hidden"; }
      } else {
        if (old) { old.innerHTML = "&nbsp;"; old.style.visibility = "hidden"; }
        if (save) { save.innerHTML = "&nbsp;"; save.style.visibility = "hidden"; }
      }
    });
  }
  toggle.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () { applyBilling(b.dataset.period); });
  });

  /* ---- FAQ ---- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () { q.parentElement.classList.toggle("open"); });
  });

  /* ---- reveal on scroll (with directional slide-in from off-screen) ---- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // assign directions so content "spunta da fuori schermo"
  document.querySelectorAll(".feature:not(.flip) .feature-copy").forEach(function (e) { e.classList.add("reveal", "left"); });
  document.querySelectorAll(".feature:not(.flip) .feature-media").forEach(function (e) { e.classList.add("reveal", "right"); });
  document.querySelectorAll(".feature.flip .feature-copy").forEach(function (e) { e.classList.add("reveal", "right"); });
  document.querySelectorAll(".feature.flip .feature-media").forEach(function (e) { e.classList.add("reveal", "left"); });
  var orgKids = document.querySelectorAll("#societa .org-grid > div");
  if (orgKids[0]) orgKids[0].classList.add("reveal", "left");
  if (orgKids[1]) orgKids[1].classList.add("reveal", "right");

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- hero text shrinks & fades as you scroll down ---- */
  var heroCopy = document.querySelector(".hero-copy");
  var heroSection = document.querySelector(".hero");
  var ticking = false;
  function onHeroScroll() {
    ticking = false;
    if (prefersReduced || !heroCopy || !heroSection) return;
    var h = heroSection.offsetHeight || 600;
    var p = Math.min(Math.max((window.scrollY || window.pageYOffset || 0) / h, 0), 1);
    heroCopy.style.transform = "scale(" + (1 - p * 0.16) + ") translateY(" + (p * -10) + "px)";
    heroCopy.style.opacity = String(1 - p * 0.85);
  }
  if (!prefersReduced) {
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(onHeroScroll); ticking = true; }
    }, { passive: true });
    onHeroScroll();
  }

  /* ---- keep knob aligned on resize ---- */
  window.addEventListener("resize", function () {
    var on = document.querySelector("#billing-toggle .on");
    if (on) applyBilling(on.dataset.period);
    centerFeatured();
  });

  /* ---- center the featured plan in the mobile carousel ---- */
  var plansEl = document.getElementById("plans");
  function centerFeatured() {
    if (!plansEl || window.innerWidth > 940) return;
    var f = plansEl.querySelector(".plan.featured");
    if (!f) return;
    plansEl.scrollLeft = Math.max(0, f.offsetLeft - (plansEl.clientWidth - f.offsetWidth) / 2);
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById("navBurger");
  var menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    var closeMenu = function () { menu.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    window.addEventListener("resize", function () { if (window.innerWidth > 940) closeMenu(); });
  }

  /* ============= TWEAKS (shared engine) ============= */
  function onApply(T) {
    document.body.setAttribute("data-hero", T.heroLayout);
    document.querySelectorAll(".plan[data-plan]").forEach(function (p) {
      p.classList.toggle("featured", p.dataset.plan === T.featuredPlan);
    });
    applyBilling(T.billingDefault);
    var hl = document.getElementById("hl-headline");
    if (hl) {
      var HEADLINES = {
        punch:   "Allena sui dati,\nnon a sensazione.",
        memoria: "Smetti di allenare\na memoria.",
        numeri:  "La tua squadra,\nfinalmente in numeri."
      };
      var txt = HEADLINES[T.headlineVariant] || HEADLINES.memoria;
      hl.innerHTML = txt
        .replace(/</g, "&lt;")
        .replace(/\n/g, "<br>")
        .replace(/dati|memoria|numeri/i, '<span class="hl">$&</span>');
    }
  }

  HSTweaks.init({
    defaults: (typeof TWEAK_DEFAULTS !== "undefined") ? TWEAK_DEFAULTS : {},
    controls: ["accent", "themeMode", "displayFont", "heroLayout", "featuredPlan", "billingDefault", "headlineVariant"],
    onApply: onApply
  });

  setTimeout(centerFeatured, 80);
})();
