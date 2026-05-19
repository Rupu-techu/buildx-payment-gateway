import { useState } from "react";

import CheckoutStepper from "../components/CheckoutStepper.jsx";
import Loader from "../components/Loader.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import PaymentButton from "../components/PaymentButton.jsx";
import PaymentMethodFields from "../components/PaymentMethodFields.jsx";
import PaymentMethodSelector from "../components/PaymentMethodSelector.jsx";
import PaymentStatus from "../components/PaymentStatus.jsx";
import { simulatePayment } from "../services/paymentService.js";

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

const initialStatus = {
  variant: "idle",
  message: "Select a payment method to continue",
  payment: null,
};

function Payment({
  cartItems,
  subtotal,
  pricing,
  orderId,
  paymentMethods,
  selectedMethod,
  couponCode,
  appliedCoupon,
  upiId,
  cardDetails,
  selectedBank,
  onBackToCheckout,
  onMethodSelect,
  onCouponChange,
  onApplyCoupon,
  onUpiChange,
  onCardChange,
  onBankChange,
  onPaymentSuccess,
  isCompact = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(initialStatus);
  const primaryItem = cartItems[0];
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  function handleMethodSelect(methodId) {
    onMethodSelect(methodId);
    setPaymentStatus({
      variant: "idle",
      message: "Payment method updated",
      payment: null,
    });
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
        cardDetails.name.trim().length > 0 &&
        cardDetails.number.trim().length > 0 &&
        cardDetails.expiry.trim().length > 0 &&
        cardDetails.cvv.trim().length > 0
      );
    }

    if (selectedMethod === "NET_BANKING") {
      return selectedBank.trim().length > 0;
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
            : selectedMethod === "CARD"
              ? "Complete the mock card fields before continuing"
              : "Choose a bank before continuing",
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
      const response = await simulatePayment({
        method:
          selectedMethod === "NET_BANKING"
            ? `${getMethodLabel()} - ${selectedBank}`
            : getMethodLabel(),
      });
      const nextStatus = statusContent[response.status] || statusContent.PENDING;

      setPaymentStatus({
        variant: nextStatus.variant,
        message: `${nextStatus.message} via ${getMethodLabel()}`,
        payment: response,
      });

      if (response.status === "SUCCESS") {
        onPaymentSuccess({
          transactionId: response.paymentId,
          method:
            selectedMethod === "NET_BANKING"
              ? `${getMethodLabel()} - ${selectedBank}`
              : getMethodLabel(),
          amount: formatCurrency(pricing.total),
          orderId,
        });
      }
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
    <main style={paymentStyles.page}>
      <section style={paymentStyles.shell}>
        <div style={paymentStyles.glow} aria-hidden="true" />

        <article style={paymentStyles.card}>
          <div style={paymentStyles.header}>
            <div style={paymentStyles.headerLeft}>
              <button
                type="button"
                onClick={onBackToCheckout}
                style={paymentStyles.backButton}
              >
                Back to Checkout
              </button>
              <span style={paymentStyles.badge}>BuildX Payments</span>
              <h1 style={paymentStyles.heading}>Complete your payment</h1>
              <p style={paymentStyles.subtext}>
                Confirm your method, finish securely, and unlock your access the moment
                payment succeeds.
              </p>
            </div>

            <span style={paymentStyles.securePill}>Secure Demo</span>
          </div>

          <CheckoutStepper activeStep="payment" compact={isCompact} />

          <div
            style={{
              ...paymentStyles.layout,
              gridTemplateColumns: isCompact
                ? "minmax(0, 1fr)"
                : "minmax(0, 1.05fr) minmax(300px, 0.95fr)",
            }}
          >
            <div style={paymentStyles.leftColumn}>
              <section style={paymentStyles.productCard}>
                <div style={paymentStyles.productTop}>
                  <div>
                    <p style={paymentStyles.productLabel}>Order</p>
                    <h2 style={paymentStyles.productTitle}>
                      {primaryItem?.title || "BuildX Starter Plan"}
                    </h2>
                    <p style={paymentStyles.productMeta}>{itemCount} item(s) in order</p>
                  </div>

                  <span style={paymentStyles.chip}>Payment Step</span>
                </div>

                <div style={paymentStyles.divider} />

                <div style={paymentStyles.amountRow}>
                  <div>
                    <p style={paymentStyles.amountLabel}>Payable now</p>
                    <p style={paymentStyles.amountValue}>{formatCurrency(pricing.total)}</p>
                  </div>

                  <div style={paymentStyles.orderWrap}>
                    <p style={paymentStyles.orderLabel}>Order ID</p>
                    <p style={paymentStyles.orderValue}>{orderId}</p>
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
                selectedBank={selectedBank}
                onUpiChange={onUpiChange}
                onCardChange={onCardChange}
                onBankChange={onBankChange}
              />
            </div>

            <div style={paymentStyles.rightColumn}>
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                pricing={pricing}
                couponCode={couponCode}
                appliedCoupon={appliedCoupon}
                onCouponChange={onCouponChange}
                onApplyCoupon={onApplyCoupon}
              />

              <PaymentStatus
                variant={paymentStatus.variant}
                message={paymentStatus.message}
                payment={paymentStatus.payment}
                onRetry={paymentStatus.variant === "error" ? handleRetryPayment : null}
              />

              <div style={paymentStyles.buttonWrap}>
                <PaymentButton
                  label={`Pay with ${getMethodLabel()}`}
                  onClick={handleMockPayment}
                  disabled={cartItems.length === 0}
                  loading={isLoading}
                  futureAction="mock-payment-request"
                />

                {isLoading ? (
                  <div style={paymentStyles.loaderWrap}>
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const paymentStyles = {
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
    maxWidth: "1140px",
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
    display: "grid",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "grid",
    gap: "8px",
  },
  backButton: {
    border: "1px solid rgba(125, 211, 252, 0.22)",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(15, 23, 42, 0.36)",
    color: "#dbeafe",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    width: "fit-content",
    transition: "transform 180ms ease, border-color 180ms ease",
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
    maxWidth: "560px",
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
    flexWrap: "wrap",
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

export default Payment;
