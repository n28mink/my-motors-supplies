/* My motors Supplies — catálogo, filtros por marca, modal, carrito, checkout WhatsApp. */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const money = (n) => CONFIG.currency + n.toFixed(2);
  const CART_KEY = "mms_cart_v2";

  let state = { brand: "Todas", category: "Todos", query: "" };
  let cart = loadCart();
  let modalProduct = null, modalQty = 1;

  /* ── Config / WhatsApp ── */
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

  /* ── Filtros ── */
  function buildChips() {
    const bc = $("#brandChips"), cc = $("#catChips");
    bc.innerHTML = ""; cc.innerHTML = "";
    BRANDS.forEach((b) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (b === state.brand ? " active" : "");
      btn.textContent = b === "Todas" ? "Todas las marcas" : b;
      btn.onclick = () => { state.brand = b; buildChips(); render(); };
      bc.appendChild(btn);
    });
    CATEGORIES.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (c === state.category ? " active" : "");
      btn.textContent = c;
      btn.onclick = () => { state.category = c; buildChips(); render(); };
      cc.appendChild(btn);
    });
  }

  function filtered() {
    const q = state.query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const brandOk = state.brand === "Todas" || p.brand === state.brand || p.brand === "Universal";
      const catOk = state.category === "Todos" || p.category === state.category;
      const qOk = !q || [p.name, p.desc, p.fits, p.oem, p.category, p.brand].join(" ").toLowerCase().includes(q);
      return brandOk && catOk && qOk;
    });
  }

  function render() {
    const list = filtered();
    const grid = $("#grid");
    grid.classList.add("fading");
    setTimeout(() => {
      grid.innerHTML = "";
      list.forEach((p, i) => grid.appendChild(cardEl(p, i)));
      $("#empty").hidden = list.length > 0;
      $("#resultCount").innerHTML = list.length === PRODUCTS.length
        ? "Mostrando los <strong>" + list.length + "</strong> repuestos"
        : "<strong>" + list.length + "</strong> repuesto" + (list.length === 1 ? "" : "s") +
          (state.brand !== "Todas" ? " para <strong>" + state.brand + "</strong>" : "") +
          (state.category !== "Todos" ? " en <strong>" + state.category + "</strong>" : "");
      grid.classList.remove("fading");
    }, 160);
  }

  function cardEl(p, i) {
    const el = document.createElement("article");
    el.className = "card";
    el.style.animationDelay = Math.min(i * 40, 400) + "ms";
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

  /* ── Modal ── */
  function openModal(p) {
    modalProduct = p; modalQty = 1;
    $("#qtyVal").textContent = "1";
    const img = $("#modalImg");
    img.removeAttribute("src");
    img.src = p.img; img.alt = p.name;
    $("#modalBrand").textContent = p.brand;
    $("#modalName").textContent = p.name;
    $("#modalDesc").textContent = p.desc;
    $("#modalFits").textContent = p.fits;
    $("#modalOem").textContent = p.oem || "—";
    $("#modalCat").textContent = p.category;
    $("#modalPrice").textContent = money(p.price);
    $("#modalWa").href = waLink("Hola, me interesa este repuesto: " + p.name + " (" + money(p.price) + "). ¿Aplica a mi carro?");
    $("#modalWa").target = "_blank"; $("#modalWa").rel = "noopener";
    showOverlay($("#modalOverlay"));
  }
  function showOverlay(o) { o.hidden = false; document.body.style.overflow = "hidden"; }
  function hideOverlay(o) {
    o.classList.add("closing");
    setTimeout(() => { o.hidden = true; o.classList.remove("closing"); document.body.style.overflow = ""; }, 240);
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
    badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop");
    const p = PRODUCTS.find((x) => x.id === id);
    toast("Agregado: " + p.name);
  }

  function renderCart() {
    const n = cartQty();
    $("#cartCount").textContent = n;
    $("#cartHeadCount").textContent = n ? "(" + n + ")" : "";
    $("#cartTotal").textContent = money(cartTotal());
    const box = $("#cartItems");
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

  /* ── Marquee / contadores / reveals ── */
  function buildMarquee() {
    const brands = BRANDS.slice(1);
    const half = brands.map((b) => "<span>" + b + "</span>").join("");
    $("#marqueeTrack").innerHTML = half + half;
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
  function initReveals() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = (e.target.dataset.d || 0) + "ms";
          e.target.classList.add("in"); io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach((el, i) => { el.dataset.d = (i % 4) * 90; io.observe(el); });
  }

  /* ── Eventos ── */
  function initEvents() {
    $("#searchToggle").onclick = () => { const b = $("#searchBar"); b.hidden = !b.hidden; if (!b.hidden) $("#searchInput").focus(); };
    $("#searchClose").onclick = () => { $("#searchBar").hidden = true; $("#searchInput").value = ""; state.query = ""; render(); };
    $("#searchInput").addEventListener("input", (e) => { state.query = e.target.value; render(); });
    $("#emptyReset").onclick = () => {
      state = { brand: "Todas", category: "Todos", query: "" };
      $("#searchInput").value = ""; buildChips(); render();
    };
    $("#menuBtn").onclick = () => $("#nav").classList.toggle("open");
    $$("#nav a").forEach((a) => a.addEventListener("click", () => $("#nav").classList.remove("open")));

    $("#cartOpen").onclick = () => { renderCart(); showOverlay($("#cartOverlay")); };
    $("#cartClose").onclick = () => hideOverlay($("#cartOverlay"));
    $("#cartOverlay").addEventListener("click", (e) => { if (e.target === $("#cartOverlay")) hideOverlay($("#cartOverlay")); });
    $("#clearCart").onclick = () => { cart = {}; saveCart(); renderCart(); };
    $("#checkoutBtn").onclick = checkout;

    $("#modalClose").onclick = () => hideOverlay($("#modalOverlay"));
    $("#modalOverlay").addEventListener("click", (e) => { if (e.target === $("#modalOverlay")) hideOverlay($("#modalOverlay")); });
    $("#qtyMinus").onclick = () => { if (modalQty > 1) { modalQty--; $("#qtyVal").textContent = modalQty; } };
    $("#qtyPlus").onclick = () => { modalQty++; $("#qtyVal").textContent = modalQty; };
    $("#modalAdd").onclick = () => { if (modalProduct) { addToCart(modalProduct.id, modalQty); hideOverlay($("#modalOverlay")); } };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { ["#modalOverlay", "#cartOverlay"].forEach((s) => { if (!$(s).hidden) hideOverlay($(s)); }); }
    });
    window.addEventListener("scroll", () => $("#header").classList.toggle("scrolled", scrollY > 10), { passive: true });
  }

  /* ── Init ── */
  applyConfig();
  buildChips();
  buildMarquee();
  render();
  renderCart();
  initEvents();
  initReveals();
  initCounters();
})();
