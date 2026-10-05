// Página legal: menú móvil + enlaces de WhatsApp (sin carrito ni dependencias).
(function () {
  "use strict";
  var WA_NUMBER = "584128206458";
  function waLink(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text || "Hola, quiero cotizar un repuesto.");
  }
  document.querySelectorAll("[data-wa-link]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa-text") || null);
    a.target = "_blank";
    a.rel = "noopener";
  });
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }
})();
