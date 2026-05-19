function PaymentButton({ isLoading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      style={{
        width: "100%",
        padding: "0.9rem 1rem",
        border: "none",
        borderRadius: "0.75rem",
        backgroundColor: isLoading ? "#94a3b8" : "#0f172a",
        color: "#ffffff",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: isLoading ? "not-allowed" : "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      {isLoading ? "Processing Payment..." : "Pay Now"}
    </button>
  );
}

export default PaymentButton;
