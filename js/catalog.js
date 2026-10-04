/* My motors Supplies — página de catálogo: filtros por marca/sección/buscador (vía URL). */
(function () {
  "use strict";
  const { $, productCard } = window.Store;

  const params = new URLSearchParams(location.search);
  let state = {
    brand: params.get("marca") || "Todas",
    category: params.get("cat") || "Todos",
    query: params.get("q") || "",
  };
  // Normaliza: si el parámetro no coincide exactamente, ignora.
  if (!BRANDS.includes(state.brand)) state.brand = "Todas";
  if (!CATEGORIES.includes(state.category)) state.category = "Todos";

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.brand !== "Todas") p.set("marca", state.brand);
    if (state.category !== "Todos") p.set("cat", state.category);
    if (state.query.trim()) p.set("q", state.query.trim());
    history.replaceState(null, "", "catalogo.html" + (p.toString() ? "?" + p.toString() : ""));
  }

  function buildChips() {
    const bc = $("#brandChips"), cc = $("#catChips");
    bc.innerHTML = ""; cc.innerHTML = "";
    BRANDS.forEach((b) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (b === state.brand ? " active" : "");
      btn.textContent = b === "Todas" ? "Todas las marcas" : b;
      btn.onclick = () => { state.brand = b; syncUrl(); buildChips(); render(); };
      bc.appendChild(btn);
    });
    CATEGORIES.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (c === state.category ? " active" : "");
      btn.textContent = c;
      btn.onclick = () => { state.category = c; syncUrl(); buildChips(); render(); };
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
      list.forEach((p, i) => grid.appendChild(productCard(p, i)));
      $("#empty").hidden = list.length > 0;
      const bits = [];
      if (state.brand !== "Todas") bits.push("para <strong>" + state.brand + "</strong>");
      if (state.category !== "Todos") bits.push("en <strong>" + state.category + "</strong>");
      if (state.query.trim()) bits.push('buscando "<strong>' + state.query.trim() + "</strong>");
      $("#resultCount").innerHTML = "<strong>" + list.length + "</strong> repuesto" + (list.length === 1 ? "" : "s") +
        (bits.length ? " " + bits.join(" ") : "");
      grid.classList.remove("fading");
    }, 160);
  }

  function reset() {
    state = { brand: "Todas", category: "Todos", query: "" };
    $("#searchInput").value = "";
    syncUrl(); buildChips(); render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#searchInput").value = state.query;
    buildChips();
    render();
    let t;
    $("#searchInput").addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => { state.query = e.target.value; syncUrl(); render(); }, 220);
    });
    $("#clearFilters").onclick = reset;
    $("#emptyReset").onclick = reset;
  });
})();
