function Dashboard({ onBackHome }) {
  return (
    <main style={dashboardStyles.page}>
      <section style={dashboardStyles.shell}>
        <article style={dashboardStyles.card}>
          <span style={dashboardStyles.badge}>Learning Dashboard</span>
          <h1 style={dashboardStyles.heading}>Your access is live</h1>
          <p style={dashboardStyles.subtext}>
            This mock dashboard represents the post-purchase destination for a digital
            learning or SaaS subscription experience.
          </p>

          <div style={dashboardStyles.grid}>
            <article style={dashboardStyles.panel}>
              <p style={dashboardStyles.panelLabel}>Status</p>
              <p style={dashboardStyles.panelValue}>Subscription Active</p>
            </article>
            <article style={dashboardStyles.panel}>
              <p style={dashboardStyles.panelLabel}>Access</p>
              <p style={dashboardStyles.panelValue}>Instantly Unlocked</p>
            </article>
            <article style={dashboardStyles.panel}>
              <p style={dashboardStyles.panelLabel}>Next Step</p>
              <p style={dashboardStyles.panelValue}>Continue Learning</p>
            </article>
          </div>

          <button type="button" onClick={onBackHome} style={dashboardStyles.button}>
            Back to Home
          </button>
        </article>
      </section>
    </main>
  );
}

const dashboardStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at top, rgba(59, 130, 246, 0.14), transparent 24%), linear-gradient(180deg, #06121f 0%, #0b1728 48%, #08111d 100%)",
  },
  shell: {
    width: "100%",
    maxWidth: "980px",
  },
  card: {
    borderRadius: "32px",
    padding: "32px",
    background: "rgba(8, 15, 27, 0.82)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.52)",
    backdropFilter: "blur(18px)",
    color: "#f8fafc",
    display: "grid",
    gap: "22px",
  },
  badge: {
    display: "inline-flex",
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    border: "1px solid rgba(96, 165, 250, 0.2)",
    color: "#bfdbfe",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  heading: {
    margin: 0,
    fontSize: "clamp(2rem, 5vw, 3rem)",
    lineHeight: 1,
    letterSpacing: "-0.05em",
    fontWeight: 800,
  },
  subtext: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.98rem",
    lineHeight: 1.7,
    maxWidth: "640px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
  },
  panel: {
    display: "grid",
    gap: "8px",
    padding: "18px",
    borderRadius: "22px",
    background:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.54))",
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  panelLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.76rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  panelValue: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "1rem",
    fontWeight: 700,
  },
  button: {
    width: "fit-content",
    minHeight: "52px",
    padding: "0 18px",
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    background: "rgba(255, 255, 255, 0.04)",
    color: "#f8fafc",
    fontSize: "0.94rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default Dashboard;
