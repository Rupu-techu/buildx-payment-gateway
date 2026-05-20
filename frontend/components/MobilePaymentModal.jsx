import Loader from "./Loader.jsx";

/**
 * Mobile payment processing modal
 * Simulates direct app opening/redirect for mobile wallet payments
 * No QR code, just processing animation
 */
function MobilePaymentModal({
  open = false,
  methodLabel = "Google Pay",
  amount = "₹0",
  orderId = "",
  stage = "processing", // 'processing' | 'redirecting' | 'success' | 'failed'
  compact = false,
  onClose,
  onRetry,
}) {
  if (!open) {
    return null;
  }

  const getStageContent = () => {
    switch (stage) {
      case "redirecting":
        return {
          title: `Opening ${methodLabel}`,
          message: `You'll be redirected to ${methodLabel} to complete your payment. Don't close this window.`,
          showLoader: true,
          actionLabel: null,
        };
      case "processing":
        return {
          title: "Processing Payment",
          message: "Verifying your payment details with the payment gateway",
          showLoader: true,
          actionLabel: null,
        };
      case "success":
        return {
          title: "Payment Successful",
          message: `Your ₹${amount} payment has been processed. Access is being activated.`,
          showLoader: false,
          actionLabel: null,
          variant: "success",
        };
      case "failed":
        return {
          title: "Payment Failed",
          message: "Your payment could not be completed. Please try again.",
          showLoader: false,
          actionLabel: "Try Again",
          variant: "error",
        };
      default:
        return {
          title: "Payment",
          message: "Processing",
          showLoader: true,
          actionLabel: null,
        };
    }
  };

  const content = getStageContent();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 10000,
        padding: "16px",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={methodLabel}
    >
      <div
        style={{
          display: "grid",
          gap: "24px",
          padding: compact ? "24px" : "32px",
          borderRadius: "32px",
          background:
            content.variant === "success"
              ? "linear-gradient(180deg, rgba(6, 78, 59, 0.42), rgba(15, 23, 42, 0.88))"
              : content.variant === "error"
                ? "linear-gradient(180deg, rgba(127, 29, 29, 0.38), rgba(15, 23, 42, 0.88))"
                : "linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(8, 15, 27, 0.96))",
          border:
            content.variant === "success"
              ? "1px solid rgba(52, 211, 153, 0.24)"
              : content.variant === "error"
                ? "1px solid rgba(248, 113, 113, 0.24)"
                : "1px solid rgba(96, 165, 250, 0.18)",
          boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
          backdropFilter: "blur(18px)",
          color: "#f8fafc",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        {/* Header */}
        <div style={{ display: "grid", gap: "12px", textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: compact ? "1.4rem" : "1.8rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f8fafc",
            }}
          >
            {content.title}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#cbd5e1",
              lineHeight: 1.6,
            }}
          >
            {content.message}
          </p>
        </div>

        {/* Loader or Status */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {content.showLoader ? (
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "3px solid rgba(96, 165, 250, 0.2)",
                borderTopColor: "#60a5fa",
                animation: "spin 1s linear infinite",
              }}
              aria-hidden="true"
            />
          ) : (
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
              aria-hidden="true"
            >
              {content.variant === "success" ? "✓" : "✕"}
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div
          style={{
            display: "grid",
            gap: "12px",
            padding: "16px",
            borderRadius: "18px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(148, 163, 184, 0.08)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "0.84rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            Amount
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#f8fafc",
            }}
          >
            {amount}
          </p>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "0.8rem",
            }}
          >
            Order ID: {orderId}
          </p>
        </div>

        {/* Close/Action Button */}
        {(stage === "failed" && onRetry) || stage === "success" ? (
          <button
            type="button"
            onClick={stage === "failed" ? onRetry : onClose}
            style={{
              width: "100%",
              padding: "16px 20px",
              borderRadius: "18px",
              border: "none",
              background:
                stage === "success"
                  ? "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)"
                  : "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
              color: "#020617",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 16px 30px rgba(15, 23, 42, 0.22)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 20px 38px rgba(15, 23, 42, 0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 16px 30px rgba(15, 23, 42, 0.22)";
            }}
          >
            {stage === "failed" ? "Try Again" : "Continue"}
          </button>
        ) : null}
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default MobilePaymentModal;
