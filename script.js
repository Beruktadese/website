// -----------------------------
// script.js for Girls Human Hair (ETB demo checkout)
// -----------------------------

// Sample product data (uses Unsplash hair photos)
const products = [
  {id:1,title:'10" Brazilian Body Wave Bundle',price:4500,category:'bundles',length:10,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn8dndw2I9XSVt9rVuzs6G4Ed9-LDObyZomw&s',tags:['body wave']},
  {id:2,title:'12" Brazilian Body Wave Bundle',price:4900,category:'bundles',length:12,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj1huYhoGCLZSS457WBVOsBAqw7wsLeZSHZw&s',tags:['body wave']},
  {id:3,title:'14" Peruvian Straight Bundle',price:5900,category:'bundles',length:14,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf18BoMeBvHLA6MpNvyCJbYntIvu-uhVWUyg&s',tags:['straight']},
  {id:4,title:'16" Indian Wavy Wig',price:12900,category:'wig',length:16,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLqj8spVAp8NFufpOCCKtjmqCKCrjDktGjqg&s',tags:['wig','lace']},
  {id:5,title:'18" Lace Frontal (13x4)',price:8900,category:'frontal',length:18,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIHEqsGlbKpdpb5psQD7Z--UiO5vqpYKGkFg&s',tags:['frontal']},
  {id:6,title:'20" Closure 4x4',price:6900,category:'closure',length:20,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCKuZVB93kzAIQBKHcX7IXG09Eyxv9LKE_vw&s',tags:['closure']},
  {id:7,title:'14" Curly Wig - Luxury',price:14900,category:'wig',length:14,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT33pc6hlvCviGTn8h7Gs_s3dgnR-t0IN62Bw&s',tags:['curly']},
  {id:8,title:'18" Deep Wave Bundles (2pcs)',price:9900,category:'bundles',length:18,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_KjkYFjR3rfPWbKy6fa30P1OdCEEBx6fbyg&s',tags:['deep wave']},
  {id:9,title:'20" Straight Bundles (3pcs)',price:11900,category:'bundles',length:20,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaOoUtA-z2O-piB4X3MYsZo62ElGvZCxVoIQ&s',tags:['straight','3pcs']}
];

// currency formatter (ETB - show 'Br ' prefix)
const fmt = v => Number(v).toFixed(2);

// app state
let state = {
  products: products.slice(),
  cart: JSON.parse(localStorage.getItem('gh_cart') || '[]')
};

// DOM refs
const grid = document.getElementById('grid');
const countNum = document.getElementById('countNum');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const cartTotalCount = document.getElementById('cartTotalCount');
const emptyState = document.getElementById('emptyState');

// render products
function renderProducts(list){
  grid.innerHTML = '';
  if(list.length === 0){
    emptyState.style.display = 'block';
    document.getElementById('productCount').style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    document.getElementById('productCount').style.display = 'block';
  }
  countNum.textContent = list.length;

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" loading="lazy" />
      <h3>${p.title}</h3>
      <div class="tags">${p.category} • ${p.length} inch</div>
      <div class="price-row">
        <div class="price">Br ${fmt(p.price)}</div>
        <div>
          <button class="btn secondary" onclick="quickView(${p.id})">Quick view</button>
          <button class="btn primary" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// filters
document.getElementById('searchInput').addEventListener('input', e => applyFilters());
document.getElementById('categoryFilter').addEventListener('change', e => applyFilters());
document.getElementById('lengthFilter').addEventListener('change', e => applyFilters());
document.getElementById('sortSelect').addEventListener('change', e => applyFilters());
document.getElementById('clearFilters').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = 'all';
  document.getElementById('lengthFilter').value = 'all';
  document.getElementById('sortSelect').value = 'popular';
  applyFilters();
});
document.getElementById('shopNow').addEventListener('click', () => {
  window.scrollTo({ top: document.getElementById('grid').offsetTop - 40, behavior: 'smooth' });
});

function applyFilters(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  const len = document.getElementById('lengthFilter').value;
  const sort = document.getElementById('sortSelect').value;

  let list = products.filter(p => {
    const matchesQ = q ? (p.title.toLowerCase().includes(q) || (p.tags || []).join(' ').includes(q)) : true;
    const matchesCat = cat === 'all' ? true : p.category === cat;
    const matchesLen = len === 'all' ? true : String(p.length) === String(len);
    return matchesQ && matchesCat && matchesLen;
  });

  if(sort === 'price-asc') list.sort((a,b) => a.price - b.price);
  else if(sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  else if(sort === 'newest') list = list.slice().reverse();

  renderProducts(list);
}

// cart functions
function saveCart(){ localStorage.setItem('gh_cart', JSON.stringify(state.cart)); }

function addToCart(id, qty = 1){
  const p = products.find(x => x.id === id);
  if(!p){ alert('Product not found'); return; }
  const existing = state.cart.find(c => c.id === id);
  if(existing) existing.qty += qty; else state.cart.push({ id: p.id, title: p.title, price: p.price, image: p.image, qty });
  saveCart(); updateCartUI(); showCart();
}

function updateCartUI(){
  cartItems.innerHTML = '';
  let subtotal = 0; let totalCount = 0;
  state.cart.forEach(item => {
    subtotal += item.price * item.qty;
    totalCount += item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div style="flex:1">
        <div style="font-weight:700">${item.title}</div>
        <div class="muted">Br ${fmt(item.price)} each</div>
        <div class="qty" style="margin-top:.4rem">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <div style="padding:.25rem .5rem;border:1px solid rgba(0,0,0,0.06);border-radius:6px">${item.qty}</div>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button onclick="removeItem(${item.id})" style="margin-left:8px;border:none;background:transparent;color:var(--muted);cursor:pointer">Remove</button>
        </div>
      </div>
      <div style="font-weight:700">Br ${fmt(item.price * item.qty)}</div>
    `;
    cartItems.appendChild(row);
  });

  subtotalEl.textContent = fmt(subtotal);
  cartCount.textContent = totalCount;
  cartTotalCount.textContent = totalCount;
}

function changeQty(id, delta){
  const item = state.cart.find(c => c.id === id); if(!item) return;
  item.qty += delta; if(item.qty <= 0) state.cart = state.cart.filter(c => c.id !== id);
  saveCart(); updateCartUI();
}
function removeItem(id){ state.cart = state.cart.filter(c => c.id !== id); saveCart(); updateCartUI(); }
function clearCart(){ if(confirm('Clear the cart?')){ state.cart = []; saveCart(); updateCartUI(); } }
function showCart(){ cartPanel.style.display = 'flex'; }
function hideCart(){ cartPanel.style.display = 'none'; }

document.getElementById('openCartBtn').addEventListener('click', () => { showCart(); });
document.getElementById('closeCart').addEventListener('click', hideCart);
document.getElementById('clearCart').addEventListener('click', clearCart);

// quick view modal
function quickView(id){
  const p = products.find(x => x.id === id); if(!p) return;
  const modal = document.getElementById('modal'); const card = document.getElementById('modalCard');
  card.innerHTML = `
    <div style="display:flex;gap:1rem;flex-wrap:wrap">
      <div style="flex:1;min-width:240px"><img src="${p.image}" alt="${p.title}" style="width:100%;border-radius:8px" /></div>
      <div style="flex:1;min-width:240px">
        <h2 style="margin-top:0">${p.title}</h2>
        <div class="muted">${p.category} • ${p.length} inch</div>
        <div style="font-size:20px;font-weight:700;color:var(--gold);margin-top:.5rem">Br ${fmt(p.price)}</div>
        <p class="muted" style="margin-top:.6rem">High quality human hair. Soft, tangle-free and long-lasting with proper care.</p>
        <div style="display:flex;gap:.5rem;margin-top:1rem">
          <button class="btn primary" onclick="addToCart(${p.id},1)">Add to cart</button>
          <button class="btn secondary" onclick="openCheckoutForm()">Buy now</button>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('open');
  modal.onclick = (e) => { if(e.target === modal){ modal.classList.remove('open'); modal.onclick = null; } };
}

// Checkout form with Ethiopian payment methods (demo)
function openCheckoutForm(){
  const modal = document.getElementById('modal'); const card = document.getElementById('modalCard');
  modal.classList.add('open');

  // build the payment method radio list
  card.innerHTML = `
    <h2>Checkout (Demo)</h2>
    <form id="checkoutForm">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
        <input name="first" placeholder="First name" required />
        <input name="last" placeholder="Last name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="phone" placeholder="Phone" required />
      </div>

      <div style="margin-top:.5rem">
        <input name="address" placeholder="Shipping address" required style="width:100%" />
      </div>

      <div style="margin-top:1rem">
        <div style="font-weight:700;margin-bottom:.4rem">Choose payment method</div>
        <div>
          <label><input type="radio" name="payment" value="telebirr" required> Telebirr (mobile money)</label><br>
          <label><input type="radio" name="payment" value="cbe"> CBE Bank transfer</label><br>
          <label><input type="radio" name="payment" value="dashen"> Dashen Bank transfer</label><br>
          <label><input type="radio" name="payment" value="abyssinia"> Abyssinia Bank transfer</label><br>
          <label><input type="radio" name="payment" value="cod"> Cash on Delivery (COD)</label>
        </div>
      </div>

      <div id="paymentExtra" style="margin-top:.6rem" class="muted small"></div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem">
        <div class="muted">Total: Br <span id="checkoutTotal">0.00</span></div>
        <div style="display:flex;gap:.5rem">
          <button type="button" class="btn secondary" onclick="document.getElementById('modal').classList.remove('open')">Cancel</button>
          <button class="btn primary" type="submit">Place order (demo)</button>
        </div>
      </div>
    </form>
  `;

  document.getElementById('checkoutTotal').textContent = document.getElementById('subtotal').textContent || '0.00';

  const form = document.getElementById('checkoutForm');
  const paymentRadios = form.querySelectorAll('input[name="payment"]');
  const paymentExtra = document.getElementById('paymentExtra');

  // show extra instructions depending on method
  paymentRadios.forEach(r => r.addEventListener('change', (e) => {
    const v = e.target.value;
    if(v === 'telebirr'){
      paymentExtra.innerHTML = `
        <div><strong>Telebirr selected (demo)</strong></div>
        <div>Enter Telebirr phone/ID in the phone field. In a real integration we'd redirect to Telebirr or initiate a push.</div>
      `;
    } else if(v === 'cbe' || v === 'dashen' || v === 'abyssinia'){
      let bn = v === 'cbe' ? 'Commercial Bank of Ethiopia (CBE)' : (v === 'dashen' ? 'Dashen Bank' : 'Abyssinia Bank');
      paymentExtra.innerHTML = `
        <div><strong>${bn} selected (demo)</strong></div>
        <div>Transfer Br <span id="bankAmt">${document.getElementById('subtotal').textContent}</span> to our account and enter reference in the phone or address field. (Demo only)</div>
      `;
    } else if(v === 'cod'){
      paymentExtra.innerHTML = `<div><strong>Cash on Delivery</strong></div><div>Pay in cash when the courier delivers the order.</div>`;
    } else paymentExtra.innerHTML = '';
  }));

  // handle submit (demo)
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());

    if(state.cart.length === 0){ alert('Your cart is empty'); return; }

    // simulate small validation and "processing"
    const order = {
      id: 'ORD' + Date.now(),
      items: state.cart,
      customer: obj,
      total: document.getElementById('subtotal').textContent
    };

    // Simulate different flows depending on chosen payment method (ALL demo)
    if(obj.payment === 'telebirr'){
      // pretend to call Telebirr API: for demo just show instructions and success
      card.innerHTML = `
        <div style="text-align:center">
          <h2>Telebirr Demo — Payment Requested</h2>
          <p class="muted">Simulating Telebirr payment push to ${obj.phone}. (Demo only)</p>
          <p class="muted">Order ID: <strong>${order.id}</strong></p>
          <button class="btn primary" id="teleConfirm">Simulate payment success</button>
        </div>
      `;

      document.getElementById('teleConfirm').addEventListener('click', () => finalizeOrder(order, 'Telebirr (demo)'));
    }
    else if(obj.payment === 'cod'){
      finalizeOrder(order, 'Cash on Delivery');
    } else {
      // bank transfer or other bank methods: show transfer instructions then finalize
      let bankName = obj.payment === 'cbe' ? 'CBE' : (obj.payment === 'dashen' ? 'Dashen' : 'Abyssinia');
      card.innerHTML = `
        <div style="text-align:center">
          <h2>${bankName} Transfer (Demo)</h2>
          <p class="muted">Please transfer Br ${order.total} to our ${bankName} account (demo account).</p>
          <p class="muted">After transfer, press Confirm to complete (demo).</p>
          <p class="muted">Order ID: <strong>${order.id}</strong></p>
          <button class="btn primary" id="bankConfirm">Confirm (simulate)</button>
        </div>
      `;
      document.getElementById('bankConfirm').addEventListener('click', () => finalizeOrder(order, `${bankName} transfer (demo)`));
    }
  }, { once:true });

  modal.onclick = (e) => { if(e.target === modal){ modal.classList.remove('open'); modal.onclick = null; } };
}

// finalize order (demo) — clears cart and shows confirmation
function finalizeOrder(order, paymentMethod){
  // clear cart (demo)
  state.cart = []; saveCart(); updateCartUI();

  const card = document.getElementById('modalCard');
  card.innerHTML = `
    <div style="text-align:center">
      <h2>Thank you — Order placed</h2>
      <p class="muted">Order ID: <strong>${order.id}</strong></p>
      <p class="muted">Payment method: <strong>${paymentMethod}</strong></p>
      <p class="muted">We will email the order confirmation to ${order.customer.email} (demo).</p>
      <button class="btn primary" onclick="document.getElementById('modal').classList.remove('open')">Close</button>
    </div>
  `;
}

// init
function init(){
  document.getElementById('year').textContent = new Date().getFullYear();
  applyFilters();
  updateCartUI();
  window.addToCart = addToCart;
  window.quickView = quickView;
  window.changeQty = changeQty;
  window.removeItem = removeItem;
  window.openCheckoutForm = openCheckoutForm;
}

init();
