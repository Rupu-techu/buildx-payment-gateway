import Loader from "./Loader.jsx";

function DesktopWalletModal({
  open,
  methodLabel,
  amount,
  orderId,
  stage = "scan",
  onClose,
  onConfirm,
  onRetry,
}) {
  if (!open) {
    return null;
  }

  const brandTone =
    methodLabel === "PhonePe"
      ? {
          accent: "#c084fc",
          panel:
            "linear-gradient(180deg, rgba(88, 28, 135, 0.92), rgba(15, 23, 42, 0.96))",
        }
      : {
          accent: "#60a5fa",
          panel:
            "linear-gradient(180deg, rgba(30, 64, 175, 0.92), rgba(15, 23, 42, 0.96))",
        };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label={methodLabel}>
      <div style={{ ...modalStyle, background: brandTone.panel }}>
        <div style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>Desktop Payment</p>
            <h3 style={titleStyle}>{methodLabel} on your mobile app</h3>
          </div>

          <button type="button" onClick={onClose} style={closeButtonStyle}>
            x
          </button>
        </div>

        {stage === "scan" ? (
          <>
            <p style={bodyStyle}>
              Scan using mobile app to approve this payment. This mirrors a realistic
              desktop checkout where the final confirmation happens on your phone.
            </p>

            <div style={scanLayoutStyle}>
              <div style={qrCardStyle}>
                <div style={qrWrapStyle}>
                  <QrArt accent={brandTone.accent} />
                </div>
                <p style={metaLabelStyle}>Scan using mobile app</p>
                <p style={metaBodyStyle}>Open {methodLabel}, scan the QR, and approve.</p>
              </div>

              <div style={detailsCardStyle}>
                <div style={detailRowStyle}>
                  <span style={detailLabelStyle}>Amount</span>
                  <strong style={detailValueStyle}>{amount}</strong>
                </div>
                <div style={detailRowStyle}>
                  <span style={detailLabelStyle}>Order ID</span>
                  <strong style={detailValueStyle}>{orderId}</strong>
                </div>
                <div style={detailRowStyle}>
                  <span style={detailLabelStyle}>Method</span>
                  <strong style={detailValueStyle}>{methodLabel}</strong>
                </div>

                <div style={instructionCardStyle}>
                  <p style={instructionTitleStyle}>How this works</p>
                  <p style={instructionBodyStyle}>
                    1. Scan the code on mobile.
                    <br />
                    2. Complete the in-app confirmation.
                    <br />
                    3. Return here while we verify the payment.
                  </p>
                </div>
              </div>
            </div>

            <div style={actionsStyle}>
              <button type="button" onClick={onClose} style={secondaryButtonStyle}>
                Cancel
              </button>
              <button type="button" onClick={onConfirm} style={primaryButtonStyle}>
                I&apos;ve Completed Payment
              </button>
            </div>
          </>
        ) : null}

        {stage === "processing" || stage === "verifying" ? (
          <div style={centerStageStyle}>
            <div style={pulseOrbStyle(brandTone.accent)} />
            <Loader
              label={
                stage === "processing"
                  ? "Payment processing in app..."
                  : "Verifying payment with gateway..."
              }
            />
            <p style={bodyStyle}>
              Keep this window open while we finish the confirmation and secure
              activation.
            </p>
          </div>
        ) : null}

        {stage === "success" ? (
          <div style={centerStageStyle}>
            <div style={successBadgeStyle}>
              <svg viewBox="0 0 64 64" style={{ width: "62px", height: "62px" }}>
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="rgba(34, 197, 94, 0.14)"
                  stroke="rgba(74, 222, 128, 0.42)"
                  strokeWidth="2"
                />
                <path
                  d="M19 33 28 42 45 24"
                  fill="none"
                  stroke="#86efac"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4 style={successTitleStyle}>Payment verified</h4>
            <p style={bodyStyle}>Access Activated. We are redirecting you now.</p>
          </div>
        ) : null}

        {stage === "failed" ? (
          <div style={centerStageStyle}>
            <div style={failedBadgeStyle}>!</div>
            <h4 style={successTitleStyle}>Payment could not be verified</h4>
            <p style={bodyStyle}>
              The approval did not complete successfully. You can retry the QR flow.
            </p>
            <div style={actionsStyle}>
              <button type="button" onClick={onClose} style={secondaryButtonStyle}>
                Close
              </button>
              <button type="button" onClick={onRetry} style={primaryButtonStyle}>
                Retry QR Payment
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function QrArt({ accent }) {
  return (
    <svg viewBox="0 0 164 164" style={{ width: "100%", height: "100%" }} aria-hidden="true">
      <rect width="164" height="164" rx="24" fill="#ffffff" />
      <rect x="18" y="18" width="40" height="40" rx="8" fill={accent} />
      <rect x="106" y="18" width="40" height="40" rx="8" fill="#0f172a" />
      <rect x="18" y="106" width="40" height="40" rx="8" fill="#0f172a" />
      <rect x="30" y="30" width="16" height="16" rx="4" fill="#ffffff" />
      <rect x="118" y="30" width="16" height="16" rx="4" fill="#ffffff" />
      <rect x="30" y="118" width="16" height="16" rx="4" fill="#ffffff" />
      <rect x="72" y="22" width="10" height="10" rx="2" fill="#0f172a" />
      <rect x="86" y="22" width="10" height="10" rx="2" fill={accent} />
      <rect x="72" y="38" width="10" height="10" rx="2" fill={accent} />
      <rect x="88" y="40" width="18" height="18" rx="4" fill="#0f172a" />
      <rect x="72" y="60" width="34" height="10" rx="3" fill="#0f172a" />
      <rect x="62" y="76" width="12" height="12" rx="3" fill={accent} />
      <rect x="80" y="76" width="12" height="12" rx="3" fill="#0f172a" />
      <rect x="98" y="76" width="12" height="12" rx="3" fill={accent} />
      <rect x="116" y="76" width="12" height="12" rx="3" fill="#0f172a" />
      <rect x="62" y="94" width="48" height="10" rx="3" fill="#0f172a" />
      <rect x="78" y="112" width="12" height="12" rx="3" fill={accent} />
      <rect x="96" y="112" width="12" height="12" rx="3" fill="#0f172a" />
      <rect x="114" y="112" width="18" height="18" rx="4" fill={accent} />
      <rect x="70" y="130" width="44" height="10" rx="3" fill="#0f172a" />
    </svg>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "grid",
  placeItems: "center",
  padding: "20px",
  backgroundColor: "rgba(2, 6, 23, 0.72)",
  backdropFilter: "blur(12px)",
};

const modalStyle = {
  width: "min(860px, 100%)",
  borderRadius: "32px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 30px 90px rgba(2, 6, 23, 0.56)",
  color: "#f8fafc",
  padding: "28px",
  display: "grid",
  gap: "22px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
};

const eyebrowStyle = {
  margin: 0,
  color: "#93c5fd",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: "10px 0 0",
  fontSize: "1.6rem",
  fontWeight: 800,
  letterSpacing: "-0.03em",
};

const closeButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  color: "#f8fafc",
  cursor: "pointer",
};

const bodyStyle = {
  margin: 0,
  color: "#cbd5e1",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  textAlign: "center",
  maxWidth: "54ch",
};

const scanLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "18px",
  alignItems: "stretch",
};

const qrCardStyle = {
  display: "grid",
  gap: "14px",
  padding: "22px",
  borderRadius: "24px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  justifyItems: "center",
};

const qrWrapStyle = {
  width: "min(240px, 100%)",
  aspectRatio: "1 / 1",
  padding: "12px",
  borderRadius: "28px",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
};

const metaLabelStyle = {
  margin: 0,
  color: "#f8fafc",
  fontSize: "0.98rem",
  fontWeight: 700,
};

const metaBodyStyle = {
  margin: 0,
  color: "#cbd5e1",
  fontSize: "0.88rem",
  lineHeight: 1.6,
  textAlign: "center",
};

const detailsCardStyle = {
  display: "grid",
  gap: "12px",
  padding: "22px",
  borderRadius: "24px",
  backgroundColor: "rgba(2, 6, 23, 0.28)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
};

const detailRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const detailLabelStyle = {
  color: "#94a3b8",
  fontSize: "0.85rem",
};

const detailValueStyle = {
  color: "#f8fafc",
  fontSize: "0.95rem",
};

const instructionCardStyle = {
  marginTop: "6px",
  padding: "16px",
  borderRadius: "20px",
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.34))",
  border: "1px solid rgba(148, 163, 184, 0.1)",
};

const instructionTitleStyle = {
  margin: 0,
  color: "#f8fafc",
  fontSize: "0.92rem",
  fontWeight: 700,
};

const instructionBodyStyle = {
  margin: "8px 0 0",
  color: "#cbd5e1",
  fontSize: "0.86rem",
  lineHeight: 1.8,
};

const actionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryButtonStyle = {
  minHeight: "52px",
  padding: "0 18px",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
  color: "#020617",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  minHeight: "52px",
  padding: "0 18px",
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  color: "#e2e8f0",
  fontWeight: 700,
  cursor: "pointer",
};

const centerStageStyle = {
  minHeight: "340px",
  display: "grid",
  placeItems: "center",
  alignContent: "center",
  gap: "16px",
  justifyItems: "center",
};

const pulseOrbStyle = (accent) => ({
  width: "84px",
  height: "84px",
  borderRadius: "999px",
  background: `radial-gradient(circle, ${accent} 0%, rgba(255,255,255,0.08) 70%)`,
  boxShadow: `0 0 40px ${accent}55`,
  animation: "success-float 2.2s ease-in-out infinite",
});

const successBadgeStyle = {
  width: "92px",
  height: "92px",
  borderRadius: "28px",
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(145deg, rgba(16, 185, 129, 0.18), rgba(8, 15, 27, 0.42))",
  border: "1px solid rgba(74, 222, 128, 0.24)",
};

const failedBadgeStyle = {
  width: "92px",
  height: "92px",
  borderRadius: "28px",
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(145deg, rgba(239, 68, 68, 0.18), rgba(8, 15, 27, 0.42))",
  border: "1px solid rgba(248, 113, 113, 0.24)",
  color: "#fecaca",
  fontSize: "2rem",
  fontWeight: 800,
};

const successTitleStyle = {
  margin: 0,
  color: "#f8fafc",
  fontSize: "1.4rem",
  fontWeight: 800,
  letterSpacing: "-0.02em",
};

export default DesktopWalletModal;
