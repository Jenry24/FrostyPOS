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
const modal      = document.getElementById('productModal');
const modalImg   = document.getElementById('modalImg');
const modalName  = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const modalQtyEl = document.getElementById('modalQty');
const sizeOptions= document.getElementById('sizeOptions');
const closeModal = document.getElementById('closeModal');
const addOrderBtn= document.getElementById('addOrder');
const goCheckout = document.getElementById('goCheckout');

let currentProduct = null;
let currentQty = 1;

// ======== Open Modal when a product card is clicked ========
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const name  = card.dataset.name;
    const img   = card.dataset.img;
    const price = card.dataset.price;       // single-size price if exists
    const sizes = card.dataset.size || '';  // e.g. "12oz:39,16oz:49"

    currentProduct = { name, img, price, sizes };
    currentQty = 1;
    modalQtyEl.textContent = currentQty;
    modalImg.src = img;
    modalName.textContent = name;

    // Build size buttons
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
      modalPrice.textContent = ''; // price comes from selection
    } else {
      modalPrice.textContent = `₱${parseFloat(price).toFixed(2)}`;
    }

    modal.style.display = 'flex';
  });
});

// ======== Close Modal ========
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

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
    alert('Added to order!');
  }
}

addOrderBtn.onclick = () => addItemAnd('add');
goCheckout.onclick = () => addItemAnd('checkout');
  