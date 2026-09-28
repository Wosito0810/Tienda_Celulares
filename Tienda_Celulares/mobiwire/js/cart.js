/* cart.js — Lógica del carrito con persistencia en localStorage */
const STORAGE_KEY = 'mobiwire_cart_v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? { 'iphone-15': 1, 'galaxy-s24': 1, 'redmi-note-13': 1 };
  } catch {
    return {};
  }
}

const CartStore = {
  items: load(), // { productId: qty }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  },
  add(id, qty = 1) {
    this.items[id] = (this.items[id] ?? 0) + qty;
    this.save();
  },
  setQty(id, qty) {
    if (qty <= 0) delete this.items[id];
    else this.items[id] = qty;
    this.save();
  },
  remove(id) {
    delete this.items[id];
    this.save();
  },
  clear() {
    this.items = {};
    this.save();
  },
  count() {
    return Object.values(this.items).reduce((a, b) => a + b, 0);
  },
};
