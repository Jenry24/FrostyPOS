const cartKey = 'frostyOrder';   // for current order
const salesKey = 'frostySales';  // for completed sales

// ======== Cart Helpers ========
function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || '[]');
}
function saveCart(c) {
  localStorage.setItem(cartKey, JSON.stringify(c));
}

// ======== Modal Elements ========
const modal       = document.getElementById('productModal');
const modalImg    = document.getElementById('modalImg');
const modalName   = document.getElementById('modalName');
const modalPrice  = document.getElementById('modalPrice');
const modalQtyEl  = document.getElementById('modalQty');
const sizeOptions = document.getElementById('sizeOptions');
const closeModal  = document.getElementById('closeModal');
const addOrderBtn = document.getElementById('addOrder');
const goCheckout  = document.getElementById('goCheckout');

// Success modal
const successModal   = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const okSuccess      = document.getElementById('okSuccess');

let currentProduct = null;
let currentQty = 1;

// ======== Open Modal when card clicked (event delegation) ========
document.addEventListener("click", e => {
  if (e.target.closest('.card')) {
    const card = e.target.closest('.card');
    const name  = card.dataset.name;
    const img   = card.dataset.img;
    const price = card.dataset.price;
    const sizes = card.dataset.size || '';

    currentProduct = { name, img, price, sizes };
    currentQty = 1;
    modalQtyEl.textContent = currentQty;
    modalImg.src = img;
    modalName.textContent = name;

    sizeOptions.innerHTML = '';
    if (sizes) {
      const opts = sizes.split(',');
      opts.forEach((opt,i) => {
        const [label, p] = opt.split(':');
        const div = document.createElement('div');
        div.className = 'size-btn' + (i===0 ? ' active' : '');
        div.dataset.price = p;
        div.textContent = `${label} ₱${p}`;
        sizeOptions.appendChild(div);
      });
      modalPrice.textContent = '';
    } else {
      modalPrice.textContent = `₱${parseFloat(price).toFixed(2)}`;
    }

    modal.style.display = 'flex';
  }
});

// ======== Close Modal ========
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => {
  if (e.target === modal) modal.style.display = 'none';
  if (e.target === successModal) successModal.style.display = 'none';
};

// ======== Size Selection ========
sizeOptions.addEventListener('click', e => {
  if (e.target.classList.contains('size-btn')) {
    sizeOptions.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
  }
});

// ======== Quantity + / - ========
document.getElementById('minusQty').onclick = () => {
  if (currentQty > 1) {
    currentQty--;
    modalQtyEl.textContent = currentQty;
  }
};
document.getElementById('plusQty').onclick = () => {
  currentQty++;
  modalQtyEl.textContent = currentQty;
};

// ======== Add to Cart & Checkout ========
function addItemAnd(option) {
  if (!currentProduct) return;
  let price;

  if (currentProduct.sizes) {
    const activeBtn = sizeOptions.querySelector('.size-btn.active');
    price = parseFloat(activeBtn.dataset.price);
    currentProduct.size = activeBtn.textContent;
  } else {
    price = parseFloat(currentProduct.price);
  }

  const cart = getCart();
  cart.push({
    name: currentProduct.name + (currentProduct.size ? ` (${currentProduct.size})` : ''),
    img: currentProduct.img,
    price,
    qty: currentQty
  });
  saveCart(cart);

  if (option === 'checkout') {
    window.location.href = 'summary.html';
  } else {
    modal.style.display = 'none';
    showSuccess("✅ Added to order!");
  }
}

addOrderBtn.onclick = () => addItemAnd('add');
goCheckout.onclick = () => addItemAnd('checkout');

// ======== Success Modal Helper ========
function showSuccess(msg) {
  successMessage.textContent = msg;
  successModal.style.display = 'flex';
}

okSuccess.onclick = () => {
  successModal.style.display = 'none';
};
