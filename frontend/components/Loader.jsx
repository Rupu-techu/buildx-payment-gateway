function Loader({ label = "Processing payment...", size = "medium" }) {
  const dimensions = size === "small" ? "16px" : "28px";
  const borderWidth = size === "small" ? "2px" : "3px";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.65rem",
        color: "#334155",
      }}
    >
      <style>
        {`
          @keyframes payment-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <span
        aria-hidden="true"
        style={{
          width: dimensions,
          height: dimensions,
          borderRadius: "999px",
          border: `${borderWidth} solid rgba(148, 163, 184, 0.35)`,
          borderTopColor: "#0f172a",
          animation: "payment-spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: size === "small" ? "0.95rem" : "1rem" }}>
        {label}
      </span>
    </div>
  );
}

export default Loader;
