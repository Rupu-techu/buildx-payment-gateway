const toneMap = {
  info: {
    backgroundColor: "#eff6ff",
    borderColor: "#93c5fd",
    color: "#1d4ed8",
  },
  success: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
    color: "#166534",
  },
  error: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    color: "#b91c1c",
  },
  warning: {
    backgroundColor: "#fffbeb",
    borderColor: "#fcd34d",
    color: "#b45309",
  },
};

function ToastMessage({ title, message, variant = "info", onDismiss }) {
  if (!message) {
    return null;
  }

  const tone = toneMap[variant] || toneMap.info;

  return (
    <div
      role="status"
      style={{
        display: "grid",
        gap: "8px",
        padding: "1rem",
        borderRadius: "1rem",
        border: `1px solid ${tone.borderColor}`,
        backgroundColor: tone.backgroundColor,
        color: tone.color,
        lineHeight: 1.5,
        boxShadow: "0 16px 34px rgba(15, 23, 42, 0.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "grid", gap: "4px" }}>
          {title ? (
            <strong style={{ fontSize: "0.92rem", lineHeight: 1.2 }}>{title}</strong>
          ) : null}
          <span>{message}</span>
        </div>

        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            style={{
              border: "none",
              background: "transparent",
              color: "inherit",
              fontSize: "1rem",
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            x
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ToastMessage;
