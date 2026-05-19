import { useState } from "react";

import Cart from "../components/Cart.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Checkout from "../pages/Checkout.jsx";

const appStyles = {
  page: {
    minHeight: "100vh",
    padding: "32px 20px 48px",
    background:
      "radial-gradient(circle at top, rgba(59, 130, 246, 0.16), transparent 26%), linear-gradient(180deg, #06121f 0%, #0b1728 48%, #08111d 100%)",
  },
  shell: {
    width: "100%",
    maxWidth: "1120px",
    margin: "0 auto",
  },
  header: {
    display: "grid",
    gap: "10px",
    marginBottom: "28px",
  },
  badge: {
    display: "inline-flex",
    width: "fit-content",
    padding: "7px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    color: "#93c5fd",
    fontSize: "0.74rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 800,
    letterSpacing: "-0.05em",
  },
  subtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.98rem",
  },
  stagePill: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(16, 185, 129, 0.14)",
    border: "1px solid rgba(52, 211, 153, 0.2)",
    color: "#6ee7b7",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(340px, 0.85fr)",
    gap: "24px",
    alignItems: "start",
  },
};

const mockProduct = {
  id: "buildx-starter-plan",
  title: "BuildX Starter Plan",
  price: 499,
  description: "Premium sandbox access for the payment gateway demo.",
  category: "Digital Product",
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [stage, setStage] = useState("cart");
  const [orderId, setOrderId] = useState("DEMO-001");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function addToCart(product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function increaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function proceedToCheckout() {
    // The order id is regenerated when checkout begins so the cart flow
    // feels closer to a real payment session.
    setOrderId(`DEMO-${String(Date.now()).slice(-6)}`);
    setStage("checkout");
  }

  function returnToCart() {
    setStage("cart");
  }

  if (stage === "checkout") {
    return (
      <Checkout
        cartItems={cartItems}
        subtotal={subtotal}
        orderId={orderId}
        onBack={returnToCart}
      />
    );
  }

  return (
    <main style={appStyles.page}>
      <section style={appStyles.shell}>
        <header style={appStyles.header}>
          <span style={appStyles.badge}>BuildX Payments</span>

          <div style={appStyles.titleRow}>
            <div>
              <h1 style={appStyles.title}>Cart to checkout demo</h1>
              <p style={appStyles.subtitle}>
                A minimal product, cart, and payment flow for the gateway module.
              </p>
            </div>

            <span style={appStyles.stagePill}>Product to Payment Flow</span>
          </div>
        </header>

        <section style={appStyles.layout}>
          <ProductCard product={mockProduct} onAddToCart={addToCart} />
          <Cart
            items={cartItems}
            subtotal={subtotal}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeFromCart}
            onProceed={proceedToCheckout}
          />
        </section>
      </section>
    </main>
  );
}

export default App;
