import { useState } from "react";

import Loader from "../components/Loader.jsx";
import PaymentButton from "../components/PaymentButton.jsx";
import PaymentStatus from "../components/PaymentStatus.jsx";
import { simulatePayment } from "../services/paymentService.js";

const checkoutStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    background:
      "linear-gradient(180deg, #f4f7fb 0%, #e8eef7 52%, #f8fafc 100%)",
  },
  layout: {
    width: "100%",
    maxWidth: "1040px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    alignItems: "stretch",
  },
  introCard: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
  },
  checkoutCard: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 24px 50px rgba(15, 23, 42, 0.1)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 14px",
    borderRadius: "999px",
    backgroundColor: "#e8f0ff",
    color: "#1d4ed8",
    fontSize: "0.85rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
  },
  title: {
    margin: "18px 0 12px",
    fontSize: "clamp(2rem, 4vw, 2.9rem)",
    lineHeight: 1.1,
    color: "#0f172a",
  },
  lead: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "1rem",
  },
  featureList: {
    display: "grid",
    gap: "14px",
    marginTop: "28px",
  },
  featureItem: {
    padding: "14px 16px",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    lineHeight: 1.5,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  cardLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.92rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  statusPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: "#ecfdf3",
    color: "#166534",
    fontSize: "0.82rem",
    fontWeight: 700,
  },
  productCard: {
    padding: "20px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    color: "#ffffff",
  },
  productMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "28px",
  },
  productName: {
    margin: "0 0 10px",
    fontSize: "1.3rem",
  },
  productDescription: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.6,
  },
  productTag: {
    alignSelf: "flex-start",
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    color: "#f8fafc",
    fontSize: "0.82rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    color: "#cbd5e1",
    fontSize: "0.92rem",
  },
  amountWrap: {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "18px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  amountLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.95rem",
  },
  amountValue: {
    margin: "10px 0 6px",
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  amountNote: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
  },
  buttonWrap: {
    marginTop: "24px",
  },
  helperText: {
    margin: "14px 0 0",
    color: "#64748b",
    fontSize: "0.92rem",
    lineHeight: 1.6,
  },
  loaderWrap: {
    marginTop: "18px",
    padding: "14px 16px",
    borderRadius: "16px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
  },
};

const initialStatus = {
  variant: "idle",
  message: "Click Pay Now to simulate a frontend payment response.",
  payment: null,
};

const statusContent = {
  SUCCESS: {
    variant: "success",
    message: "Payment completed successfully. The mock transaction was approved.",
  },
  FAILED: {
    variant: "error",
    message: "Payment failed in the demo flow. You can retry the payment safely.",
  },
  PENDING: {
    variant: "pending",
    message:
      "Payment is pending. The request was created, but final confirmation has not arrived yet.",
  },
};

function Checkout() {
  const paymentSummary = {
    title: "BuildX Starter Plan",
    description:
      "A sample order screen for the Payment Gateway module. This keeps the first UI simple while we prepare the real payment flow.",
    amount: "$499.00",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(initialStatus);

  async function handleMockPayment() {
    setIsLoading(true);
    setPaymentStatus({
      variant: "loading",
      message: "Sending mock payment request and waiting for a sample response...",
      payment: null,
    });

    try {
      // The service returns a fake response after a short delay so the UI
      // behaves like a real API-driven checkout flow.
      const response = await simulatePayment();
      const nextStatus = statusContent[response.status] || statusContent.PENDING;

      setPaymentStatus({
        variant: nextStatus.variant,
        message: nextStatus.message,
        payment: response,
      });
    } catch (error) {
      setPaymentStatus({
        variant: "error",
        message:
          error.message || "The mock payment request could not be completed.",
        payment: null,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleRetryPayment() {
    setPaymentStatus(initialStatus);
  }

  return (
    <main style={checkoutStyles.page}>
      <section style={checkoutStyles.layout}>
        <article style={checkoutStyles.introCard}>
          <span style={checkoutStyles.badge}>Payment Gateway Module</span>
          <h1 style={checkoutStyles.title}>Build a clean checkout experience.</h1>
          <p style={checkoutStyles.lead}>
            This screen now includes a mock payment interaction flow with
            loading, sample API-style responses, and reusable status handling
            components for beginner-friendly development.
          </p>

          <div style={checkoutStyles.featureList}>
            <div style={checkoutStyles.featureItem}>
              Clicking the payment button simulates a real request/response
              cycle.
            </div>
            <div style={checkoutStyles.featureItem}>
              Success, failed, and pending states each render different user
              feedback.
            </div>
            <div style={checkoutStyles.featureItem}>
              The retry action appears only when the payment fails, keeping the
              flow simple and focused.
            </div>
          </div>
        </article>

        <article style={checkoutStyles.checkoutCard}>
          <div style={checkoutStyles.cardHeader}>
            <p style={checkoutStyles.cardLabel}>Checkout</p>
            <span style={checkoutStyles.statusPill}>Secure Demo</span>
          </div>

          <div style={checkoutStyles.productCard}>
            <div style={checkoutStyles.productMeta}>
              <div>
                <h2 style={checkoutStyles.productName}>{paymentSummary.title}</h2>
                <p style={checkoutStyles.productDescription}>
                  {paymentSummary.description}
                </p>
              </div>
              <span style={checkoutStyles.productTag}>Mock Product</span>
            </div>

            <div style={checkoutStyles.cardFooter}>
              <span>Order ID: DEMO-001</span>
              <span>Mode: Test</span>
            </div>
          </div>

          <div style={checkoutStyles.amountWrap}>
            <p style={checkoutStyles.amountLabel}>Payment Amount</p>
            <p style={checkoutStyles.amountValue}>{paymentSummary.amount}</p>
            <p style={checkoutStyles.amountNote}>
              No real charge will happen here. This button only simulates a
              payment response for frontend testing.
            </p>
          </div>

          <div style={checkoutStyles.buttonWrap}>
            <PaymentButton
              label="Pay Now"
              onClick={handleMockPayment}
              disabled={false}
              loading={isLoading}
              futureAction="mock-payment-request"
            />
          </div>

          {isLoading ? (
            <div style={checkoutStyles.loaderWrap}>
              <Loader label="Processing your mock payment..." />
            </div>
          ) : null}

          <div style={{ marginTop: "18px" }}>
            <PaymentStatus
              variant={paymentStatus.variant}
              message={paymentStatus.message}
              payment={paymentStatus.payment}
              onRetry={paymentStatus.variant === "error" ? handleRetryPayment : null}
            />
          </div>

          <p style={checkoutStyles.helperText}>
            Next step: replace the mock service with your real order creation
            and payment verification API calls when the backend is ready.
          </p>
        </article>
      </section>
    </main>
  );
}

export default Checkout;
