const toneMap = {
  idle: {
    title: "Ready to test",
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    accentColor: "#334155",
  },
  loading: {
    title: "Payment in progress",
    backgroundColor: "#eff6ff",
    borderColor: "#93c5fd",
    accentColor: "#1d4ed8",
  },
  success: {
    title: "Payment successful",
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
    accentColor: "#166534",
  },
  error: {
    title: "Payment failed",
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    accentColor: "#b91c1c",
  },
  pending: {
    title: "Payment pending",
    backgroundColor: "#fffbeb",
    borderColor: "#fcd34d",
    accentColor: "#b45309",
  },
};

function PaymentStatus({ variant = "idle", message, payment, onRetry }) {
  const tone = toneMap[variant] || toneMap.idle;

  return (
    <section
      style={{
        padding: "18px",
        borderRadius: "18px",
        border: `1px solid ${tone.borderColor}`,
        backgroundColor: tone.backgroundColor,
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "0.85rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: tone.accentColor,
        }}
      >
        {tone.title}
      </p>

      <p style={{ margin: 0, color: "#334155", lineHeight: 1.6 }}>{message}</p>

      {payment ? (
        <div
          style={{
            marginTop: "14px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(15, 23, 42, 0.08)",
            display: "grid",
            gap: "6px",
            color: "#475569",
            fontSize: "0.95rem",
          }}
        >
          {/* Keeping the response visible helps new developers understand
              how the UI maps to API-style payment data. */}
          <div>Success: {payment.success ? "true" : "false"}</div>
          <div>Payment ID: {payment.paymentId}</div>
          <div>Status: {payment.status}</div>
        </div>
      ) : null}

      {variant === "error" && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: "16px",
            border: "none",
            borderRadius: "12px",
            padding: "12px 16px",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Retry Payment
        </button>
      ) : null}
    </section>
  );
}

export default PaymentStatus;
