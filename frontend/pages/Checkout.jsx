import { useState } from "react";

import Loader from "../components/Loader.jsx";
import PaymentButton from "../components/PaymentButton.jsx";
import PaymentMethodFields from "../components/PaymentMethodFields.jsx";
import PaymentMethodSelector from "../components/PaymentMethodSelector.jsx";
import PaymentStatus from "../components/PaymentStatus.jsx";
import { simulatePayment } from "../services/paymentService.js";

const paymentMethods = [
  {
    id: "GOOGLE_PAY",
    label: "Google Pay",
    icon: "G",
    description: "One-tap checkout",
    iconBackground: "rgba(96, 165, 250, 0.18)",
    iconColor: "#bfdbfe",
  },
  {
    id: "PHONEPE",
    label: "PhonePe",
    icon: "P",
    description: "UPI app payment",
    iconBackground: "rgba(167, 139, 250, 0.2)",
    iconColor: "#ddd6fe",
  },
  {
    id: "PAYTM",
    label: "Paytm",
    icon: "PT",
    description: "Wallet or UPI",
    iconBackground: "rgba(45, 212, 191, 0.16)",
    iconColor: "#99f6e4",
  },
  {
    id: "UPI",
    label: "UPI",
    icon: "U",
    description: "Enter UPI ID",
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
    description: "Bank transfer flow",
    iconBackground: "rgba(74, 222, 128, 0.16)",
    iconColor: "#bbf7d0",
  },
];

const checkoutStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at top, rgba(59, 130, 246, 0.16), transparent 30%), linear-gradient(180deg, #06121f 0%, #0b1728 48%, #08111d 100%)",
  },
  shell: {
    position: "relative",
    width: "100%",
    maxWidth: "920px",
  },
  glow: {
    position: "absolute",
    inset: "-18px",
    borderRadius: "36px",
    background:
      "linear-gradient(135deg, rgba(96, 165, 250, 0.24), rgba(129, 140, 248, 0.1), rgba(16, 185, 129, 0.16))",
    filter: "blur(22px)",
    opacity: 0.9,
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "32px",
    padding: "28px",
    background: "rgba(8, 15, 27, 0.78)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
    backdropFilter: "blur(18px)",
    color: "#f8fafc",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "grid",
    gap: "8px",
  },
  backButton: {
    border: "none",
    padding: "0",
    background: "transparent",
    color: "#93c5fd",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    width: "fit-content",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
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
  heading: {
    margin: 0,
    fontSize: "clamp(2rem, 6vw, 2.8rem)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
    fontWeight: 800,
  },
  subtext: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.95rem",
    lineHeight: 1.5,
  },
  securePill: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(16, 185, 129, 0.14)",
    border: "1px solid rgba(52, 211, 153, 0.26)",
    color: "#6ee7b7",
    fontSize: "0.78rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.05fr) minmax(300px, 0.95fr)",
    gap: "20px",
    alignItems: "start",
  },
  leftColumn: {
    display: "grid",
    gap: "18px",
  },
  rightColumn: {
    display: "grid",
    gap: "18px",
  },
  productCard: {
    padding: "24px",
    borderRadius: "26px",
    background:
      "linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 60%, rgba(51, 65, 85, 0.9) 100%)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  },
  productTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  productLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  productTitle: {
    margin: "12px 0 6px",
    fontSize: "1.4rem",
    fontWeight: 700,
    letterSpacing: "-0.03em",
  },
  productMeta: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "0.92rem",
  },
  chip: {
    padding: "10px 12px",
    borderRadius: "16px",
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    color: "#e2e8f0",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  divider: {
    height: "1px",
    margin: "22px 0",
    background:
      "linear-gradient(90deg, rgba(148, 163, 184, 0), rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0))",
  },
  amountRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
  },
  amountLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.88rem",
  },
  amountValue: {
    margin: "8px 0 0",
    fontSize: "2.8rem",
    lineHeight: 0.95,
    letterSpacing: "-0.06em",
    fontWeight: 800,
  },
  orderWrap: {
    display: "grid",
    gap: "6px",
    justifyItems: "end",
    textAlign: "right",
  },
  orderLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  orderValue: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "0.92rem",
    fontWeight: 600,
  },
  summaryCard: {
    display: "grid",
    gap: "12px",
    padding: "20px",
    borderRadius: "22px",
    background:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.52))",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    color: "#cbd5e1",
    fontSize: "0.94rem",
  },
  buttonWrap: {
    display: "grid",
    gap: "14px",
  },
  loaderWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
  },
};

const initialStatus = {
  variant: "idle",
  message: "Select a payment method to continue",
  payment: null,
};

const statusContent = {
  SUCCESS: {
    variant: "success",
    message: "Payment received",
  },
  FAILED: {
    variant: "error",
    message: "Payment could not be completed",
  },
  PENDING: {
    variant: "pending",
    message: "Payment is awaiting confirmation",
  },
};

function Checkout({ cartItems, subtotal, orderId, onBack }) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(initialStatus);
  const [selectedMethod, setSelectedMethod] = useState("GOOGLE_PAY");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const primaryItem = cartItems[0];
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  function handleMethodSelect(methodId) {
    setSelectedMethod(methodId);
    setPaymentStatus({
      variant: "idle",
      message: "Payment method updated",
      payment: null,
    });
  }

  function handleCardChange(field, value) {
    setCardDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
  }

  function getMethodLabel() {
    return (
      paymentMethods.find((method) => method.id === selectedMethod)?.label ||
      "Payment Method"
    );
  }

  function isPaymentDetailsReady() {
    if (selectedMethod === "UPI") {
      return upiId.trim().length > 0;
    }

    if (selectedMethod === "CARD") {
      return (
        cardDetails.number.trim().length > 0 &&
        cardDetails.expiry.trim().length > 0 &&
        cardDetails.cvv.trim().length > 0
      );
    }

    return true;
  }

  async function handleMockPayment() {
    if (!isPaymentDetailsReady()) {
      setPaymentStatus({
        variant: "error",
        message:
          selectedMethod === "UPI"
            ? "Enter a mock UPI ID before continuing"
            : "Complete the mock card fields before continuing",
        payment: null,
      });
      return;
    }

    setIsLoading(true);
    setPaymentStatus({
      variant: "loading",
      message: `Authorizing ${getMethodLabel()} payment`,
      payment: null,
    });

    try {
      // The selected method and mock details are passed so the payment flow
      // feels closer to a real checkout without using live integrations.
      const response = await simulatePayment({
        method: getMethodLabel(),
      });
      const nextStatus = statusContent[response.status] || statusContent.PENDING;

      setPaymentStatus({
        variant: nextStatus.variant,
        message: `${nextStatus.message} via ${getMethodLabel()}`,
        payment: response,
      });
    } catch (error) {
      setPaymentStatus({
        variant: "error",
        message: error.message || "Payment request failed",
        payment: null,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleRetryPayment() {
    setPaymentStatus({
      variant: "idle",
      message: "Ready to try payment again",
      payment: null,
    });
  }

  return (
    <main style={checkoutStyles.page}>
      <section style={checkoutStyles.shell}>
        <div style={checkoutStyles.glow} aria-hidden="true" />

        <article style={checkoutStyles.card}>
          <div style={checkoutStyles.header}>
            <div style={checkoutStyles.headerLeft}>
              <button type="button" onClick={onBack} style={checkoutStyles.backButton}>
                Back to cart
              </button>
              <span style={checkoutStyles.badge}>BuildX Payments</span>
              <h1 style={checkoutStyles.heading}>Checkout</h1>
              <p style={checkoutStyles.subtext}>Choose a payment method and pay</p>
            </div>

            <span style={checkoutStyles.securePill}>Secure Demo</span>
          </div>

          <div style={checkoutStyles.layout}>
            <div style={checkoutStyles.leftColumn}>
              <section style={checkoutStyles.productCard}>
                <div style={checkoutStyles.productTop}>
                  <div>
                    <p style={checkoutStyles.productLabel}>Product</p>
                    <h2 style={checkoutStyles.productTitle}>
                      {primaryItem?.title || "BuildX Starter Plan"}
                    </h2>
                    <p style={checkoutStyles.productMeta}>
                      {itemCount} item(s) in order
                    </p>
                  </div>

                  <span style={checkoutStyles.chip}>Test Mode</span>
                </div>

                <div style={checkoutStyles.divider} />

                <div style={checkoutStyles.amountRow}>
                  <div>
                    <p style={checkoutStyles.amountLabel}>Amount</p>
                    <p style={checkoutStyles.amountValue}>${subtotal.toFixed(2)}</p>
                  </div>

                  <div style={checkoutStyles.orderWrap}>
                    <p style={checkoutStyles.orderLabel}>Order ID</p>
                    <p style={checkoutStyles.orderValue}>{orderId}</p>
                  </div>
                </div>
              </section>

              <PaymentMethodSelector
                methods={paymentMethods}
                selectedMethod={selectedMethod}
                onSelect={handleMethodSelect}
              />

              <PaymentMethodFields
                selectedMethod={selectedMethod}
                upiId={upiId}
                cardDetails={cardDetails}
                onUpiChange={setUpiId}
                onCardChange={handleCardChange}
              />
            </div>

            <div style={checkoutStyles.rightColumn}>
              <section style={checkoutStyles.summaryCard}>
                {cartItems.map((item) => (
                  <div key={item.id} style={checkoutStyles.summaryRow}>
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}

                <div
                  style={{
                    ...checkoutStyles.summaryRow,
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(148, 163, 184, 0.12)",
                    color: "#f8fafc",
                  }}
                >
                  <span>Subtotal</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
              </section>

              <PaymentStatus
                variant={paymentStatus.variant}
                message={paymentStatus.message}
                payment={paymentStatus.payment}
                onRetry={paymentStatus.variant === "error" ? handleRetryPayment : null}
              />

              <div style={checkoutStyles.buttonWrap}>
                <PaymentButton
                  label={`Pay with ${getMethodLabel()}`}
                  onClick={handleMockPayment}
                  disabled={cartItems.length === 0}
                  loading={isLoading}
                  futureAction="mock-payment-request"
                />

                {isLoading ? (
                  <div style={checkoutStyles.loaderWrap}>
                    <Loader label="Processing payment" size="small" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default Checkout;
