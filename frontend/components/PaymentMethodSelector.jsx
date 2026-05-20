const methodGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "12px",
};

function PaymentMethodSelector({
  methods,
  selectedMethod,
  onSelect,
  disabled = false,
  compact = false,
  mobile = false,
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: "14px",
      }}
    >
      <div>
        <p style={sectionLabelStyle}>Payment Method</p>
        <h3 style={sectionTitleStyle}>Choose how you want to pay</h3>
      </div>

      <div
        style={{
          ...methodGridStyle,
          gridTemplateColumns: mobile
            ? "minmax(0, 1fr)"
            : compact
              ? "repeat(2, minmax(0, 1fr))"
              : methodGridStyle.gridTemplateColumns,
          gap: mobile ? "10px" : "12px",
        }}
      >
        {methods.map((method) => {
          const isActive = method.id === selectedMethod;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              disabled={disabled}
              style={{
                display: "grid",
                gap: mobile ? "10px" : "12px",
                textAlign: "left",
                padding: mobile ? "14px" : "16px",
                borderRadius: mobile ? "18px" : "20px",
                border: isActive
                  ? "1px solid rgba(96, 165, 250, 0.5)"
                  : "1px solid rgba(148, 163, 184, 0.12)",
                background: isActive
                  ? "linear-gradient(180deg, rgba(37, 99, 235, 0.18), rgba(15, 23, 42, 0.72))"
                  : "linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.52))",
                boxShadow: isActive
                  ? "0 14px 28px rgba(37, 99, 235, 0.12)"
                  : "none",
                cursor: disabled ? "not-allowed" : "pointer",
                color: "#f8fafc",
                opacity: disabled ? 0.65 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: mobile ? "38px" : "42px",
                    height: mobile ? "38px" : "42px",
                    borderRadius: mobile ? "12px" : "14px",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: method.iconBackground,
                    color: method.iconColor,
                    fontSize: "0.84rem",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                  }}
                >
                  {method.icon}
                </span>

                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "999px",
                    backgroundColor: isActive ? "#60a5fa" : "rgba(148, 163, 184, 0.3)",
                    boxShadow: isActive ? "0 0 18px rgba(96, 165, 250, 0.6)" : "none",
                    flexShrink: 0,
                  }}
                />
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: mobile ? "0.92rem" : "0.98rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {method.label}
                </p>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#94a3b8",
                    fontSize: mobile ? "0.8rem" : "0.84rem",
                    lineHeight: 1.5,
                  }}
                >
                  {method.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const sectionLabelStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const sectionTitleStyle = {
  margin: "8px 0 0",
  color: "#f8fafc",
  fontSize: "1.08rem",
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

export default PaymentMethodSelector;
