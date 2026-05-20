import { useEffect, useState } from "react";

import Cart from "../components/Cart.jsx";
import CheckoutStepper from "../components/CheckoutStepper.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ToastViewport from "../components/ToastViewport.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Checkout from "../pages/Checkout.jsx";
import Payment from "../pages/Payment.jsx";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import {
  calculatePricing,
  normalizeCouponCode,
  resolveCoupon,
} from "../utils/pricing.js";
import {
  sanitizeCardInput,
  sanitizeUpiId,
} from "../utils/paymentValidation.js";

const appStyles = {
  page: {
    minHeight: "100vh",
    padding: "clamp(20px, 4vw, 32px) clamp(16px, 4vw, 20px) 48px",
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
    marginBottom: "clamp(20px, 4vw, 28px)",
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
    gap: "24px",
    alignItems: "start",
  },
};

const paymentMethods = [
  {
    id: "GOOGLE_PAY",
    label: "Google Pay",
    icon: "G",
    description: "Continue in Google Pay",
    iconBackground: "rgba(96, 165, 250, 0.18)",
    iconColor: "#bfdbfe",
  },
  {
    id: "PHONEPE",
    label: "PhonePe",
    icon: "P",
    description: "Fast PhonePe approval",
    iconBackground: "rgba(167, 139, 250, 0.2)",
    iconColor: "#ddd6fe",
  },
  {
    id: "PAYTM",
    label: "Paytm",
    icon: "PT",
    description: "Wallet-based digital checkout",
    iconBackground: "rgba(45, 212, 191, 0.16)",
    iconColor: "#99f6e4",
  },
  {
    id: "UPI",
    label: "UPI",
    icon: "U",
    description: "Enter your UPI ID",
    iconBackground: "rgba(251, 191, 36, 0.18)",
    iconColor: "#fde68a",
  },
  {
    id: "CARD",
    label: "Credit / Debit Card",
    icon: "CD",
    description: "Card number and CVV",
    iconBackground: "rgba(248, 250, 252, 0.14)",
    iconColor: "#e2e8f0",
  },
  {
    id: "NET_BANKING",
    label: "Net Banking",
    icon: "NB",
    description: "Choose your bank securely",
    iconBackground: "rgba(74, 222, 128, 0.16)",
    iconColor: "#bbf7d0",
  },
];

const bankOptions = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "IndusInd Bank",
  "IDFC FIRST Bank",
  "Union Bank of India",
  "Yes Bank",
];

const mockProduct = {
  id: "buildx-starter-plan",
  title: "BuildX Learning Pass",
  price: 499,
  description: "Instant access to the premium payment gateway learning experience.",
  category: "Digital Subscription",
};

function App() {
  const mobileBreakpoint = 640;
  const compactBreakpoint = 960;
  const [cartItems, setCartItems] = useState([]);
  const [stage, setStage] = useState("cart");
  const [orderId, setOrderId] = useState("DEMO-001");
  const [selectedMethod, setSelectedMethod] = useState("GOOGLE_PAY");
  const [couponCode, setCouponCode] = useState("");
  const [submittedCouponCode, setSubmittedCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [billingName, setBillingName] = useState("");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [selectedBank, setSelectedBank] = useState("");
  const [successfulPayment, setSuccessfulPayment] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") {
      return compactBreakpoint;
    }

    return window.innerWidth;
  });
  const isCompact = viewportWidth < compactBreakpoint;
  const isMobile = viewportWidth < mobileBreakpoint;

  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pricing = calculatePricing({
    cartItems,
    couponCode: submittedCouponCode,
  });
  const subtotal = pricing.subtotal;
  const appliedCoupon = pricing.appliedCoupon;

  function showToast({ variant = "info", title, message, duration }) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setToasts((currentToasts) => [
      ...currentToasts,
      { id, variant, title, message, duration },
    ]);
  }

  function dismissToast(id) {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }

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
    if (cartItems.length === 0) {
      showToast({
        variant: "warning",
        title: "Cart is empty",
        message: "Add the learning pass before moving to checkout.",
      });
      return;
    }

    // The order id is regenerated when checkout begins so the cart flow
    // feels closer to a real payment session.
    setOrderId(`DEMO-${String(Date.now()).slice(-6)}`);
    setStage("checkout");
  }

  function returnToCart() {
    setStage("cart");
  }

  function proceedToPayment() {
    if (cartItems.length === 0) {
      showToast({
        variant: "warning",
        title: "No items to pay for",
        message: "Your cart is empty, so payment cannot start yet.",
      });
      return;
    }

    setStage("payment");
  }

  function returnToCheckout() {
    setStage("checkout");
  }

  function handlePaymentSuccess(paymentDetails) {
    setSuccessfulPayment(paymentDetails);
    setStage("success");
  }

  function goToDashboard() {
    setStage("dashboard");
  }

  function goBackHome() {
    setStage("cart");
  }

  async function handleApplyCoupon() {
    if (isApplyingCoupon) {
      return;
    }

    if (cartItems.length === 0) {
      showToast({
        variant: "warning",
        title: "Coupon skipped",
        message: "Add an item before applying a coupon.",
      });
      return;
    }

    const normalizedCoupon = normalizeCouponCode(couponCode);

    if (!normalizedCoupon) {
      setSubmittedCouponCode("");
      showToast({
        variant: "warning",
        title: "Coupon required",
        message: "Enter a coupon code first.",
      });
      return;
    }

    setIsApplyingCoupon(true);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });

    setSubmittedCouponCode(normalizedCoupon);
    setIsApplyingCoupon(false);

    const couponResult = resolveCoupon(normalizedCoupon, subtotal);

    if (couponResult.status === "applied") {
      showToast({
        variant: "success",
        title: "Coupon applied",
        message: couponResult.message,
      });
      return;
    }

    showToast({
      variant: "error",
      title: "Invalid coupon",
      message: couponResult.message,
    });
  }

  function handleClearCoupon() {
    setCouponCode("");
    setSubmittedCouponCode("");
  }

  function handleCardChange(field, value) {
    setCardDetails((currentDetails) => ({
      ...currentDetails,
      [field]: sanitizeCardInput(field, value),
    }));
  }

  function handleUpiChange(value) {
    setUpiId(sanitizeUpiId(value));
  }

  function buildReceiptData() {
    if (!successfulPayment) {
      return null;
    }

    return {
      brand: {
        title: "BuildX Payments",
        subtitle: "Digital Payment Receipt",
      },
      customerName: successfulPayment.customerName,
      transactionId: successfulPayment.transactionId,
      orderId: successfulPayment.orderId,
      paymentMethod: successfulPayment.method,
      status: successfulPayment.status,
      paidAt: successfulPayment.paidAt,
      billingSummary: successfulPayment.billingSummary,
      currency: successfulPayment.currency,
      notes:
        "This is a system-generated receipt for your BuildX digital purchase.",
    };
  }

  if (stage === "checkout") {
    return (
      <>
        <ToastViewport toasts={toasts} onDismiss={dismissToast} />
        <Checkout
          cartItems={cartItems}
          subtotal={subtotal}
          pricing={pricing}
          orderId={orderId}
          paymentMethods={paymentMethods}
          selectedMethod={selectedMethod}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          onBack={returnToCart}
          onContinue={proceedToPayment}
          onMethodSelect={setSelectedMethod}
          onCouponChange={setCouponCode}
          onApplyCoupon={handleApplyCoupon}
          isApplyingCoupon={isApplyingCoupon}
          onClearCoupon={handleClearCoupon}
          isCompact={isCompact}
          isMobile={isMobile}
        />
      </>
    );
  }

  if (stage === "payment") {
    return (
      <>
        <ToastViewport toasts={toasts} onDismiss={dismissToast} />
        <Payment
          cartItems={cartItems}
          subtotal={subtotal}
          pricing={pricing}
          orderId={orderId}
          paymentMethods={paymentMethods}
          selectedMethod={selectedMethod}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          billingName={billingName}
          upiId={upiId}
          cardDetails={cardDetails}
          selectedBank={selectedBank}
          bankOptions={bankOptions}
          onBackToCheckout={returnToCheckout}
          onMethodSelect={setSelectedMethod}
          onCouponChange={setCouponCode}
          onApplyCoupon={handleApplyCoupon}
          onClearCoupon={handleClearCoupon}
          onBillingNameChange={setBillingName}
          onUpiChange={handleUpiChange}
          onCardChange={handleCardChange}
          onBankChange={setSelectedBank}
          onPaymentSuccess={handlePaymentSuccess}
          onNotify={showToast}
          isApplyingCoupon={isApplyingCoupon}
          isCompact={isCompact}
          isMobile={isMobile}
        />
      </>
    );
  }

  if (stage === "success" && successfulPayment) {
    return (
      <>
        <ToastViewport toasts={toasts} onDismiss={dismissToast} />
        <PaymentSuccess
          paymentDetails={successfulPayment}
          receiptData={buildReceiptData()}
          onGoToDashboard={goToDashboard}
          onBackToHome={goBackHome}
        />
      </>
    );
  }

  if (stage === "dashboard") {
    return (
      <>
        <ToastViewport toasts={toasts} onDismiss={dismissToast} />
        <Dashboard onBackHome={goBackHome} />
      </>
    );
  }

  return (
    <>
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
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

            <CheckoutStepper activeStep="cart" compact={isCompact} />
          </header>

          <section
            style={{
              ...appStyles.layout,
              gridTemplateColumns: isCompact
                ? "minmax(0, 1fr)"
                : "minmax(0, 1.15fr) minmax(340px, 0.85fr)",
            }}
          >
            <ProductCard product={mockProduct} onAddToCart={addToCart} />
            <Cart
              items={cartItems}
              subtotal={subtotal}
              pricing={pricing}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
              onProceed={proceedToCheckout}
            />
          </section>
        </section>
      </main>
    </>
  );
}

export default App;
