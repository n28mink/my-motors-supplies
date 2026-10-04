/* My motors Supplies — homepage: kits, categorías, más vendidos, buscador. */
(function () {
  "use strict";
  const { $, money, productCard, addToCart, openModal, refreshReveals } = window.Store;

  const CAT_IMG = {
    "Frenos": "img/p04.jpg",
    "Motor": "img/p06.jpg",
    "Suspensión y Dirección": "img/p13.jpg",
    "Transmisión": "img/p18.jpg",
    "Sistema Eléctrico": "img/p21.jpg",
    "Refrigeración": "img/p26.jpg",
    "Combustible": "img/p29.jpg",
    "Carrocería e Iluminación": "img/p25.jpg",
    "Interior": "img/p34.jpg",
    "Cauchos y Rines": "img/p35.jpg",
    "Mantenimiento": "img/p38.jpg",
    "Accesorios": "img/p40.jpg",
  };

  function renderKits() {
    const kits = PRODUCTS.filter((p) => p.badge === "Kit");
    const grid = $("#kitsGrid");
    kits.forEach((p, i) => {
      const el = document.createElement("article");
      el.className = "kit-card reveal";
      el.innerHTML =
        '<div class="kit-media"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '<span class="card-badge">Kit · Todo en uno</span></div>' +
        '<div class="kit-body">' +
          '<span class="card-cat">' + p.category + " · " + p.brand + "</span>" +
          "<h3>" + p.name + "</h3>" +
          '<ul class="kit-includes">' + p.includes.map((x) => "<li><i class='ph ph-check'></i>" + x + "</li>").join("") + "</ul>" +
          '<div class="card-foot"><p class="price">' + money(p.price) + ' <small>USD</small></p>' +
          '<button class="add-btn"><i class="ph ph-plus"></i> Agregar</button></div>' +
        "</div>";
      el.querySelector(".kit-media").onclick = () => openModal(p);
      el.querySelector("h3").onclick = () => openModal(p);
      el.querySelector(".add-btn").onclick = (e) => { e.stopPropagation(); addToCart(p.id, 1); };
      grid.appendChild(el);
    });
  }

  function renderCats() {
    const grid = $("#catsGrid");
    CATEGORIES.filter((c) => c !== "Todos").forEach((c, idx) => {
      const n = PRODUCTS.filter((p) => p.category === c).length;
      const a = document.createElement("a");
      a.className = "cat-tile reveal";
      a.href = "catalogo.html?cat=" + encodeURIComponent(c);
      a.setAttribute("data-index", String(idx + 1).padStart(2, "0"));
      a.innerHTML =
        '<div class="cat-media"><img src="' + (CAT_IMG[c] || "img/hero.jpg") + '" alt="' + c + '" loading="lazy"></div>' +
        '<div class="cat-body"><h3>' + c + "</h3>" +
        '<span class="cat-link">' + n + (n === 1 ? " repuesto" : " repuestos") + ' <i class="ph ph-arrow-right"></i></span></div>';
      grid.appendChild(a);
    });
  }

  function renderFeatured() {
    const feats = PRODUCTS.filter((p) => p.badge === "Más vendido" || p.badge === "Kit");
    const row = $("#featuredRow");
    feats.forEach((p) => {
      const card = productCard(p);
      card.classList.add("scroll-card");
      row.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderKits();
    renderCats();
    renderFeatured();
    refreshReveals();
    const form = $("#homeSearch");
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $("#homeSearchInput").value.trim();
      location.href = "catalogo.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
  });
})();
