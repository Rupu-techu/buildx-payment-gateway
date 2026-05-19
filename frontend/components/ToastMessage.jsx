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

function ToastMessage({ message, variant = "info" }) {
  if (!message) {
    return null;
  }

  const tone = toneMap[variant] || toneMap.info;

  return (
    <div
      role="status"
      style={{
        padding: "0.85rem 1rem",
        borderRadius: "0.8rem",
        border: `1px solid ${tone.borderColor}`,
        backgroundColor: tone.backgroundColor,
        color: tone.color,
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}

export default ToastMessage;
