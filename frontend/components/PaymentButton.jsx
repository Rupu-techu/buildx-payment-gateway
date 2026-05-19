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
        minHeight: "58px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "18px",
        padding: "16px 20px",
        background: isDisabled
          ? "linear-gradient(135deg, #334155 0%, #475569 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
        color: "#020617",
        fontSize: "1rem",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        cursor: isDisabled ? "not-allowed" : "pointer",
        boxShadow: isDisabled
          ? "none"
          : "0 16px 30px rgba(15, 23, 42, 0.22)",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
      }}
      onMouseEnter={(event) => {
        if (!isDisabled) {
          event.currentTarget.style.transform = "translateY(-1px)";
          event.currentTarget.style.boxShadow =
            "0 20px 38px rgba(15, 23, 42, 0.28)";
          event.currentTarget.style.filter = "brightness(1.02)";
        }
      }}
      onMouseLeave={(event) => {
        if (!isDisabled) {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.boxShadow =
            "0 16px 30px rgba(15, 23, 42, 0.22)";
          event.currentTarget.style.filter = "brightness(1)";
        }
      }}
    >
      {/* This label can later switch to API states like "Creating order..." */}
      {loading ? "Processing..." : label}
    </button>
  );
}

export default PaymentButton;
