const steps = [
  { id: "cart", label: "Cart" },
  { id: "checkout", label: "Checkout" },
  { id: "payment", label: "Payment" },
];

function CheckoutStepper({ activeStep, compact = false }) {
  return (
    <nav aria-label="Checkout progress" style={compact ? compactWrapStyle : wrapStyle}>
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isComplete = steps.findIndex((item) => item.id === activeStep) > index;

        return (
          <div key={step.id} style={stepRowStyle}>
            <div
              style={{
                ...stepStyle,
                ...(isActive ? activeStepStyle : null),
                ...(isComplete ? completeStepStyle : null),
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  ...stepIndexStyle,
                  ...(isActive ? activeStepIndexStyle : null),
                  ...(isComplete ? completeStepIndexStyle : null),
                }}
              >
                {index + 1}
              </span>

              <div style={{ display: "grid", gap: "4px" }}>
                <span style={stepLabelStyle}>{step.label}</span>
                <span style={stepMetaStyle}>
                  {isActive ? "Current step" : isComplete ? "Completed" : "Coming up"}
                </span>
              </div>
            </div>

            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                style={{
                  ...connectorStyle,
                  background: isComplete
                    ? "linear-gradient(90deg, rgba(96, 165, 250, 0.65), rgba(34, 211, 238, 0.52))"
                    : "linear-gradient(90deg, rgba(148, 163, 184, 0.18), rgba(148, 163, 184, 0.05))",
                }}
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

const wrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
};

const compactWrapStyle = {
  ...wrapStyle,
  gap: "10px",
};

const stepRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flex: "1 1 220px",
  minWidth: "0",
};

const stepStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: "0",
  flex: 1,
  padding: "14px 16px",
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  background: "linear-gradient(180deg, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.3))",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
  transition: "all 180ms ease",
};

const activeStepStyle = {
  border: "1px solid rgba(125, 211, 252, 0.38)",
  background:
    "linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(14, 116, 144, 0.12), rgba(15, 23, 42, 0.6))",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.2)",
};

const completeStepStyle = {
  border: "1px solid rgba(74, 222, 128, 0.18)",
  background:
    "linear-gradient(180deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.45))",
};

const stepIndexStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  backgroundColor: "rgba(148, 163, 184, 0.14)",
  color: "#cbd5e1",
  fontSize: "0.86rem",
  fontWeight: 700,
};

const activeStepIndexStyle = {
  backgroundColor: "#f8fafc",
  color: "#0f172a",
  boxShadow: "0 0 18px rgba(248, 250, 252, 0.25)",
};

const completeStepIndexStyle = {
  backgroundColor: "rgba(74, 222, 128, 0.18)",
  color: "#bbf7d0",
};

const stepLabelStyle = {
  color: "#f8fafc",
  fontSize: "0.92rem",
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const stepMetaStyle = {
  color: "#94a3b8",
  fontSize: "0.78rem",
  lineHeight: 1.4,
};

const connectorStyle = {
  height: "1px",
  flex: "0 0 36px",
  borderRadius: "999px",
};

export default CheckoutStepper;
