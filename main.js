/* ============================================================
   MAIN.JS — E-commerce Product Page
   ============================================================ */

'use strict';

/* ── Data ─────────────────────────────────────────────────── */
const IMAGES = [
  {
    full: './images/image-product-1.jpg',
    thumb: './images/image-product-1-thumbnail.jpg',
  },
  {
    full: './images/image-product-2.jpg',
    thumb: './images/image-product-2-thumbnail.jpg',
  },
  {
    full: './images/image-product-3.jpg',
    thumb: './images/image-product-3-thumbnail.jpg',
  },
  {
    full: './images/image-product-4.jpg',
    thumb: './images/image-product-4-thumbnail.jpg',
  },
];

const PRICE = 125;

/* ── State ────────────────────────────────────────────────── */
let state = {
  activeIndex: 0,      // which image is showing in desktop gallery
  mobileIndex: 0,      // which image is shown in mobile carousel
  quantity: 0,         // stepper value
  cartCount: 0,        // items in cart
  cartOpen: false,
  lightboxOpen: false,
  lightboxIndex: 0,    // active image inside lightbox
  menuOpen: false,
};

/* ── DOM References ───────────────────────────────────────── */
// Gallery
const mainImg        = document.getElementById('main-img');
const galleryMainBtn = document.getElementById('gallery-main-btn');
const galleryThumbs  = document.querySelectorAll('.gallery__thumb');

// Mobile carousel
const mobileMainImg = document.getElementById('mobile-main-img');
const mobilePrev    = document.getElementById('mobile-prev');
const mobileNext    = document.getElementById('mobile-next');

// Stepper
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus  = document.getElementById('qty-plus');
const qtyCount = document.getElementById('qty-count');

// Add to cart
const addToCartBtn = document.getElementById('add-to-cart-btn');

// Cart
const cartBtn            = document.getElementById('cart-btn');
const cartDropdown       = document.getElementById('cart-dropdown');
const cartBadge          = document.getElementById('cart-badge');
const cartEmpty          = document.getElementById('cart-empty');
const cartFilled         = document.getElementById('cart-filled');
const cartQuantityDisplay = document.getElementById('cart-quantity-display');
const cartTotalDisplay   = document.getElementById('cart-total-display');
const cartDeleteBtn      = document.getElementById('cart-delete-btn');

// Lightbox
const lightbox          = document.getElementById('lightbox');
const lightboxBackdrop  = document.getElementById('lightbox-backdrop');
const lightboxClose     = document.getElementById('lightbox-close');
const lightboxMainImg   = document.getElementById('lightbox-main-img');
const lightboxPrev      = document.getElementById('lightbox-prev');
const lightboxNext      = document.getElementById('lightbox-next');
const lightboxThumbs    = document.querySelectorAll('.lightbox__thumb');

// Mobile menu
const hamburgerBtn  = document.getElementById('hamburger-btn');
const mobileNav     = document.getElementById('mobile-nav');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');

/* ── Helpers ──────────────────────────────────────────────── */
function setActiveGalleryThumb(index) {
  galleryThumbs.forEach((thumb, i) => {
    const active = i === index;
    thumb.classList.toggle('gallery__thumb--active', active);
    thumb.setAttribute('aria-pressed', String(active));
  });
}

function setActiveLightboxThumb(index) {
  lightboxThumbs.forEach((thumb, i) => {
    const active = i === index;
    thumb.classList.toggle('lightbox__thumb--active', active);
    thumb.setAttribute('aria-pressed', String(active));
  });
}

function updateMainImage(index) {
  mainImg.src = IMAGES[index].full;
  lightboxMainImg.src = IMAGES[index].full;
  setActiveGalleryThumb(index);
  state.activeIndex = index;
  state.lightboxIndex = index;
}

function updateMobileImage(index) {
  mobileMainImg.src = IMAGES[index].full;
  state.mobileIndex = index;
}

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

/* ── Desktop Gallery (thumbnail switching) ────────────────── */
galleryThumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const index = Number(thumb.dataset.index);
    updateMainImage(index);
  });
});

/* ── Mobile Carousel ──────────────────────────────────────── */
mobilePrev.addEventListener('click', () => {
  const newIndex = (state.mobileIndex - 1 + IMAGES.length) % IMAGES.length;
  updateMobileImage(newIndex);
});

mobileNext.addEventListener('click', () => {
  const newIndex = (state.mobileIndex + 1) % IMAGES.length;
  updateMobileImage(newIndex);
});

/* ── Lightbox ─────────────────────────────────────────────── */
function openLightbox() {
  // Only open lightbox on desktop (≥ 769px)
  if (window.innerWidth <= 768) return;

  // Sync lightbox to current gallery state
  state.lightboxIndex = state.activeIndex;
  lightboxMainImg.src = IMAGES[state.lightboxIndex].full;
  setActiveLightboxThumb(state.lightboxIndex);

  lightbox.hidden = false;
  lightboxBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  state.lightboxOpen = true;
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxBackdrop.hidden = true;
  document.body.style.overflow = '';
  state.lightboxOpen = false;
  galleryMainBtn.focus();
}

function navigateLightbox(direction) {
  state.lightboxIndex = (state.lightboxIndex + direction + IMAGES.length) % IMAGES.length;
  lightboxMainImg.src = IMAGES[state.lightboxIndex].full;
  setActiveLightboxThumb(state.lightboxIndex);
  // Also sync desktop gallery to match
  updateMainImage(state.lightboxIndex);
}

galleryMainBtn.addEventListener('click', openLightbox);
lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

lightboxThumbs.forEach((thumb) => {
  thumb.addEventListener('click', () => {
    const index = Number(thumb.dataset.index);
    state.lightboxIndex = index;
    lightboxMainImg.src = IMAGES[index].full;
    setActiveLightboxThumb(index);
    updateMainImage(index);
  });
});

/* ── Stepper ──────────────────────────────────────────────── */
qtyMinus.addEventListener('click', () => {
  if (state.quantity > 0) {
    state.quantity--;
    qtyCount.textContent = state.quantity;
  }
});

qtyPlus.addEventListener('click', () => {
  state.quantity++;
  qtyCount.textContent = state.quantity;
});

/* ── Add to Cart ──────────────────────────────────────────── */
function updateCartUI() {
  if (state.cartCount > 0) {
    // Show badge
    cartBadge.textContent = state.cartCount;
    cartBadge.hidden = false;
    // Show filled cart
    cartEmpty.hidden = true;
    cartFilled.hidden = false;
    cartQuantityDisplay.textContent = state.cartCount;
    cartTotalDisplay.textContent = formatPrice(PRICE * state.cartCount);
  } else {
    // Hide badge
    cartBadge.hidden = true;
    // Show empty cart
    cartEmpty.hidden = false;
    cartFilled.hidden = true;
  }
}

addToCartBtn.addEventListener('click', () => {
  if (state.quantity === 0) return; // nothing to add
  state.cartCount += state.quantity;
  state.quantity = 0;
  qtyCount.textContent = 0;
  updateCartUI();
});

/* ── Delete from Cart ─────────────────────────────────────── */
cartDeleteBtn.addEventListener('click', () => {
  state.cartCount = 0;
  updateCartUI();
});

/* ── Cart Dropdown Toggle ─────────────────────────────────── */
function openCart() {
  cartDropdown.hidden = false;
  state.cartOpen = true;
  cartBtn.setAttribute('aria-expanded', 'true');
}

function closeCart() {
  cartDropdown.hidden = true;
  state.cartOpen = false;
  cartBtn.setAttribute('aria-expanded', 'false');
}

cartBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  state.cartOpen ? closeCart() : openCart();
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
  if (state.cartOpen && !cartDropdown.contains(e.target)) {
    closeCart();
  }
});

/* ── Mobile Menu ──────────────────────────────────────────── */
function openMenu() {
  mobileNav.classList.add('is-open');
  mobileOverlay.classList.add('is-open');
  mobileNav.setAttribute('aria-hidden', 'false');
  mobileOverlay.setAttribute('aria-hidden', 'false');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  state.menuOpen = true;
  document.body.style.overflow = 'hidden';
  mobileNavClose.focus();
}

function closeMenu() {
  mobileNav.classList.remove('is-open');
  mobileOverlay.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  mobileOverlay.setAttribute('aria-hidden', 'true');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  state.menuOpen = false;
  document.body.style.overflow = '';
  hamburgerBtn.focus();
}

hamburgerBtn.addEventListener('click', openMenu);
mobileNavClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);

/* ── Keyboard handling ────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.lightboxOpen) closeLightbox();
    if (state.cartOpen) closeCart();
    if (state.menuOpen) closeMenu();
  }
  // Arrow navigation inside lightbox
  if (state.lightboxOpen) {
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  }
});

/* ── Initial render ───────────────────────────────────────── */
updateCartUI();
