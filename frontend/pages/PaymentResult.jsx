import { useEffect, useState } from "react";

import ToastMessage from "../components/ToastMessage.jsx";
import { fetchTransactionHistory } from "../services/paymentService.js";

const resultToneMap = {
  success: {
    badge: "Payment Successful",
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
    accentColor: "#166534",
  },
  error: {
    badge: "Payment Failed",
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    accentColor: "#b91c1c",
  },
  pending: {
    badge: "Payment Pending",
    backgroundColor: "#fffbeb",
    borderColor: "#fcd34d",
    accentColor: "#b45309",
  },
};

function PaymentResult({ paymentResult, onRetry }) {
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const historyResponse = await fetchTransactionHistory();
        setHistory(historyResponse.data.transactions || []);
      } catch (error) {
        setHistoryError(
          error.message || "Could not load transaction history right now."
        );
      }
    }

    loadHistory();
  }, []);

  const tone = resultToneMap[paymentResult.variant] || resultToneMap.pending;
  const details = paymentResult.paymentDetails || {};

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1rem",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)",
        fontFamily: "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          display: "grid",
          gap: "1rem",
        }}
      >
        <article
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "1.2rem",
            padding: "1.5rem",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "0.35rem 0.7rem",
              borderRadius: "999px",
              backgroundColor: tone.backgroundColor,
              border: `1px solid ${tone.borderColor}`,
              color: tone.accentColor,
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            {tone.badge}
          </div>

          <h1 style={{ margin: "1rem 0 0.6rem", color: "#0f172a" }}>
            {paymentResult.title}
          </h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            {paymentResult.message}
          </p>

          <div style={{ marginTop: "1rem" }}>
            <ToastMessage
              message={paymentResult.apiMessage}
              variant={
                paymentResult.variant === "pending"
                  ? "warning"
                  : paymentResult.variant === "error"
                    ? "error"
                    : "success"
              }
            />
          </div>

          <div
            style={{
              marginTop: "1.25rem",
              padding: "1rem",
              borderRadius: "0.95rem",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#334155",
              lineHeight: 1.8,
            }}
          >
            <div>Order ID: {details.order_id || "Not available"}</div>
            <div>Payment ID: {details.payment_id || "Not available"}</div>
            <div>Status: {details.status || "Not available"}</div>
            <div>Amount: ${Number(details.amount || 0).toFixed(2)}</div>
            <div>Currency: {details.currency || "USD"}</div>
            <div>Created At: {details.created_at || "Not available"}</div>
            <div>Updated At: {details.updated_at || "Not available"}</div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginTop: "1.25rem",
            }}
          >
            <button
              type="button"
              onClick={onRetry}
              style={{
                padding: "0.85rem 1.1rem",
                borderRadius: "0.8rem",
                border: "none",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Retry Payment
            </button>
          </div>
        </article>

        <article
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "1.2rem",
            padding: "1.5rem",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
          }}
        >
          <h2 style={{ margin: "0 0 0.85rem", color: "#0f172a" }}>
            Recent Transaction History
          </h2>

          <ToastMessage message={historyError} variant="error" />

          {history.length === 0 && !historyError ? (
            <p style={{ margin: 0, color: "#64748b" }}>
              No mock transactions recorded yet.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {history.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.payment_id}
                  style={{
                    padding: "0.9rem 1rem",
                    borderRadius: "0.9rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    color: "#334155",
                    lineHeight: 1.7,
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>
                    {transaction.payment_id}
                  </div>
                  <div>Order ID: {transaction.order_id}</div>
                  <div>Status: {transaction.status}</div>
                  <div>
                    Amount: ${Number(transaction.amount || 0).toFixed(2)}{" "}
                    {transaction.currency || "USD"}
                  </div>
                  <div>Updated At: {transaction.updated_at}</div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default PaymentResult;
