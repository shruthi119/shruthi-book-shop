let cart = [];

const products = window.sectionProducts || [];
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const scannerBox = document.getElementById('scannerBox');
const scannerAmount = document.getElementById('scannerAmount');
const checkoutButton = document.getElementById('checkoutButton');
const message = document.getElementById('message');

function money(amount) {
    return `Rs. ${amount}`;
}

function renderProducts() {
    productGrid.innerHTML = products.map((product) => {
        const stockText = product.stock > 0 ? 'In stock' : 'Out of stock';
        const buttonText = product.stock > 0 ? 'Add' : 'Notify me';
        const buttonClass = product.stock > 0 ? 'primary-button' : 'secondary-button notify-button';
        const buttonAction = product.stock > 0 ? `addToCart(${product.id})` : `notifyOutOfStock('${product.name}')`;

        return `
            <article class="product-card">
                <div class="product-image ${product.category}">${product.letter}</div>
                <div class="product-body">
                    <h3>${product.name}</h3>
                    <p>${product.detail}</p>
                    <span class="stock ${product.stock > 0 ? '' : 'out'}">${stockText}</span>
                    <div class="product-bottom">
                        <span class="price">${money(product.price)}</span>
                        <button class="${buttonClass}" type="button" onclick="${buttonAction}">${buttonText}</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function notifyOutOfStock(productName) {
    scannerBox.hidden = true;
    message.textContent = `${productName} is out of stock. I'll notify you soon.`;
}

function addToCart(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product || product.stock <= 0) {
        message.textContent = 'This item is out of stock.';
        return;
    }

    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            message.textContent = 'No more stock available for this item.';
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    scannerBox.hidden = true;
    message.textContent = '';
    renderCart();
}

function changeQuantity(productId, change) {
    const item = cart.find((cartItem) => cartItem.id === productId);
    const product = products.find((entry) => entry.id === productId);
    if (!item || !product) return;

    if (change > 0 && item.quantity >= product.stock) {
        message.textContent = 'No more stock available for this item.';
        return;
    }

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter((cartItem) => cartItem.id !== productId);
    }

    scannerBox.hidden = true;
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    scannerBox.hidden = true;
    renderCart();
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = cart.map((item) => {
            const product = products.find((entry) => entry.id === item.id);
            const lineTotal = product.price * item.quantity;
            return `
                <div class="cart-row">
                    <div>
                        <h3>${product.name}</h3>
                        <p>${money(product.price)} each</p>
                        <div class="quantity">
                            <button type="button" onclick="changeQuantity(${product.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" onclick="changeQuantity(${product.id}, 1)">+</button>
                        </div>
                    </div>
                    <div>
                        <strong>${money(lineTotal)}</strong>
                        <button class="remove-button" type="button" onclick="removeFromCart(${product.id})">Remove</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    cartCount.textContent = count;
    cartTotal.textContent = money(total);
    scannerAmount.textContent = `Total: ${money(total)}`;

    if (cart.length === 0) scannerBox.hidden = true;
}

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        scannerBox.hidden = true;
        message.textContent = 'Please add at least one item before checkout.';
        return;
    }

    scannerBox.hidden = false;
    message.textContent = 'Scanner note: please scan and pay this total.';
});

renderProducts();
renderCart();



