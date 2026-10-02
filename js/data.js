/* data.js — Fuente única de datos.
   Imágenes: copia local en ./assets/img (descargadas de Unsplash, licencia libre)
   + URL web de respaldo por si se mueve la carpeta. */

const WEB = {
  'iphone-15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
  'galaxy-s24': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
  'redmi-note-13': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
  'iphone-14': 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=600&q=80',
  'galaxy-a54': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
  'moto-g84': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'pixel-8': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80',
  'poco-x6': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80',
};

const HERO_IMG = {
  local: './assets/img/hero-phones.jpg',
  web: 'https://images.unsplash.com/photo-1533228100845-08145b01de14?auto=format&fit=crop&w=900&q=80',
};

const CATEGORIES = [
  { id: 'apple', label: 'Apple', img: './assets/img/iphone-15.jpg', web: WEB['iphone-15'], color: '#0f172a' },
  { id: 'samsung', label: 'Samsung', img: './assets/img/galaxy-s24.jpg', web: WEB['galaxy-s24'], color: '#1428a0' },
  { id: 'xiaomi', label: 'Xiaomi', img: './assets/img/redmi-note-13.jpg', web: WEB['redmi-note-13'], color: '#ff6900' },
  { id: 'gama-alta', label: 'Gama Alta', img: './assets/img/hero-phones.jpg', web: HERO_IMG.web, color: '#7c3aed' },
];

const PRODUCTS = [
  {
    id: 'iphone-15', brand: 'Apple', categoryId: 'apple', name: 'iPhone 15',
    price: 2999000, oldPrice: 3499000, stock: 8, stockLabel: 'En Stock (8 unidades)',
    rating: 4.8, reviews: 214, storage: '128 GB · 6.1" · 48 MP',
    img: './assets/img/iphone-15.jpg', web: WEB['iphone-15'],
    tags: ['gama-alta', 'apple', 'iphone', 'ios', 'oferta'],
  },
  {
    id: 'galaxy-s24', brand: 'Samsung', categoryId: 'samsung', name: 'Samsung Galaxy S24',
    price: 3299000, oldPrice: 3699000, stock: 5, stockLabel: 'Pocas Unidades (5 disponibles)',
    lowStock: true, rating: 4.9, reviews: 186, storage: '256 GB · 6.2" · 50 MP · IA',
    img: './assets/img/galaxy-s24.jpg', web: WEB['galaxy-s24'],
    tags: ['gama-alta', 'samsung', 'galaxy', 'android', 'oferta'],
  },
  {
    id: 'redmi-note-13', brand: 'Xiaomi', categoryId: 'xiaomi', name: 'Xiaomi Redmi Note 13',
    price: 999000, oldPrice: 1199000, stock: 15, stockLabel: 'En Stock (15 unidades)',
    rating: 4.6, reviews: 342, storage: '256 GB · 6.67" · 108 MP',
    img: './assets/img/redmi-note-13.jpg', web: WEB['redmi-note-13'],
    tags: ['xiaomi', 'redmi', 'android', 'oferta'],
  },
  {
    id: 'iphone-14', brand: 'Apple', categoryId: 'apple', name: 'iPhone 14',
    price: 2499000, oldPrice: null, stock: 12, stockLabel: 'En Stock (12 unidades)',
    rating: 4.7, reviews: 198, storage: '128 GB · 6.1" · 12 MP',
    img: './assets/img/iphone-14.jpg', web: WEB['iphone-14'],
    tags: ['apple', 'iphone', 'ios'],
  },
  {
    id: 'galaxy-a54', brand: 'Samsung', categoryId: 'samsung', name: 'Samsung Galaxy A54',
    price: 1499000, oldPrice: 1699000, stock: 20, stockLabel: 'En Stock (20 unidades)',
    rating: 4.5, reviews: 264, storage: '128 GB · 6.4" · 50 MP',
    img: './assets/img/galaxy-a54.jpg', web: WEB['galaxy-a54'],
    tags: ['samsung', 'galaxy', 'android', 'oferta'],
  },
  {
    id: 'moto-g84', brand: 'Motorola', categoryId: 'gama-alta', name: 'Motorola Moto G84',
    price: 1199000, oldPrice: null, stock: 10, stockLabel: 'En Stock (10 unidades)',
    rating: 4.4, reviews: 121, storage: '256 GB · 6.5" · 50 MP',
    img: './assets/img/moto-g84.jpg', web: WEB['moto-g84'],
    tags: ['motorola', 'moto', 'android', 'gama-alta'],
  },
  {
    id: 'pixel-8', brand: 'Google', categoryId: 'gama-alta', name: 'Google Pixel 8',
    price: 2899000, oldPrice: 3199000, stock: 7, stockLabel: 'En Stock (7 unidades)',
    rating: 4.8, reviews: 143, storage: '128 GB · 6.2" · 50 MP · Tensor G3',
    img: './assets/img/pixel-8.jpg', web: WEB['pixel-8'],
    tags: ['google', 'pixel', 'android', 'gama-alta', 'oferta'],
  },
  {
    id: 'poco-x6', brand: 'Xiaomi', categoryId: 'xiaomi', name: 'Xiaomi Poco X6 Pro',
    price: 1399000, oldPrice: null, stock: 18, stockLabel: 'En Stock (18 unidades)',
    rating: 4.6, reviews: 176, storage: '512 GB · 6.67" · 64 MP',
    img: './assets/img/poco-x6.jpg', web: WEB['poco-x6'],
    tags: ['xiaomi', 'poco', 'android'],
  },
];

const discountPct = (p) =>
  p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(value).replace('COP', '').trim();
