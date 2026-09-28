/* app.js — MobiWire: render, filtros, favoritos, carrito, modales, checkout */
/* Script clásico: usa los globales de data.js (CATEGORIES, PRODUCTS...) y cart.js (CartStore) */

const $ = (sel) => document.querySelector(sel);
const state = { query: '', categoryId: null, onlyOffers: false, onlyFav: false, sort: 'rel', expanded: false };
const FAV_KEY = 'mobiwire_fav_v1';
const favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]'));
const saveFavs = () => localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));

const els = {
  categoryList: $('#categoryList'), productList: $('#productList'),
  emptyState: $('#emptyState'), resultInfo: $('#resultInfo'),
  cartCount: $('#cartCount'), cartDrawerCount: $('#cartDrawerCount'),
  cartItems: $('#cartItems'), cartEmpty: $('#cartEmpty'),
  cartSubtotal: $('#cartSubtotal'), cartShipping: $('#cartShipping'),
  cartTotal: $('#cartTotal'), shipMsg: $('#shipMsg'),
  toast: $('#appToast'), toastMsg: $('#appToastMsg'),
  offerBadge: $('#offerBadge'), favCount: $('#favCount'),
  sortSelect: $('#sortSelect'), toggleCatalogBtn: $('#toggleCatalogBtn'),
};
const toast = new bootstrap.Toast(els.toast, { delay: 2300 });
const notify = (msg) => { els.toastMsg.textContent = msg; toast.show(); };
const prod = (id) => PRODUCTS.find((p) => p.id === id);
const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const FREE_SHIP = 500000, SHIP_COST = 12000;

/* Fallback de imágenes: si el archivo local falla, usa la URL web */
function imgWithFallback(el, local, web, alt) {
  el.src = local; el.alt = alt; el.loading = 'lazy';
  el.onerror = () => { el.onerror = null; el.src = web; };
}

/* ---------- Categorías con foto ---------- */
function renderCategories() {
  els.categoryList.innerHTML = '';
  CATEGORIES.forEach((cat) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cat-btn' + (state.categoryId === cat.id ? ' is-active' : '');
    b.setAttribute('role', 'listitem');
    b.setAttribute('aria-pressed', String(state.categoryId === cat.id));
    b.innerHTML = `<span class="cat-circle" style="border-top:4px solid ${cat.color}"></span><span>${cat.label}</span>`;
    const img = document.createElement('img');
    imgWithFallback(img, cat.img, cat.web, cat.label);
    b.querySelector('.cat-circle').appendChild(img);
    b.addEventListener('click', () => {
      state.categoryId = state.categoryId === cat.id ? null : cat.id;
      state.onlyFav = false; syncChips();
      renderCategories(); renderProducts();
    });
    els.categoryList.appendChild(b);
  });
}

/* ---------- Filtros + orden ---------- */
function filteredProducts() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter((p) => {
    const cat = !state.categoryId || p.categoryId === state.categoryId || p.tags.includes(state.categoryId);
    const off = !state.onlyOffers || (p.oldPrice && p.oldPrice > p.price);
    const fav = !state.onlyFav || favs.has(p.id);
    const hay = `${p.brand} ${p.name} ${p.storage} ${p.tags.join(' ')}`.toLowerCase();
    return cat && off && fav && (!q || hay.includes(q));
  });
  if (state.sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
  if (state.sort === 'rate') list = [...list].sort((a, b) => b.rating - a.rating);
  return list;
}

function productCard(p) {
  const off = discountPct(p);
  const art = document.createElement('article');
  art.className = 'product-card' + (off ? ' is-offer' : '');
  art.innerHTML = `
    <div class="product-thumb">${off ? `<span class="off-badge">-${off}%</span>` : ''}</div>
    <div>
      <span class="brand-badge brand-${p.brand}">${p.brand}</span>
      ${off ? '<span class="brand-badge" style="background:#F59E0B">Oferta</span>' : ''}
      <h3 class="product-name">${p.name}</h3>
      <p class="product-spec">${p.storage}</p>
      <p class="stars mb-0">${stars(p.rating)} <span class="text-muted">(${p.rating} · ${p.reviews})</span></p>
      <p class="mb-0">${p.oldPrice ? `<span class="product-old">${formatCOP(p.oldPrice)}</span> ` : ''}<span class="product-price">${formatCOP(p.price)}</span></p>
      <p class="product-stock ${p.lowStock ? 'is-low' : ''}"><i class="bi ${p.lowStock ? 'bi-exclamation-circle' : 'bi-check-circle'} me-1"></i>${p.stockLabel}</p>
    </div>
    <div class="card-actions">
      <button class="add-btn" type="button" aria-label="Agregar ${p.name} al carrito"><i class="bi bi-plus-lg"></i></button>
      <button class="ghost-btn" data-act="detail" type="button"><i class="bi bi-eye me-1"></i>Detalle</button>
      <button class="ghost-btn ${favs.has(p.id) ? 'is-fav' : ''}" data-act="fav" type="button" aria-pressed="${favs.has(p.id)}"><i class="bi bi-heart${favs.has(p.id) ? '-fill' : ''} me-1"></i>Fav</button>
    </div>`;
  const im = document.createElement('img');
  imgWithFallback(im, p.img, p.web, p.name);
  art.querySelector('.product-thumb').prepend(im);

  art.querySelector('.add-btn').addEventListener('click', () => { CartStore.add(p.id); renderCart(); notify(`${p.name} agregado`); });
  art.querySelector('[data-act="detail"]').addEventListener('click', () => openDetail(p.id));
  art.querySelector('[data-act="fav"]').addEventListener('click', (e) => {
    favs.has(p.id) ? favs.delete(p.id) : favs.add(p.id);
    saveFavs(); renderProducts();
    notify(favs.has(p.id) ? `${p.name} en favoritos` : `${p.name} fuera de favoritos`);
  });
  return art;
}

function renderProducts() {
  const list = filteredProducts();
  const visible = state.expanded ? list : list.slice(0, 4);
  els.productList.innerHTML = '';
  visible.forEach((p) => els.productList.appendChild(productCard(p)));
  els.emptyState.classList.toggle('d-none', list.length !== 0);
  els.offerBadge.classList.toggle('d-none', !state.onlyOffers);
  els.favCount.textContent = favs.size;
  els.resultInfo.textContent = list.length === 0 ? '' :
    `${list.length} resultado(s)` +
    (state.categoryId ? ` en "${CATEGORIES.find((c) => c.id === state.categoryId)?.label}"` : '') +
    (state.query ? ` para "${state.query}"` : '') +
    (state.onlyOffers ? ' · solo ofertas' : '') +
    (!state.expanded && list.length > 4 ? ' · mostrando 4 de ' + list.length : '');
  els.toggleCatalogBtn.textContent = state.expanded ? 'Ver menos' : `Ver Catálogo Completo (${list.length})`;
}

function syncChips() {
  $('#chipAll').classList.toggle('is-on', !state.onlyOffers && !state.onlyFav);
  $('#chipOffers').classList.toggle('is-on', state.onlyOffers);
  $('#chipFav').classList.toggle('is-on', state.onlyFav);
}

/* ---------- Carrito con envío ---------- */
function renderCart() {
  const entries = Object.entries(CartStore.items);
  els.cartCount.textContent = CartStore.count();
  els.cartDrawerCount.textContent = CartStore.count();
  els.cartEmpty.style.display = entries.length ? 'none' : 'block';
  els.cartItems.innerHTML = '';
  let subtotal = 0;
  entries.forEach(([id, qty]) => {
    const p = prod(id); if (!p) return;
    subtotal += p.price * qty;
    const li = document.createElement('li');
    li.className = 'd-flex gap-2 align-items-center';
    li.innerHTML = `
      <span class="cart-item-thumb"></span>
      <div class="flex-grow-1">
        <p class="mb-0 fw-semibold small">${p.name}</p>
        <p class="mb-0 text-muted small">${formatCOP(p.price)} c/u</p>
        <div class="d-flex align-items-center gap-2 mt-1">
          <button class="btn btn-outline-secondary qty-btn" data-act="dec" aria-label="Quitar uno">−</button>
          <span class="small fw-bold">${qty}</span>
          <button class="btn btn-outline-secondary qty-btn" data-act="inc" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <div class="text-end">
        <p class="mb-1 fw-bold small">${formatCOP(p.price * qty)}</p>
        <button class="btn btn-link btn-sm text-danger p-0" data-act="del">Quitar</button>
      </div>`;
    const im = document.createElement('img');
    imgWithFallback(im, p.img, p.web, p.name);
    li.querySelector('.cart-item-thumb').appendChild(im);
    li.querySelector('[data-act="inc"]').addEventListener('click', () => { CartStore.add(id); renderCart(); });
    li.querySelector('[data-act="dec"]').addEventListener('click', () => { CartStore.setQty(id, qty - 1); renderCart(); });
    li.querySelector('[data-act="del"]').addEventListener('click', () => { CartStore.remove(id); renderCart(); });
    els.cartItems.appendChild(li);
  });
  const ship = subtotal === 0 ? 0 : (subtotal >= FREE_SHIP ? 0 : SHIP_COST);
  els.cartSubtotal.textContent = formatCOP(subtotal);
  els.cartShipping.textContent = subtotal === 0 ? '—' : (ship === 0 ? 'GRATIS' : formatCOP(ship));
  els.cartTotal.textContent = formatCOP(subtotal + ship);
  els.shipMsg.textContent = subtotal >= FREE_SHIP ? '¡Tienes envío GRATIS!' : `Te faltan ${formatCOP(FREE_SHIP - subtotal)} para el envío gratis`;
}

/* ---------- Modal detalle ---------- */
let detailId = null, detailQty = 1;
const detailModal = () => bootstrap.Modal.getOrCreateInstance($('#productModal'));
function openDetail(id) {
  const p = prod(id); if (!p) return;
  detailId = id; detailQty = 1;
  $('#mQty').textContent = '1';
  imgWithFallback($('#mImg'), p.img, p.web, p.name);
  $('#mBrand').textContent = p.brand; $('#mBrand').className = `brand-badge brand-${p.brand}`;
  $('#productModalTitle').textContent = p.name; $('#mName').textContent = p.name;
  $('#mStars').textContent = `${stars(p.rating)} ${p.rating} (${p.reviews} opiniones)`;
  $('#mSpec').textContent = `${p.storage} · ${p.stockLabel}`;
  $('#mPrice').textContent = formatCOP(p.price);
  $('#mOld').textContent = p.oldPrice ? formatCOP(p.oldPrice) : '';
  $('#mStock').textContent = p.stockLabel;
  $('#mStock').style.color = p.lowStock ? '#EF4444' : '#10B981';
  detailModal().show();
}

/* ---------- Checkout funcional ---------- */
const checkoutModal = () => bootstrap.Modal.getOrCreateInstance($('#checkoutModal'));
function openCheckout() {
  if (CartStore.count() === 0) return notify('Tu carrito está vacío');
  $('#checkoutForm').classList.remove('d-none');
  $('#checkoutDone').classList.add('d-none');
  $('#checkoutFooter').classList.remove('d-none');
  $('#coError').textContent = '';
  const names = Object.entries(CartStore.items).map(([id, q]) => `${prod(id)?.name} x${q}`).join(', ');
  $('#coSummary').textContent = `${names} · Total ${els.cartTotal.textContent}`;
  checkoutModal().show();
}
function confirmOrder() {
  const name = $('#coName').value.trim(), email = $('#coEmail').value.trim(), addr = $('#coAddr').value.trim();
  if (name.length < 3) return ($('#coError').textContent = 'Ingresa tu nombre completo.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return ($('#coError').textContent = 'Ingresa un correo válido.');
  if (addr.length < 6) return ($('#coError').textContent = 'Ingresa una dirección válida.');
  $('#orderNum').textContent = 'MW-' + Math.floor(100000 + Math.random() * 900000);
  $('#checkoutForm').classList.add('d-none');
  $('#checkoutDone').classList.remove('d-none');
  $('#checkoutFooter').classList.add('d-none');
  CartStore.clear(); renderCart();
  notify('Pedido confirmado. ¡Gracias por comprar!');
}

/* ---------- Búsqueda / newsletter / varios ---------- */
function bindSearch(inputEl) {
  if (!inputEl) return;
  inputEl.addEventListener('input', (e) => {
    state.query = e.target.value;
    document.querySelectorAll('input[type="search"]').forEach((i) => { if (i !== e.target) i.value = e.target.value; });
    renderProducts();
  });
  inputEl.closest('form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#destacados')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function init() {
  imgWithFallback($('#heroImg'), HERO_IMG.local, HERO_IMG.web, 'Smartphones destacados MobiWire');
  renderCategories(); renderProducts(); renderCart(); syncChips();
  bindSearch($('#searchInputDesktop')); bindSearch($('#searchInputMobileNav')); bindSearch($('#searchInputPill'));

  $('#chipAll').addEventListener('click', () => { state.onlyOffers = false; state.onlyFav = false; syncChips(); renderProducts(); });
  $('#chipOffers').addEventListener('click', () => { state.onlyOffers = !state.onlyOffers; state.onlyFav = false; syncChips(); renderProducts(); });
  $('#chipFav').addEventListener('click', () => { state.onlyFav = !state.onlyFav; state.onlyOffers = false; syncChips(); renderProducts(); });
  els.sortSelect.addEventListener('change', (e) => { state.sort = e.target.value; renderProducts(); });
  els.toggleCatalogBtn.addEventListener('click', () => { state.expanded = !state.expanded; renderProducts(); });

  const setOffers = (on) => {
    state.onlyOffers = on; state.onlyFav = false; state.categoryId = null;
    syncChips(); renderCategories(); renderProducts();
    $('#destacados')?.scrollIntoView({ behavior: 'smooth' });
  };
  $('#heroOffersBtn').addEventListener('click', () => setOffers(true));

  const reset = () => {
    Object.assign(state, { query: '', categoryId: null, onlyOffers: false, onlyFav: false });
    document.querySelectorAll('input[type="search"]').forEach((i) => (i.value = ''));
    syncChips(); renderCategories(); renderProducts();
  };
  $('#clearFilterBtn').addEventListener('click', reset);
  $('#resetSearchBtn').addEventListener('click', reset);

  document.querySelectorAll('[data-filter-link]').forEach((a) => a.addEventListener('click', () => {
    state.query = a.dataset.filterLink.toLowerCase(); state.categoryId = null;
    state.onlyOffers = false; state.onlyFav = false; syncChips(); renderCategories(); renderProducts();
  }));
  document.querySelectorAll('[data-info]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault(); notify(a.dataset.info);
  }));

  $('#clearCartBtn').addEventListener('click', () => { CartStore.clear(); renderCart(); notify('Carrito vaciado'); });
  $('#checkoutBtn').addEventListener('click', openCheckout);
  $('#confirmOrderBtn').addEventListener('click', confirmOrder);

  $('#mMinus').addEventListener('click', () => { detailQty = Math.max(1, detailQty - 1); $('#mQty').textContent = detailQty; });
  $('#mPlus').addEventListener('click', () => { const p = prod(detailId); detailQty = Math.min(p?.stock ?? 9, detailQty + 1); $('#mQty').textContent = detailQty; });
  $('#mAdd').addEventListener('click', () => {
    if (!detailId) return;
    CartStore.add(detailId, detailQty); renderCart(); detailModal().hide();
    notify(`${prod(detailId)?.name} x${detailQty} agregado`);
  });

  $('#newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsletterEmail'), fb = $('#newsletterFeedback'), v = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      fb.textContent = 'Ingresa un correo válido, ej: tu@email.com';
      email.classList.add('is-invalid'); email.focus(); return;
    }
    fb.textContent = ''; email.classList.remove('is-invalid');
    notify('¡Gracias por suscribirte! Revisa tu correo.');
    e.target.reset();
  });

  /* ---------- Navegación: cada item muestra lo que dice su nombre ---------- */
  const setActiveNav = (id) => {
    document.querySelectorAll('.navbar .nav-link').forEach((a) => {
      const on = a.id === id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const closeMenu = () => {
    const nav = $('#mainNav');
    if (nav && nav.classList.contains('show') && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  };
  const showPhones = (onlyOffers) => {
    Object.assign(state, { query: '', categoryId: null, onlyOffers, onlyFav: false });
    document.querySelectorAll('input[type="search"]').forEach((i) => (i.value = ''));
    syncChips(); renderCategories(); renderProducts();
    $('#destacados')?.scrollIntoView({ behavior: 'smooth' });
  };
  $('#navInicio').addEventListener('click', (e) => {
    e.preventDefault(); reset(); setActiveNav('navInicio'); closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('#navCelulares').addEventListener('click', (e) => {
    e.preventDefault(); setActiveNav('navCelulares'); closeMenu(); showPhones(false);
  });
  $('#navCategorias').addEventListener('click', (e) => {
    e.preventDefault(); setActiveNav('navCategorias'); closeMenu();
    $('#categorias')?.scrollIntoView({ behavior: 'smooth' });
  });
  $('#navOfertas').addEventListener('click', (e) => {
    e.preventDefault(); setActiveNav('navOfertas'); closeMenu(); showPhones(true);
  });

  $('#year').textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init);
