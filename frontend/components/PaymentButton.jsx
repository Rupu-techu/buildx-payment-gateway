function PaymentButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  futureAction = "payment-request",
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      data-future-action={futureAction}
      aria-busy={loading}
      style={{
        width: "100%",
        border: "none",
        borderRadius: "16px",
        padding: "16px 20px",
        background: isDisabled
          ? "#94a3b8"
          : "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
        color: "#ffffff",
        fontSize: "1rem",
        fontWeight: 700,
        letterSpacing: "0.01em",
        cursor: isDisabled ? "not-allowed" : "pointer",
        boxShadow: isDisabled
          ? "none"
          : "0 18px 32px rgba(29, 78, 216, 0.24)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* This label can later switch to API states like "Creating order..." */}
      {loading ? "Preparing payment..." : label}
    </button>
  );
}

export default PaymentButton;
