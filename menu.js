const cartKey = 'frostyOrder';   // for current order
const salesKey = 'frostySales';  // for completed sales
const productsKey = 'products';  // for user-added products

// ======== Cart Helpers ========
function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || '[]');
}
function saveCart(c) {
  localStorage.setItem(cartKey, JSON.stringify(c));
}

// ======== Default Products ========
const defaultProducts = [
  // Kiddie Edition
  { name: "Sugar Cone", section: "Kiddie Edition", price: "20", sizes: "", img: "frosty.jpg" },
  { name: "Mini Rainbow Delight", section: "Kiddie Edition", price: "45", sizes: "", img: "frosty.jpg" },

  // Sundaes
  { name: "Chocolate Sundae", section: "Sundaes", price: "37", sizes: "", img: "frosty.jpg" },
  { name: "Caramel Sundae", section: "Sundaes", price: "37", sizes: "", img: "frosty.jpg" },
  { name: "Strawberry Sundae", section: "Sundaes", price: "37", sizes: "", img: "frosty.jpg" },

  // Floats
  { name: "Coke Float", section: "Floats", price: "", sizes: "12oz:39,16oz:49", img: "frosty.jpg" },
  { name: "Chuckie Float", section: "Floats", price: "", sizes: "12oz:49,16oz:59", img: "frosty.jpg" },
  { name: "Dutch Mill Float", section: "Floats", price: "", sizes: "12oz:49,16oz:59", img: "frosty.jpg" },

  // Premium
  { name: "Supreme Oreo", section: "Premium", price: "", sizes: "12oz:68,16oz:78", img: "frosty.jpg" },
  { name: "Kitkat Pro", section: "Premium", price: "", sizes: "12oz:68,16oz:78", img: "frosty.jpg" },
  { name: "Pepero Oreo", section: "Premium", price: "", sizes: "12oz:68,16oz:78", img: "frosty.jpg" },
  { name: "Choco Almond", section: "Premium", price: "", sizes: "12oz:68,16oz:78", img: "frosty.jpg" },
  { name: "Choco Stick", section: "Premium", price: "", sizes: "12oz:68,16oz:78", img: "frosty.jpg" },
  { name: "Rainbow Oreo", section: "Premium", price: "", sizes: "12oz:68,16oz:78", img: "frosty.jpg" },
  { name: "White Choco Chips", section: "Premium", price: "", sizes: "12oz:68,16oz:78", img: "frosty.jpg" },
  { name: "Cashew Caramel", section: "Premium", price: "", sizes: "12oz:68,16oz:78", img: "frosty.jpg" }
];

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

// ======== State ========
let currentProduct = null;
let currentQty = 1;

// ======== Open Modal when card clicked ========
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
  setTimeout(() => successModal.style.display = 'none', 1500);
}

// ======== Render Products (Default + LocalStorage) ========
function renderProducts() {
  const storedProducts = JSON.parse(localStorage.getItem(productsKey) || '[]');
  const allProducts = [...defaultProducts, ...storedProducts];

  const sections = {};
  allProducts.forEach(p => {
    if (!sections[p.section]) sections[p.section] = [];
    sections[p.section].push(p);
  });

  const main = document.querySelector("main");
  main.innerHTML = "";

  for (const [section, products] of Object.entries(sections)) {
    const h1 = document.createElement("h1");
    h1.textContent = section;
    main.appendChild(h1);

    const grid = document.createElement("div");
    grid.className = "grid";

    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "card";
      div.dataset.name = p.name;
      div.dataset.img = p.img;
      if (p.sizes) {
        div.dataset.size = p.sizes;
      } else {
        div.dataset.price = p.price;
      }

      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${
          p.sizes
            ? p.sizes.replace(/,/g, " / ").replace(/oz:/g, " oz ₱")
            : "₱" + parseFloat(p.price).toFixed(2)
        }</p>
      `;

      grid.appendChild(div);
    });

    main.appendChild(grid);
  }
}
function loadMenu() {
  const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");

  // Merge default + stored
  const combined = [...defaultProducts];

  storedProducts.forEach(p => {
    const exists = combined.some(dp => dp.name === p.name && dp.section === p.section);
    if (!exists) combined.push(p); // only add if unique
  });

  const sections = {
    "Kiddie Edition": document.getElementById("kiddie"),
    "Sundaes": document.getElementById("sundaes"),
    "Floats": document.getElementById("floats"),
    "Premium": document.getElementById("premium"),
  };

  // Clear existing
  Object.values(sections).forEach(div => div.innerHTML = "");

  // Render
  combined.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = p.name;
    card.dataset.img = p.img;
    if (p.sizes && p.sizes.includes(":")) {
      card.dataset.size = p.sizes;
    } else {
      card.dataset.price = p.sizes || p.price;
    }

    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${
        p.sizes && p.sizes.includes(":")
          ? p.sizes.replace(/,/g, " / ").replace(/oz:/g, " oz ₱")
          : "₱" + parseFloat(p.price || p.sizes).toFixed(2)
      }</p>
    `;

    card.addEventListener("click", () => openModal(card));

    if (sections[p.section]) {
      sections[p.section].appendChild(card);
    }
  });
}
document.addEventListener("DOMContentLoaded", renderProducts);
