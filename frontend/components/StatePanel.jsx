function StatePanel({
  eyebrow = "State",
  title,
  message,
  variant = "neutral",
  actionLabel,
  onAction,
  children,
  compact = false,
}) {
  const tone = toneMap[variant] || toneMap.neutral;

  return (
    <section
      style={{
        display: "grid",
        gap: "16px",
        padding: compact ? "20px" : "28px",
        borderRadius: compact ? "22px" : "28px",
        background: tone.background,
        border: `1px solid ${tone.borderColor}`,
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      }}
    >
      <div style={{ display: "grid", gap: "10px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            width: "fit-content",
            padding: "8px 12px",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: tone.accentColor,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "999px",
              backgroundColor: tone.accentColor,
              boxShadow: `0 0 16px ${tone.accentColor}`,
            }}
          />
          {eyebrow}
        </span>

        <div style={{ display: "grid", gap: "8px" }}>
          <h3
            style={{
              margin: 0,
              color: "#f8fafc",
              fontSize: compact ? "1.22rem" : "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              color: "#cbd5e1",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              maxWidth: "58ch",
            }}
          >
            {message}
          </p>
        </div>
      </div>

      {children}

      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} style={actionButtonStyle}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

const toneMap = {
  neutral: {
    background:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.56))",
    borderColor: "rgba(148, 163, 184, 0.14)",
    accentColor: "#93c5fd",
  },
  warning: {
    background:
      "linear-gradient(180deg, rgba(120, 53, 15, 0.38), rgba(15, 23, 42, 0.56))",
    borderColor: "rgba(251, 191, 36, 0.2)",
    accentColor: "#fcd34d",
  },
  danger: {
    background:
      "linear-gradient(180deg, rgba(127, 29, 29, 0.36), rgba(15, 23, 42, 0.56))",
    borderColor: "rgba(248, 113, 113, 0.2)",
    accentColor: "#fca5a5",
  },
  success: {
    background:
      "linear-gradient(180deg, rgba(6, 78, 59, 0.38), rgba(15, 23, 42, 0.56))",
    borderColor: "rgba(52, 211, 153, 0.2)",
    accentColor: "#6ee7b7",
  },
};

const actionButtonStyle = {
  width: "fit-content",
  minHeight: "48px",
  border: "1px solid rgba(248, 250, 252, 0.12)",
  borderRadius: "16px",
  padding: "12px 18px",
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  color: "#f8fafc",
  fontWeight: 700,
  cursor: "pointer",
};

export default StatePanel;
