const toneMap = {
  idle: {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    title: "Ready to test",
  },
  loading: {
    backgroundColor: "#eff6ff",
    borderColor: "#93c5fd",
    title: "Payment in progress",
  },
  success: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
    title: "Payment successful",
  },
  error: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    title: "Payment failed",
  },
  pending: {
    backgroundColor: "#fffbeb",
    borderColor: "#fcd34d",
    title: "Payment pending",
  },
};

function PaymentStatus({ variant = "idle", message, paymentDetails }) {
  const tone = toneMap[variant] || toneMap.idle;

  return (
    <section
      style={{
        padding: "1rem",
        borderRadius: "0.9rem",
        border: `1px solid ${tone.borderColor}`,
        backgroundColor: tone.backgroundColor,
      }}
    >
      <h2
        style={{
          margin: "0 0 0.5rem",
          fontSize: "1rem",
          color: "#0f172a",
        }}
      >
        {tone.title}
      </h2>

      <p style={{ margin: 0, color: "#334155", lineHeight: 1.6 }}>
        {message}
      </p>

      {paymentDetails ? (
        <div
          style={{
            marginTop: "0.9rem",
            paddingTop: "0.9rem",
            borderTop: "1px solid rgba(15, 23, 42, 0.08)",
            color: "#475569",
            fontSize: "0.95rem",
            lineHeight: 1.7,
          }}
        >
          <div>Order ID: {paymentDetails.order_id || "Not available yet"}</div>
          <div>Payment ID: {paymentDetails.payment_id || "Not available yet"}</div>
          <div>Status: {paymentDetails.status || "Not available yet"}</div>
          {paymentDetails.updated_at ? (
            <div>Updated At: {paymentDetails.updated_at}</div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default PaymentStatus;
