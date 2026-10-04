/* My motors Supplies — lógica de tienda: catálogo, modal, carrito, checkout WhatsApp. */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const money = (n) => CONFIG.currency + n.toFixed(2);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- WhatsApp links ---------- */
  const waLink = (text) =>
    "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  const genericMsg =
    "Hola " + CONFIG.storeName + ", quiero información sobre un repuesto.";
  ["navWhatsapp", "heroWhatsapp", "brandsWhatsapp", "footerWhatsapp"].forEach((id) => {
    const a = document.getElementById(id);
    if (a) a.href = waLink(genericMsg);
  });
  const emptyWa = $("#emptyWhatsapp");
  if (emptyWa) emptyWa.href = waLink(genericMsg);
  $("#footerLocation").textContent = CONFIG.location;
  $("#footerHours").textContent = CONFIG.hours;
  $("#footerCats").innerHTML = CATEGORIES.filter((c) => c !== "Todos")
    .map((c) => `<a href="#catalogo" data-cat="${c}">${c}</a>`).join("");

  /* ---------- Estado ---------- */
  let activeCat = "Todos";
  let query = "";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("mp_cart") || "[]"); } catch (e) { cart = []; }
  const saveCart = () => localStorage.setItem("mp_cart", JSON.stringify(cart));
  const cartQty = () => cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = () =>
    cart.reduce((s, i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);

  /* ---------- Catálogo ---------- */
  const grid = $("#grid"), pills = $("#catPills"), emptyState = $("#emptyState");

  pills.innerHTML = CATEGORIES.map((c) =>
    `<button class="pill${c === "Todos" ? " active" : ""}" role="tab" data-cat="${c}">${c}</button>`
  ).join("");

  pills.addEventListener("click", (e) => {
    const b = e.target.closest(".pill");
    if (!b) return;
    activeCat = b.dataset.cat;
    $$(".pill", pills).forEach((p) => p.classList.toggle("active", p === b));
    render();
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-cat]");
    if (!a || !pills.contains(a)) {
      const cat = a && a.dataset ? a.dataset.cat : null;
      if (cat && CATEGORIES.includes(cat)) {
        activeCat = cat;
        $$(".pill", pills).forEach((p) => p.classList.toggle("active", p.dataset.cat === cat));
        render();
      }
    }
  });

  $("#searchInput").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    render();
  });

  function filtered() {
    return PRODUCTS.filter((p) => {
      const okCat = activeCat === "Todos" || p.category === activeCat;
      const okQ = !query || (p.name + " " + p.category + " " + p.desc).toLowerCase().includes(query);
      return okCat && okQ;
    });
  }

  function render() {
    const list = filtered();
    emptyState.hidden = list.length > 0;
    grid.innerHTML = list.map((p) => `
      <article class="card reveal" data-id="${p.id}" tabindex="0" role="button" aria-label="Ver ${p.name}">
        <div class="card-media">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        </div>
        <div class="card-body">
          <p class="tag">${p.category}</p>
          <h3>${p.name}</h3>
          <div class="card-foot">
            <span class="price">${money(p.price)}</span>
            <button class="add-btn" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">
              <i class="ph ph-plus"></i><span>Agregar</span>
            </button>
          </div>
        </div>
      </article>`).join("");
    observeReveals();
  }

  grid.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) { e.stopPropagation(); addToCart(add.dataset.add, 1); return; }
    const card = e.target.closest(".card");
    if (card) openModal(card.dataset.id);
  });
  grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const card = e.target.closest(".card");
      if (card) openModal(card.dataset.id);
    }
  });

  /* ---------- Modal ---------- */
  const overlay = $("#overlay");
  let modalId = null, modalQty = 1;

  function openModal(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    modalId = id; modalQty = 1;
    $("#modalImg").src = p.img;
    $("#modalImg").alt = p.name;
    $("#modalCat").textContent = p.category;
    $("#modalName").textContent = p.name;
    $("#modalDesc").textContent = p.desc;
    $("#modalPrice").textContent = money(p.price);
    $("#qtyVal").textContent = "1";
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    $("#modalClose").focus();
  }
  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }
  $("#modalClose").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeCart(); } });
  $("#qtyMinus").addEventListener("click", () => {
    modalQty = Math.max(1, modalQty - 1);
    $("#qtyVal").textContent = modalQty;
  });
  $("#qtyPlus").addEventListener("click", () => {
    modalQty = Math.min(99, modalQty + 1);
    $("#qtyVal").textContent = modalQty;
  });
  $("#modalAdd").addEventListener("click", () => {
    addToCart(modalId, modalQty);
    closeModal();
  });

  /* ---------- Carrito ---------- */
  const cartEl = $("#cart"), scrim = $("#scrim");

  function addToCart(id, qty) {
    const line = cart.find((i) => i.id === id);
    if (line) line.qty = Math.min(99, line.qty + qty);
    else cart.push({ id, qty });
    saveCart(); renderCart();
    const p = PRODUCTS.find((x) => x.id === id);
    toast((p ? p.name : "Producto") + " agregado al pedido");
  }

  function renderCart() {
    const n = cartQty();
    const badge = $("#cartCount");
    badge.hidden = n === 0;
    badge.textContent = n;
    const box = $("#cartItems");
    if (!cart.length) {
      box.innerHTML = `<div class="cart-empty"><i class="ph ph-shopping-cart"></i><p>Tu pedido está vacío.<br>Agrega repuestos del catálogo.</p></div>`;
    } else {
      box.innerHTML = cart.map((i) => {
        const p = PRODUCTS.find((x) => x.id === i.id);
        if (!p) return "";
        return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <p class="muted">${money(p.price)} c/u</p>
            <div class="qty">
              <button data-dec="${p.id}" aria-label="Quitar uno"><i class="ph ph-minus"></i></button>
              <span>${i.qty}</span>
              <button data-inc="${p.id}" aria-label="Agregar uno"><i class="ph ph-plus"></i></button>
            </div>
          </div>
          <div class="cart-item-right">
            <strong>${money(p.price * i.qty)}</strong><br>
            <button class="remove" data-rem="${p.id}">Quitar</button>
          </div>
        </div>`;
      }).join("");
    }
    $("#cartTotal").textContent = money(cartTotal());
  }

  $("#cartItems").addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-rem]");
    if (inc) { cart.find((i) => i.id === inc.dataset.inc).qty++; }
    else if (dec) {
      const line = cart.find((i) => i.id === dec.dataset.dec);
      line.qty--;
      if (line.qty <= 0) cart = cart.filter((i) => i.id !== line.id);
    }
    else if (rem) { cart = cart.filter((i) => i.id !== rem.dataset.rem); }
    else return;
    saveCart(); renderCart();
  });

  function openCart() {
    renderCart();
    cartEl.hidden = false; scrim.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartEl.hidden = true; scrim.hidden = true;
    document.body.style.overflow = "";
  }
  $("#cartBtn").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);

  $("#checkoutBtn").addEventListener("click", () => {
    if (!cart.length) { toast("Agrega al menos un repuesto"); return; }
    const lines = cart.map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return `• ${i.qty}x ${p.name} — ${money(p.price * i.qty)}`;
    });
    const msg = `Hola ${CONFIG.storeName}, quiero pedir:\n\n${lines.join("\n")}\n\nTotal: ${money(cartTotal())}`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastT);
    toastT = setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => { t.hidden = true; }, 350);
    }, 2200);
  }

  /* ---------- Nav móvil ---------- */
  const navToggle = $("#navToggle"), navMobile = $("#navMobile");
  navToggle.addEventListener("click", () => {
    const open = navMobile.hidden;
    navMobile.hidden = !open;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.innerHTML = open ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
  });
  navMobile.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navMobile.hidden = true;
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.innerHTML = '<i class="ph ph-list"></i>';
    }
  });

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveals() {
    if (reduceMotion) {
      $$(".reveal").forEach((el) => el.classList.add("visible"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
    }
    $$(".reveal:not(.visible)").forEach((el) => io.observe(el));
  }

  render();
  renderCart();
  observeReveals();
})();
