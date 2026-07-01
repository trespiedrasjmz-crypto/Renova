// ============================================================
//  RENOVA — script.js
//  Las imágenes se cargan desde archivos locales.
//  Asegúrate de que estén en la misma carpeta que index.html.
// ============================================================

const EMAILJS_PUBLIC_KEY  = "PdScCSG6OgqwmiTdJ";
const EMAILJS_SERVICE_ID  = "service_24kefc9";
const EMAILJS_TEMPLATE_ID = "template_gw6pnam";

// ── RUTAS DE IMÁGENES ────────────────────────────────────────
// Nombres exactos de tus archivos (deben estar junto a index.html)
const IMGS = {
  campo_panorama:     "campo_panorama.jpeg",
  campo_trabajadores: "campo_trabajadores.jpeg",
  campo_riego:        "Campo riego.jpeg",
  arboles:            "arboles.jpeg",
  oregano_planta:     "oregano_planta.jpeg",
  botellas:           "botellas.jpg",
  galon:              "galon.jpg",
};

// ── CATÁLOGO DE PRODUCTOS ────────────────────────────────────
const products = [
  {
    id: 1,
    name: "Aceite de Orégano Diluido",
    badge: "",
    imgKey: "botellas",
    desc: "Toda la potencia y beneficios de nuestro orégano chihuahuense, formulado a una concentración segura para el uso diario. Ideal para el bienestar cotidiano de toda la familia.",
    options: {
      label: "Volumen",
      choices: [
        { label: "30 ml",  price: 160    },
        { label: "1 L",    price: 5333   },
        { label: "20 L",   price: 103000 },
      ],
    },
  },
  {
    id: 2,
    name: "Aceite de Orégano Puro",
    badge: "Premium",
    imgKey: "galon",
    desc: "Aceite esencial 100% puro, destilado directamente en nuestras instalaciones en Jiménez, Chihuahua. Máxima concentración y potencia del orégano chihuahuense.",
    options: {
      label: "Volumen",
      choices: [
        { label: "30 ml",  price: 180    },
        { label: "1 L",    price: 6000   },
        { label: "20 L",   price: 110000 },
      ],
    },
  },
  {
    id: 3,
    name: "Paquete Hojas de Orégano",
    badge: "",
    imgKey: "oregano_planta",
    desc: "Hojas de orégano frescas y secas, empacadas para conservar su aroma intenso y auténtico. Ideal para gastronomía, infusiones y uso en el hogar.",
    options: {
      label: "Peso",
      choices: [
        { label: "100 g", price: 20  },
        { label: "500 g", price: 100 },
      ],
    },
  },
  {
    id: 4,
    name: "Orégano Seco Premium",
    badge: "",
    imgKey: "oregano_planta",
    desc: "Ramas de orégano seco de primera calidad, recolectadas y curadas para preservar su aroma intenso y sabor auténtico. Perfecto para infusiones y como especia culinaria.",
    options: {
      label: "Peso",
      choices: [
        { label: "1000 g", price: 70 },
      ],
    },
  },
];

// ── ESTADO GLOBAL ────────────────────────────────────────────
let cart           = [];
let modalQty       = 1;
let currentProduct = null;
let currentOptIdx  = 0;
let checkoutStep   = "cart";
let shippingData   = {};

// ── INIT ─────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("heroBg").style.backgroundImage =
    "url('" + IMGS.campo_panorama + "')";

  document.getElementById("aboutImg").src = IMGS.campo_trabajadores;

  const gallery = document.getElementById("galleryStrip");
  [IMGS.campo_riego, IMGS.arboles, IMGS.campo_trabajadores].forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Rancho Tres Piedras";
    gallery.appendChild(img);
  });

  renderProducts();
});

// ── RENDER TARJETAS DE PRODUCTOS ─────────────────────────────
function renderProducts() {
  document.getElementById("productsGrid").innerHTML = products.map(p => {
    const base = p.options.choices[0];
    return (
      '<div class="product-card" onclick="openModal(' + p.id + ')">' +
        '<div class="product-img">' +
          (p.badge ? '<span class="product-badge-new">' + p.badge + '</span>' : '') +
          '<img src="' + IMGS[p.imgKey] + '" alt="' + p.name + '" loading="lazy"/>' +
        '</div>' +
        '<div class="product-info">' +
          '<div class="product-name">' + p.name + '</div>' +
          '<div class="product-desc">' + p.desc.substring(0, 88) + '…</div>' +
          '<div class="product-footer">' +
            '<div class="product-price">' +
              '<span class="price-now">$' + base.price.toLocaleString() + '</span>' +
              '<span style="font-size:.75rem;color:var(--gris)">' + base.label + '</span>' +
            '</div>' +
            '<button class="btn-add" onclick="event.stopPropagation();quickAdd(' + p.id + ')">+</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join("");
}

// ── MODAL DE PRODUCTO ─────────────────────────────────────────
function openModal(id) {
  currentProduct = products.find(p => p.id === id);
  modalQty       = 1;
  currentOptIdx  = 0;

  document.getElementById("modalImg").src          = IMGS[currentProduct.imgKey];
  document.getElementById("modalImg").alt          = currentProduct.name;
  document.getElementById("modalName").textContent = currentProduct.name;
  document.getElementById("modalDesc").textContent = currentProduct.desc;
  document.getElementById("qtyNum").textContent    = 1;

  renderModalPrice();
  renderModalOptions();

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderModalPrice() {
  const c = currentProduct.options.choices[currentOptIdx];
  document.getElementById("modalPrice").innerHTML =
    "$" + c.price.toLocaleString() + " MXN " +
    '<span style="font-size:.9rem;color:var(--gris);font-weight:400">/ ' + c.label + "</span>";
}

function renderModalOptions() {
  const label   = currentProduct.options.label;
  const choices = currentProduct.options.choices;
  var html = '<div class="modal-label">' + label + '</div><div class="options">';
  choices.forEach(function(c, i) {
    html += '<button class="opt-btn' + (i === 0 ? " selected" : "") +
            '" onclick="selectOpt(this,' + i + ')">' +
            c.label + " — $" + c.price.toLocaleString() + "</button>";
  });
  html += "</div>";
  document.getElementById("modalOptions").innerHTML = html;
}

function selectOpt(btn, idx) {
  document.querySelectorAll("#modalOptions .opt-btn")
    .forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  currentOptIdx = idx;
  renderModalPrice();
}

function closeProductModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalOverlay").addEventListener("click", function(e) {
  if (e.target === e.currentTarget) closeProductModal();
});

function changeQty(d) {
  modalQty = Math.max(1, modalQty + d);
  document.getElementById("qtyNum").textContent = modalQty;
}

function addToCartFromModal(goCheckout) {
  goCheckout = goCheckout || false;
  const choice = currentProduct.options.choices[currentOptIdx];
  for (var i = 0; i < modalQty; i++) {
    cart.push(Object.assign({}, currentProduct, {
      selectedOpt: choice.label,
      price: choice.price
    }));
  }
  updateCartCount();
  closeProductModal();
  if (goCheckout) openCheckout();
  else showToast("✓ " + currentProduct.name + " (" + choice.label + ") agregado");
}

function quickAdd(id) {
  const p = products.find(x => x.id === id);
  const c = p.options.choices[0];
  cart.push(Object.assign({}, p, { selectedOpt: c.label, price: c.price }));
  updateCartCount();
  showToast("✓ " + p.name + " (" + c.label + ") agregado");
}

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

// ── CHECKOUT ─────────────────────────────────────────────────
function openCheckout() {
  checkoutStep = "cart";
  renderCheckout();
  document.getElementById("checkoutOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  document.getElementById("checkoutOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("checkoutOverlay").addEventListener("click", function(e) {
  if (e.target === e.currentTarget) closeCheckout();
});

function renderCheckout() {
  const body = document.getElementById("checkoutBody");
  if      (checkoutStep === "cart")     renderCartStep(body);
  else if (checkoutStep === "shipping") renderShippingStep(body);
  else if (checkoutStep === "payment")  renderPaymentStep(body);
  else if (checkoutStep === "success")  renderSuccessStep(body);
}

// PASO 1 — CARRITO
function renderCartStep(body) {
  if (!cart.length) {
    body.innerHTML =
      '<div style="text-align:center;padding:3rem 1rem">' +
        '<div style="font-size:3rem;margin-bottom:1rem">🛒</div>' +
        '<h3 style="font-family:\'Playfair Display\',serif;font-size:1.5rem;color:var(--tierra);margin-bottom:.8rem">Tu carrito está vacío</h3>' +
        '<p style="color:var(--gris);font-size:.9rem;margin-bottom:1.5rem">Agrega productos desde la tienda</p>' +
        '<button onclick="closeCheckout();setTimeout(function(){document.getElementById(\'tienda\').scrollIntoView({behavior:\'smooth\'})},300)" ' +
          'style="padding:.8rem 2rem;background:var(--hoja);color:#fff;border:none;border-radius:10px;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;font-weight:600">' +
          'Ver tienda' +
        '</button>' +
      '</div>';
    return;
  }

  const total = cart.reduce((s, i) => s + i.price, 0);
  var html = '<div class="checkout-section-title">Productos en tu carrito</div>';
  cart.forEach(function(item, idx) {
    html +=
      '<div class="cart-item">' +
        '<img class="cart-item-img" src="' + IMGS[item.imgKey] + '" alt="' + item.name + '"/>' +
        '<div style="flex:1">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-opt">' + item.selectedOpt + '</div>' +
        '</div>' +
        '<span class="cart-item-price">$' + item.price.toLocaleString() + '</span>' +
        '<button class="cart-item-remove" onclick="removeCartItem(' + idx + ')">✕</button>' +
      '</div>';
  });
  html +=
    '<div class="cart-total"><span>Total</span><span>$' + total.toLocaleString() + ' MXN</span></div>' +
    '<button class="btn-confirm" onclick="checkoutStep=\'shipping\';renderCheckout()">Continuar con el envío &rarr;</button>';
  body.innerHTML = html;
}

function removeCartItem(idx) {
  cart.splice(idx, 1);
  updateCartCount();
  renderCheckout();
}

// PASO 2 — DATOS DE ENVÍO
function renderShippingStep(body) {
  const states = [
    "Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas",
    "Chihuahua","Ciudad de México","Coahuila","Colima","Durango","Guanajuato",
    "Guerrero","Hidalgo","Jalisco","México","Michoacán","Morelos","Nayarit",
    "Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí",
    "Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas"
  ];
  var opts = states.map(function(s) {
    return '<option value="' + s + '"' + (s === "Chihuahua" ? " selected" : "") + '>' + s + '</option>';
  }).join("");

  body.innerHTML =
    '<button onclick="checkoutStep=\'cart\';renderCheckout()" ' +
      'style="background:none;border:none;color:var(--gris);cursor:pointer;font-size:.82rem;margin-bottom:1rem;display:flex;align-items:center;gap:.4rem">' +
      '← Volver al carrito' +
    '</button>' +
    '<div class="checkout-section-title">Datos de envío</div>' +
    '<div class="form-row-2">' +
      '<div class="form-group"><label>Nombre *</label><input id="sh_nombre" type="text" placeholder="Tu nombre"/></div>' +
      '<div class="form-group"><label>Apellido *</label><input id="sh_apellido" type="text" placeholder="Tu apellido"/></div>' +
    '</div>' +
    '<div class="form-group"><label>Email *</label><input id="sh_email" type="email" placeholder="tu@correo.com"/></div>' +
    '<div class="form-group"><label>Teléfono *</label><input id="sh_tel" type="tel" placeholder="+52 614 000 0000"/></div>' +
    '<div class="form-group"><label>Estado *</label><select id="sh_estado"><option value="">-- Selecciona --</option>' + opts + '</select></div>' +
    '<div class="form-group"><label>Ciudad *</label><input id="sh_ciudad" type="text" placeholder="Tu ciudad"/></div>' +
    '<div class="form-group"><label>Dirección *</label><input id="sh_dir" type="text" placeholder="Calle, número, colonia"/></div>' +
    '<div class="form-group"><label>Código Postal *</label><input id="sh_cp" type="text" placeholder="33980"/></div>' +
    '<div class="form-group"><label>Notas adicionales</label><textarea id="sh_notas" placeholder="Instrucciones especiales, referencias…"></textarea></div>' +
    '<button class="btn-confirm" onclick="submitShipping()">Continuar al pago &rarr;</button>';

  Object.keys(shippingData).forEach(function(k) {
    var el = document.getElementById("sh_" + k);
    if (el) el.value = shippingData[k];
  });
}

function submitShipping() {
  const required = ["nombre","apellido","email","tel","estado","ciudad","dir","cp"];
  var valid = true;
  required.forEach(function(f) {
    var el = document.getElementById("sh_" + f);
    if (!el || !el.value.trim()) {
      valid = false;
      if (el) el.style.borderColor = "#e55";
    } else {
      el.style.borderColor = "";
    }
  });
  if (!valid) { showToast("⚠ Por favor llena todos los campos requeridos"); return; }
  shippingData = {
    nombre:   document.getElementById("sh_nombre").value.trim(),
    apellido: document.getElementById("sh_apellido").value.trim(),
    email:    document.getElementById("sh_email").value.trim(),
    tel:      document.getElementById("sh_tel").value.trim(),
    estado:   document.getElementById("sh_estado").value,
    ciudad:   document.getElementById("sh_ciudad").value.trim(),
    dir:      document.getElementById("sh_dir").value.trim(),
    cp:       document.getElementById("sh_cp").value.trim(),
    notas:    document.getElementById("sh_notas").value.trim(),
  };
  checkoutStep = "payment";
  renderCheckout();
}

// PASO 3 — MÉTODO DE PAGO
function renderPaymentStep(body) {
  const total       = cart.reduce((s, i) => s + i.price, 0);
  const isChihuahua = shippingData.estado === "Chihuahua";

  var cashOption = isChihuahua
    ? '<div class="pay-opt" id="payOptCash" onclick="selectPayment(\'cash\')">' +
        '<div class="pay-icon">💵</div>' +
        '<div class="pay-name">Pago en efectivo</div>' +
        '<div class="pay-desc">Solo Chihuahua · Contra entrega</div>' +
      '</div>'
    : "";

  var cashPanel = isChihuahua
    ? '<div id="payDetailsCash" class="pay-panel">' +
        '<div class="cash-box">' +
          '<h4>💵 Pago en efectivo — Chihuahua</h4>' +
          '<p>Recibirás tu pedido y pagarás en el momento de la entrega. Nuestro equipo se comunicará contigo para coordinar la fecha y hora en <strong>' + shippingData.ciudad + ', ' + shippingData.estado + '</strong>.</p>' +
          '<p style="margin-top:.6rem">📞 <strong>614-156-3558</strong></p>' +
        '</div>' +
        '<button class="btn-confirm" onclick="confirmOrder(\'Efectivo contra entrega\')">✓ Confirmar pedido</button>' +
      '</div>'
    : "";

  body.innerHTML =
    '<button onclick="checkoutStep=\'shipping\';renderCheckout()" ' +
      'style="background:none;border:none;color:var(--gris);cursor:pointer;font-size:.82rem;margin-bottom:1rem;display:flex;align-items:center;gap:.4rem">' +
      '← Datos de envío' +
    '</button>' +
    '<div class="checkout-section-title">Resumen del pedido</div>' +
    '<div style="background:var(--crema);border-radius:10px;padding:1rem 1.2rem;margin-bottom:1rem;font-size:.85rem">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:.3rem">' +
        '<span style="color:var(--gris)">Envío a:</span>' +
        '<span style="font-weight:600">' + shippingData.nombre + ' ' + shippingData.apellido + ' · ' + shippingData.ciudad + ', ' + shippingData.estado + '</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between">' +
        '<span style="color:var(--gris)">Total:</span>' +
        '<span style="font-weight:700;color:var(--tierra);font-size:1.05rem">$' + total.toLocaleString() + ' MXN</span>' +
      '</div>' +
    '</div>' +
    '<div class="checkout-section-title">Método de pago</div>' +
    '<div class="payment-methods">' +
      '<div class="pay-opt" id="payOptTransfer" onclick="selectPayment(\'transfer\')">' +
        '<div class="pay-icon">🏦</div><div class="pay-name">Transferencia / SPEI</div>' +
        '<div class="pay-desc">Cualquier banco · Inmediato</div>' +
      '</div>' +
      '<div class="pay-opt" id="payOptCard" onclick="selectPayment(\'card\')">' +
        '<div class="pay-icon">💳</div><div class="pay-name">CoDi / QR Bancario</div>' +
        '<div class="pay-desc">Pago con tu app bancaria</div>' +
      '</div>' +
      cashOption +
    '</div>' +
    '<div id="payDetailsTransfer" class="pay-panel">' +
      '<div class="transfer-box">' +
        '<h4>Datos para transferencia SPEI</h4>' +
        '<div class="transfer-row"><span>Banco</span><span>BBVA México</span></div>' +
        '<div class="transfer-row"><span>Nombre</span><span>Renova Tres Piedras</span></div>' +
        '<div class="transfer-row"><span>CLABE</span><span>012345678901234567 <button class="copy-btn" onclick="copyText(\'012345678901234567\',\'CLABE copiada\')">Copiar</button></span></div>' +
        '<div class="transfer-row"><span>Concepto</span><span>Pedido Renova</span></div>' +
        '<div class="transfer-row" style="margin-top:.8rem;padding-top:.8rem;border-top:1px solid #ddd">' +
          '<span style="font-weight:600">Total a transferir:</span>' +
          '<span style="font-weight:700;color:var(--tierra);font-size:1.05rem">$' + total.toLocaleString() + ' MXN</span>' +
        '</div>' +
      '</div>' +
      '<p style="font-size:.8rem;color:var(--gris);margin-bottom:1rem">Después de realizar la transferencia, confirma tu pedido y te contactamos para coordinar el envío.</p>' +
      '<button class="btn-confirm" onclick="confirmOrder(\'Transferencia SPEI\')">✓ Confirmar pedido</button>' +
    '</div>' +
    '<div id="payDetailsCard" class="pay-panel">' +
      '<div class="transfer-box">' +
        '<h4>Pago con CoDi / QR Bancario</h4>' +
        '<p style="font-size:.85rem;color:#555;line-height:1.7;margin-bottom:.8rem">Escanea el QR con la app de tu banco (BBVA, Santander, Banorte, etc.) para pagar de inmediato.</p>' +
        '<div style="text-align:center;padding:1.5rem;background:#fff;border-radius:10px;border:2px dashed var(--hoja)">' +
          '<div style="font-size:3rem;margin-bottom:.5rem">📱</div>' +
          '<p style="font-size:.82rem;color:var(--gris)">CLABE: <strong>012345678901234567</strong></p>' +
          '<p style="font-size:.78rem;color:var(--gris);margin-top:.3rem">Monto: <strong>$' + total.toLocaleString() + ' MXN</strong></p>' +
        '</div>' +
      '</div>' +
      '<button class="btn-confirm" style="margin-top:1rem" onclick="confirmOrder(\'CoDi / QR Bancario\')">✓ Confirmar pedido</button>' +
    '</div>' +
    cashPanel;
}

function selectPayment(type) {
  document.querySelectorAll(".pay-opt").forEach(function(el) { el.classList.remove("selected"); });
  document.querySelectorAll(".pay-panel").forEach(function(el) { el.classList.remove("active"); });
  var cap   = type.charAt(0).toUpperCase() + type.slice(1);
  var opt   = document.getElementById("payOpt"     + cap);
  var panel = document.getElementById("payDetails" + cap);
  if (opt)   opt.classList.add("selected");
  if (panel) panel.classList.add("active");
}

function copyText(text, msg) {
  navigator.clipboard.writeText(text).then(function() { showToast("✓ " + msg); });
}

// PASO 4 — CONFIRMACIÓN + CORREO
function confirmOrder(method) {
  const total     = cart.reduce((s, i) => s + i.price, 0);
  const itemsList = cart
    .map(function(i) { return i.name + " (" + i.selectedOpt + ") — $" + i.price.toLocaleString(); })
    .join("\n");

  sendEmail({
    to_email:         "trespiedrasjmz@gmail.com",
    customer_name:    shippingData.nombre + " " + shippingData.apellido,
    customer_email:   shippingData.email,
    customer_phone:   shippingData.tel,
    customer_address: shippingData.dir + ", " + shippingData.ciudad + ", " + shippingData.estado + " CP " + shippingData.cp,
    customer_notes:   shippingData.notas || "—",
    items:            itemsList,
    total:            "$" + total.toLocaleString() + " MXN",
    payment_method:   method,
  });

  cart = [];
  updateCartCount();
  checkoutStep = "success";
  renderCheckout();
}

function renderSuccessStep(body) {
  body.innerHTML =
    '<div class="success-screen">' +
      '<div class="check">✅</div>' +
      '<h3>¡Pedido confirmado!</h3>' +
      '<p>Gracias <strong>' + shippingData.nombre + '</strong>, hemos recibido tu pedido.<br><br>' +
        'En las próximas horas nos comunicaremos al <strong>' + shippingData.tel + '</strong> ' +
        'o a <strong>' + shippingData.email + '</strong> para confirmar los detalles del envío.<br><br>' +
        '<span style="color:var(--hoja)">¡Gracias por elegir Renova!</span>' +
      '</p>' +
      '<button onclick="closeCheckout()" ' +
        'style="margin-top:2rem;padding:.8rem 2rem;background:var(--hoja);color:#fff;border:none;' +
               'border-radius:10px;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;' +
               'cursor:pointer;font-weight:600">' +
        'Cerrar' +
      '</button>' +
    '</div>';
}

// ── EMAILJS ───────────────────────────────────────────────────
function sendEmail(params) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(function() { console.log("✅ Correo enviado correctamente"); })
    .catch(function(err) { console.error("❌ Error al enviar correo:", err); });
}

// ── FORMULARIO DE CONTACTO ────────────────────────────────────
function sendContactForm() {
  var nombre   = document.getElementById("c_nombre").value.trim();
  var apellido = document.getElementById("c_apellido").value.trim();
  var email    = document.getElementById("c_email").value.trim();
  var tel      = document.getElementById("c_tel").value.trim();
  var estado   = document.getElementById("c_estado").value;
  var mensaje  = document.getElementById("c_mensaje").value.trim();

  if (!nombre || !email || !mensaje) {
    showToast("⚠ Nombre, email y mensaje son requeridos");
    return;
  }

  sendEmail({
    to_email:         "trespiedrasjmz@gmail.com",
    customer_name:    nombre + " " + apellido,
    customer_email:   email,
    customer_phone:   tel || "—",
    customer_address: "—",
    customer_notes:   mensaje,
    items:            "Consulta de contacto",
    total:            "—",
    payment_method:   "Estado: " + (estado || "—"),
  });

  showToast("✓ Mensaje enviado. ¡Te contactamos pronto!");
  ["c_nombre","c_apellido","c_email","c_tel","c_mensaje"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("c_estado").value = "";
}

// ── NEWSLETTER ────────────────────────────────────────────────
function subscribeEmail() {
  var email = document.getElementById("newsletterEmail").value.trim();
  if (!email) { showToast("⚠ Ingresa tu email"); return; }
  showToast("✓ ¡Suscripción exitosa! Gracias por unirte.");
  document.getElementById("newsletterEmail").value = "";
}

// ── NAVEGACIÓN ────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

window.addEventListener("scroll", function() {
  document.getElementById("nav").classList.toggle("scrolled", window.scrollY > 20);
  var sections = ["inicio","acerca","tienda","contacto"];
  var current  = "inicio";
  sections.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  document.querySelectorAll(".nav-links a").forEach(function(a) {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
});

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 2800);
}