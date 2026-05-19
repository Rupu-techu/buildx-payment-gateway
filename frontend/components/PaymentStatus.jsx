const toneMap = {
  idle: {
    label: "Status",
    title: "Ready",
    background:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.52))",
    borderColor: "rgba(148, 163, 184, 0.12)",
    accentColor: "#cbd5e1",
  },
  loading: {
    label: "Status",
    title: "Processing",
    background:
      "linear-gradient(180deg, rgba(12, 74, 110, 0.4), rgba(15, 23, 42, 0.55))",
    borderColor: "rgba(96, 165, 250, 0.22)",
    accentColor: "#93c5fd",
  },
  success: {
    label: "Status",
    title: "Success",
    background:
      "linear-gradient(180deg, rgba(6, 78, 59, 0.42), rgba(15, 23, 42, 0.55))",
    borderColor: "rgba(52, 211, 153, 0.24)",
    accentColor: "#6ee7b7",
  },
  error: {
    label: "Status",
    title: "Failed",
    background:
      "linear-gradient(180deg, rgba(127, 29, 29, 0.38), rgba(15, 23, 42, 0.55))",
    borderColor: "rgba(248, 113, 113, 0.24)",
    accentColor: "#fca5a5",
  },
  pending: {
    label: "Status",
    title: "Pending",
    background:
      "linear-gradient(180deg, rgba(120, 53, 15, 0.42), rgba(15, 23, 42, 0.55))",
    borderColor: "rgba(251, 191, 36, 0.24)",
    accentColor: "#fcd34d",
  },
};

function PaymentStatus({ variant = "idle", message, payment, onRetry }) {
  const tone = toneMap[variant] || toneMap.idle;

  return (
    <section
      style={{
        padding: "20px",
        borderRadius: "22px",
        border: `1px solid ${tone.borderColor}`,
        background: tone.background,
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {tone.label}
          </p>
          <h3
            style={{
              margin: "8px 0 0",
              color: "#f8fafc",
              fontSize: "1.05rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {tone.title}
          </h3>
        </div>

        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "999px",
            backgroundColor: tone.accentColor,
            boxShadow: `0 0 22px ${tone.accentColor}`,
            flexShrink: 0,
          }}
        />
      </div>

      <p
        style={{
          margin: "12px 0 0",
          color: "#cbd5e1",
          lineHeight: 1.5,
          fontSize: "0.94rem",
        }}
      >
        {message}
      </p>

      {payment ? (
        <div
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(148, 163, 184, 0.12)",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          {/* Keeping these fields grouped makes the payment response feel
              product-like while still exposing the mock API structure. */}
          <div>
            <p style={metaLabelStyle}>Result</p>
            <p style={metaValueStyle}>{payment.success ? "Approved" : "Declined"}</p>
          </div>
          <div>
            <p style={metaLabelStyle}>Payment ID</p>
            <p style={metaValueStyle}>{payment.paymentId}</p>
          </div>
          <div>
            <p style={metaLabelStyle}>State</p>
            <p style={metaValueStyle}>{payment.status}</p>
          </div>
        </div>
      ) : null}

      {variant === "error" && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: "16px",
            border: "1px solid rgba(248, 250, 252, 0.12)",
            borderRadius: "14px",
            padding: "11px 14px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "#f8fafc",
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

const metaLabelStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const metaValueStyle = {
  margin: "8px 0 0",
  color: "#f8fafc",
  fontSize: "0.9rem",
  fontWeight: 600,
  wordBreak: "break-word",
};

export default PaymentStatus;
