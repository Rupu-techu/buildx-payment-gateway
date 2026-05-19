function PaymentSuccess({
  paymentDetails,
  onGoToDashboard,
  onBackToHome,
  onDownloadReceipt,
}) {
  return (
    <main style={successStyles.page}>
      <section style={successStyles.shell}>
        <div style={successStyles.glow} aria-hidden="true" />

        <article style={successStyles.card}>
          <style>{`
            @keyframes success-pop {
              0% { transform: scale(0.82); opacity: 0; }
              60% { transform: scale(1.06); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }

            @keyframes success-draw {
              from { stroke-dashoffset: 48; }
              to { stroke-dashoffset: 0; }
            }

            @keyframes success-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
          `}</style>

          <div style={successStyles.hero}>
            <div
              style={{
                ...successStyles.checkWrap,
                animation: "success-pop 480ms ease-out forwards, success-float 3.2s ease-in-out 520ms infinite",
              }}
            >
              <svg viewBox="0 0 64 64" style={successStyles.checkSvg} aria-hidden="true">
                <circle cx="32" cy="32" r="30" style={successStyles.checkCircle} />
                <path
                  d="M20 33.5 28 41.5 45 24.5"
                  style={{
                    ...successStyles.checkPath,
                    animation: "success-draw 520ms ease-out 220ms forwards",
                  }}
                />
              </svg>
            </div>

            <span style={successStyles.badge}>Access Unlocked</span>
            <h1 style={successStyles.heading}>Payment successful</h1>
            <p style={successStyles.subtext}>
              Your digital subscription is active and your learning access is ready
              right away.
            </p>
          </div>

          <section style={successStyles.summaryCard}>
            <div style={successStyles.amountBlock}>
              <p style={successStyles.label}>Paid Amount</p>
              <p style={successStyles.amountValue}>{paymentDetails.amount}</p>
            </div>

            <div style={successStyles.metaGrid}>
              <article style={successStyles.metaCard}>
                <p style={successStyles.label}>Transaction ID</p>
                <p style={successStyles.metaValue}>{paymentDetails.transactionId}</p>
              </article>
              <article style={successStyles.metaCard}>
                <p style={successStyles.label}>Payment Method</p>
                <p style={successStyles.metaValue}>{paymentDetails.method}</p>
              </article>
              <article style={successStyles.metaCard}>
                <p style={successStyles.label}>Order Reference</p>
                <p style={successStyles.metaValue}>{paymentDetails.orderId}</p>
              </article>
            </div>

            <div style={successStyles.unlockCard}>
              <p style={successStyles.unlockTitle}>What happens next</p>
              <p style={successStyles.unlockText}>
                Subscription activates immediately. You can now continue to your
                dashboard, review your receipt, or head back home.
              </p>
            </div>
          </section>

          <div style={successStyles.actions}>
            <button
              type="button"
              onClick={onGoToDashboard}
              style={successStyles.primaryButton}
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={onDownloadReceipt}
              style={successStyles.secondaryButton}
            >
              Download Receipt
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              style={successStyles.ghostButton}
            >
              Back to Home
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}

const successStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at top, rgba(34, 197, 94, 0.14), transparent 26%), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.12), transparent 24%), linear-gradient(180deg, #06121f 0%, #0b1728 48%, #08111d 100%)",
  },
  shell: {
    position: "relative",
    width: "100%",
    maxWidth: "940px",
  },
  glow: {
    position: "absolute",
    inset: "-18px",
    borderRadius: "36px",
    background:
      "linear-gradient(135deg, rgba(74, 222, 128, 0.22), rgba(56, 189, 248, 0.14), rgba(16, 185, 129, 0.16))",
    filter: "blur(22px)",
    opacity: 0.85,
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    borderRadius: "34px",
    padding: "34px",
    background: "rgba(8, 15, 27, 0.82)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "0 30px 90px rgba(2, 6, 23, 0.56)",
    backdropFilter: "blur(18px)",
    color: "#f8fafc",
    display: "grid",
    gap: "24px",
  },
  hero: {
    display: "grid",
    justifyItems: "center",
    textAlign: "center",
    gap: "14px",
  },
  checkWrap: {
    width: "96px",
    height: "96px",
    display: "grid",
    placeItems: "center",
    borderRadius: "28px",
    background:
      "linear-gradient(145deg, rgba(16, 185, 129, 0.18), rgba(8, 15, 27, 0.42))",
    border: "1px solid rgba(74, 222, 128, 0.24)",
    boxShadow: "0 24px 48px rgba(16, 185, 129, 0.14)",
  },
  checkSvg: {
    width: "64px",
    height: "64px",
  },
  checkCircle: {
    fill: "rgba(34, 197, 94, 0.14)",
    stroke: "rgba(74, 222, 128, 0.4)",
    strokeWidth: 1.5,
  },
  checkPath: {
    fill: "none",
    stroke: "#86efac",
    strokeWidth: 4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: 48,
    strokeDashoffset: 48,
  },
  badge: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: "999px",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(52, 211, 153, 0.22)",
    color: "#86efac",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  heading: {
    margin: 0,
    fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
    lineHeight: 1,
    letterSpacing: "-0.05em",
    fontWeight: 800,
  },
  subtext: {
    margin: 0,
    maxWidth: "620px",
    color: "#a5b4c8",
    fontSize: "1rem",
    lineHeight: 1.7,
  },
  summaryCard: {
    display: "grid",
    gap: "18px",
    padding: "24px",
    borderRadius: "28px",
    background:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.58))",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },
  amountBlock: {
    display: "grid",
    gap: "8px",
  },
  label: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.76rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  amountValue: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "clamp(2rem, 6vw, 3rem)",
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: "-0.05em",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },
  metaCard: {
    display: "grid",
    gap: "8px",
    padding: "16px",
    borderRadius: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(148, 163, 184, 0.08)",
  },
  metaValue: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "0.96rem",
    fontWeight: 600,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  unlockCard: {
    display: "grid",
    gap: "8px",
    padding: "18px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(15, 23, 42, 0.3))",
    border: "1px solid rgba(74, 222, 128, 0.14)",
  },
  unlockTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "1rem",
    fontWeight: 700,
  },
  unlockText: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "0.92rem",
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
  },
  primaryButton: {
    minHeight: "54px",
    padding: "0 20px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
    color: "#020617",
    fontSize: "0.96rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    minHeight: "54px",
    padding: "0 20px",
    borderRadius: "16px",
    border: "1px solid rgba(52, 211, 153, 0.2)",
    background: "rgba(16, 185, 129, 0.08)",
    color: "#d1fae5",
    fontSize: "0.96rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostButton: {
    minHeight: "54px",
    padding: "0 20px",
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    background: "rgba(255, 255, 255, 0.03)",
    color: "#e2e8f0",
    fontSize: "0.96rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default PaymentSuccess;
