/* My motors Supplies — lógica compartida: config, carrito, modal, WhatsApp, UI base. */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const money = (n) => CONFIG.currency + n.toFixed(2);
  const CART_KEY = "mms_cart_v2";

  let cart = loadCart();
  let modalProduct = null, modalQty = 1;

  /* ── WhatsApp ── */
  function waLink(text) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text || "Hola, quiero cotizar un repuesto.");
  }
  function applyConfig() {
    $$("[data-config='location']").forEach((el) => (el.textContent = CONFIG.location));
    $$("[data-config='hours']").forEach((el) => (el.textContent = CONFIG.hours));
    $$("[data-wa-link]").forEach((a) => {
      a.href = waLink(a.getAttribute("data-wa-text") || undefined);
      a.target = "_blank"; a.rel = "noopener";
    });
  }

  /* ── Overlays ── */
  function showOverlay(o) { o.hidden = false; document.body.style.overflow = "hidden"; }
  function hideOverlay(o) {
    o.classList.add("closing");
    setTimeout(() => { o.hidden = true; o.classList.remove("closing"); document.body.style.overflow = ""; }, 240);
  }

  /* ── Modal producto ── */
  function openModal(p) {
    modalProduct = p; modalQty = 1;
    $("#qtyVal").textContent = "1";
    const img = $("#modalImg");
    img.removeAttribute("src");
    img.src = p.img; img.alt = p.name;
    $("#modalBrand").textContent = p.brand;
    $("#modalName").textContent = p.name;
    $("#modalDesc").textContent = p.desc;
    const inc = $("#modalIncludes");
    if (p.includes && p.includes.length) {
      $("#modalIncludesList").innerHTML = p.includes.map((x) => "<li>" + x + "</li>").join("");
      inc.hidden = false;
    } else { inc.hidden = true; }
    $("#modalFits").textContent = p.fits;
    $("#modalOem").textContent = p.oem || "—";
    $("#modalCat").textContent = p.category;
    $("#modalPrice").textContent = money(p.price);
    $("#modalWa").href = waLink("Hola, me interesa este repuesto: " + p.name + " (" + money(p.price) + "). ¿Aplica a mi carro?");
    $("#modalWa").target = "_blank"; $("#modalWa").rel = "noopener";
    showOverlay($("#modalOverlay"));
  }

  /* ── Carrito ── */
  function loadCart() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch (e) { return {}; } }
  function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function cartQty() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function cartTotal() {
    return Object.entries(cart).reduce((sum, [id, q]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return p ? sum + p.price * q : sum;
    }, 0);
  }
  function addToCart(id, qty) {
    cart[id] = (cart[id] || 0) + qty;
    saveCart(); renderCart();
    const badge = $("#cartCount");
    if (badge) { badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop"); }
    const p = PRODUCTS.find((x) => x.id === id);
    toast("Agregado: " + p.name);
  }
  function renderCart() {
    const n = cartQty();
    const cc = $("#cartCount"); if (cc) cc.textContent = n;
    const hc = $("#cartHeadCount"); if (hc) hc.textContent = n ? "(" + n + ")" : "";
    const ct = $("#cartTotal"); if (ct) ct.textContent = money(cartTotal());
    const box = $("#cartItems"); if (!box) return;
    box.innerHTML = "";
    const ids = Object.keys(cart);
    if (!ids.length) {
      box.innerHTML = '<div class="cart-empty"><i class="ph ph-shopping-cart"></i><p>Tu carrito está vacío.<br>Agrega repuestos del catálogo.</p></div>';
      return;
    }
    ids.forEach((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return;
      const q = cart[id];
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML =
        '<img src="' + p.img + '" alt="' + p.name + '">' +
        '<div class="cart-item-info"><strong>' + p.name + "</strong><span>" + money(p.price) + " c/u</span>" +
          '<div class="qty"><button data-a="dec" aria-label="Menos"><i class="ph ph-minus"></i></button><span>' + q + '</span><button data-a="inc" aria-label="Más"><i class="ph ph-plus"></i></button></div>' +
        "</div>" +
        '<div class="cart-item-right"><strong>' + money(p.price * q) + '</strong><button class="cart-remove" aria-label="Quitar"><i class="ph ph-trash"></i></button></div>';
      el.querySelector('[data-a="dec"]').onclick = () => { cart[id]--; if (cart[id] <= 0) delete cart[id]; saveCart(); renderCart(); };
      el.querySelector('[data-a="inc"]').onclick = () => { cart[id]++; saveCart(); renderCart(); };
      el.querySelector(".cart-remove").onclick = () => { delete cart[id]; saveCart(); renderCart(); };
      box.appendChild(el);
    });
  }
  function checkout() {
    const ids = Object.keys(cart);
    if (!ids.length) { toast("El carrito está vacío"); return; }
    let msg = "Hola, quiero hacer un pedido en My motors Supplies:\n\n";
    ids.forEach((id, i) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (p) msg += (i + 1) + ". " + p.name + " (" + p.brand + ") x" + cart[id] + " — " + money(p.price * cart[id]) + "\n";
    });
    msg += "\nTotal estimado: " + money(cartTotal()) + "\n¿Confirmamos disponibilidad y envío?";
    window.open(waLink(msg), "_blank", "noopener");
  }
  function clearCart() { cart = {}; saveCart(); renderCart(); }

  /* ── Card de producto (reutilizable) ── */
  function productCard(p, i) {
    const el = document.createElement("article");
    el.className = "card";
    if (typeof i === "number") el.style.animationDelay = Math.min(i * 40, 400) + "ms";
    el.innerHTML =
      '<div class="card-media">' +
        (p.badge ? '<span class="card-badge">' + p.badge + "</span>" : "") +
        '<span class="card-brand">' + p.brand + "</span>" +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
      "</div>" +
      '<div class="card-body">' +
        '<span class="card-cat">' + p.category + "</span>" +
        "<h3>" + p.name + "</h3>" +
        '<p class="card-fits"><i class="ph ph-car"></i>Aplica a: ' + p.fits + "</p>" +
        '<div class="card-foot">' +
          '<p class="price">' + money(p.price) + " <small>USD</small></p>" +
          '<button class="add-btn"><i class="ph ph-plus"></i> Agregar</button>' +
        "</div>" +
      "</div>";
    el.querySelector(".card-media").onclick = () => openModal(p);
    el.querySelector("h3").onclick = () => openModal(p);
    el.querySelector(".add-btn").onclick = (e) => { e.stopPropagation(); addToCart(p.id, 1); };
    return el;
  }

  /* ── Toast ── */
  let toastTimer;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.innerHTML = '<i class="ph ph-check-circle"></i><span>' + msg + "</span>";
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ── UI base ── */
  function buildMarquee() {
    const track = $("#marqueeTrack"); if (!track) return;
    const brands = BRANDS.slice(1);
    const half = brands.map((b) => "<span>" + b + "</span>").join("");
    track.innerHTML = half + half;
  }
  function initCounters() {
    const els = $$("[data-count]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const target = +e.target.dataset.count, t0 = performance.now(), dur = 1400;
        (function tick(t) {
          const k = Math.min((t - t0) / dur, 1), v = Math.round(target * (1 - Math.pow(1 - k, 3)));
          e.target.textContent = v;
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }
  let revealIO = null;
  function initReveals() {
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = (e.target.dataset.d || 0) + "ms";
          e.target.classList.add("in"); revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    refreshReveals();
  }
  function refreshReveals() {
    if (!revealIO) return;
    $$(".reveal:not(.in)").forEach((el, i) => { el.dataset.d = (i % 4) * 60; revealIO.observe(el); });
  }
  function initChrome() {
    applyConfig(); buildMarquee(); renderCart(); initReveals(); initCounters();
    const mb = $("#menuBtn"); if (mb) mb.onclick = () => $("#nav").classList.toggle("open");
    $$("#nav a").forEach((a) => a.addEventListener("click", () => $("#nav").classList.remove("open")));
    const co = $("#cartOpen"); if (co) co.onclick = () => { renderCart(); showOverlay($("#cartOverlay")); };
    const cc = $("#cartClose"); if (cc) cc.onclick = () => hideOverlay($("#cartOverlay"));
    const col = $("#cartOverlay");
    if (col) col.addEventListener("click", (e) => { if (e.target === col) hideOverlay(col); });
    const clr = $("#clearCart"); if (clr) clr.onclick = clearCart;
    const ch = $("#checkoutBtn"); if (ch) ch.onclick = checkout;
    const mc = $("#modalClose"); if (mc) mc.onclick = () => hideOverlay($("#modalOverlay"));
    const mol = $("#modalOverlay");
    if (mol) mol.addEventListener("click", (e) => { if (e.target === mol) hideOverlay(mol); });
    const qm = $("#qtyMinus"); if (qm) qm.onclick = () => { if (modalQty > 1) { modalQty--; $("#qtyVal").textContent = modalQty; } };
    const qp = $("#qtyPlus"); if (qp) qp.onclick = () => { modalQty++; $("#qtyVal").textContent = modalQty; };
    const ma = $("#modalAdd"); if (ma) ma.onclick = () => { if (modalProduct) { addToCart(modalProduct.id, modalQty); hideOverlay($("#modalOverlay")); } };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") ["#modalOverlay", "#cartOverlay"].forEach((s) => { const o = $(s); if (o && !o.hidden) hideOverlay(o); });
    });
    window.addEventListener("scroll", () => { const h = $("#header"); if (h) h.classList.toggle("scrolled", scrollY > 10); }, { passive: true });
  }

  window.Store = { $, $$, money, waLink, openModal, addToCart, productCard, toast, initChrome, showOverlay, hideOverlay, refreshReveals };
  document.addEventListener("DOMContentLoaded", initChrome);
})();
