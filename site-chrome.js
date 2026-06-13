/* ============================================================
   Hexa Sport — shared site chrome (nav + footer)
   Injected into #site-header / #site-footer on content pages so
   navigation stays identical everywhere. Handles dropdowns,
   mobile menu and (for pages without their own) Tweaks init.
   ============================================================ */
(function () {
  "use strict";

  var ic = {
    stats: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>',
    price: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 12 22l-8-8V4h10z"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>',
    org: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/></svg>',
    guide: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M8 7h7M8 11h7"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7"/><path d="M12 17h.01"/></svg>',
    faq: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    about: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5"/><path d="M16 4.5a3 3 0 0 1 0 6M21 20c0-2.6-1.6-4.2-4-4.8"/></svg>'
  };
  var caret = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  var prodotto = [
    ["index.html#statistiche", "Statistiche", "Radar e schede giocatore", ic.stats],
    ["index.html#prezzi", "Prezzi", "Free, Pro e Società", ic.price],
    ["index.html#societa", "Per le società", "Più squadre, chiavi allenatore", ic.org]
  ];
  var risorse = [
    ["guida.html", "Guida rapida", "Inizia in tre passi", ic.guide],
    ["assistenza.html", "Centro assistenza", "Risposte e supporto", ic.help],
    ["assistenza.html#faq", "FAQ", "Domande frequenti", ic.faq],
    ["chi-siamo.html", "Chi siamo", "Il team dietro Hexa", ic.about]
  ];

  function dropItems(arr) {
    return arr.map(function (i) {
      return '<a href="' + i[0] + '"><span class="dico">' + i[3] + '</span><span><b>' + i[1] + '</b><span>' + i[2] + '</span></span></a>';
    }).join("");
  }

  var navHTML =
    '<header class="nav">' +
      '<div class="wrap nav-inner">' +
        '<a class="brand" href="index.html"><img src="assets/logo.png" alt="Hexa Sport" /><span>HEXA <span class="accent">SPORT</span></span></a>' +
        '<nav class="nav-links">' +
          '<div class="has-drop"><button class="nav-drop-btn" type="button">Prodotto ' + caret + '</button><div class="nav-drop">' + dropItems(prodotto) + '</div></div>' +
          '<div class="has-drop"><button class="nav-drop-btn" type="button">Risorse ' + caret + '</button><div class="nav-drop">' + dropItems(risorse) + '</div></div>' +
          '<a href="index.html#prezzi">Prezzi</a>' +
        '</nav>' +
        '<div class="nav-cta">' +
          '<a class="ghost-link" href="accedi.html">Accedi</a>' +
          '<a class="btn btn-primary" href="registrazione.html">Inizia gratis</a>' +
        '</div>' +
        '<button class="nav-burger" id="navBurger" aria-label="Apri menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div>' +
      '<div class="mobile-menu" id="mobileMenu">' +
        '<span class="mm-group">Prodotto</span>' +
        prodotto.map(function (i) { return '<a class="mm-sub" href="' + i[0] + '">' + i[1] + '</a>'; }).join("") +
        '<span class="mm-group">Risorse</span>' +
        risorse.map(function (i) { return '<a class="mm-sub" href="' + i[0] + '">' + i[1] + '</a>'; }).join("") +
        '<a class="mm-login" href="accedi.html">Accedi</a>' +
        '<a class="btn btn-primary btn-block" href="registrazione.html">Inizia gratis</a>' +
      '</div>' +
    '</header>';

  var footHTML =
    '<footer class="footer">' +
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          '<div>' +
            '<a class="brand" href="index.html"><img src="assets/logo.png" alt="Hexa Sport" /><span>HEXA <span class="accent">SPORT</span></span></a>' +
            '<p class="tag">Le statistiche del giocatore al centro. Costruito per chi vive la pista, non la segreteria.</p>' +
          '</div>' +
          '<div><h4>Prodotto</h4><ul>' +
            '<li><a href="index.html#statistiche">Statistiche</a></li>' +
            '<li><a href="index.html#prezzi">Prezzi</a></li>' +
            '<li><a href="index.html#societa">Per le società</a></li>' +
            '<li><a href="registrazione.html">Inizia gratis</a></li>' +
          '</ul></div>' +
          '<div><h4>Risorse</h4><ul>' +
            '<li><a href="guida.html">Guida rapida</a></li>' +
            '<li><a href="assistenza.html">Centro assistenza</a></li>' +
            '<li><a href="assistenza.html#faq">FAQ</a></li>' +
          '</ul></div>' +
          '<div><h4>Azienda</h4><ul>' +
            '<li><a href="chi-siamo.html">Chi siamo</a></li>' +
            '<li><a href="contatti.html">Contatti</a></li>' +
            '<li><a href="accedi.html">Accedi</a></li>' +
          '</ul></div>' +
          '<div><h4>Legale</h4><ul>' +
            '<li><a href="privacy.html">Privacy</a></li>' +
            '<li><a href="termini.html">Termini</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© 2026 Hexa Sport. Tutti i diritti riservati.</span>' +
          '<span>Fatto per allenatori e società dilettantistiche.</span>' +
        '</div>' +
      '</div>' +
    '</footer>';

  function mount() {
    var h = document.getElementById("site-header");
    var f = document.getElementById("site-footer");
    if (h) h.outerHTML = navHTML;
    if (f) f.outerHTML = footHTML;

    /* mobile menu */
    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("mobileMenu");
    if (burger && menu) {
      var close = function () { menu.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
      window.addEventListener("resize", function () { if (window.innerWidth > 940) close(); });
    }

    /* tweaks (only if the page didn't init them itself) */
    if (window.HSTweaks && !window.__hsTweaksInited) {
      window.__hsTweaksInited = true;
      window.HSTweaks.init({
        defaults: (typeof TWEAK_DEFAULTS !== "undefined") ? TWEAK_DEFAULTS : { accent: "#eda21f", themeMode: "auto", displayFont: "Space Grotesk" },
        controls: ["accent", "themeMode", "displayFont"]
      });
    }

    /* FAQ accordions (any page with .faq-q) */
    document.querySelectorAll(".faq-q").forEach(function (q) {
      q.addEventListener("click", function () { q.parentElement.classList.toggle("open"); });
    });

    /* doc table-of-contents scrollspy */
    var tocLinks = document.querySelectorAll(".doc-toc a[href^='#']");
    if (tocLinks.length) {
      var map = {};
      tocLinks.forEach(function (a) { var el = document.getElementById(a.getAttribute("href").slice(1)); if (el) map[el.id] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            tocLinks.forEach(function (a) { a.classList.remove("active"); });
            if (map[en.target.id]) map[en.target.id].classList.add("active");
          }
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      document.querySelectorAll(".doc-body section[id]").forEach(function (s) { spy.observe(s); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
