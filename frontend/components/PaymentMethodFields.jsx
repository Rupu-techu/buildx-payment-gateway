function PaymentMethodFields({
  selectedMethod,
  upiId,
  cardDetails,
  onUpiChange,
  onCardChange,
}) {
  if (selectedMethod === "UPI") {
    return (
      <section style={panelStyle}>
        <div>
          <p style={sectionLabelStyle}>UPI Details</p>
          <h3 style={sectionTitleStyle}>Pay with UPI</h3>
        </div>

        <label style={fieldGroupStyle}>
          <span style={fieldLabelStyle}>UPI ID</span>
          <input
            type="text"
            value={upiId}
            onChange={(event) => onUpiChange(event.target.value)}
            placeholder="name@upi"
            style={inputStyle}
          />
        </label>
      </section>
    );
  }

  if (selectedMethod === "CARD") {
    return (
      <section style={panelStyle}>
        <div>
          <p style={sectionLabelStyle}>Card Details</p>
          <h3 style={sectionTitleStyle}>Enter card information</h3>
        </div>

        {/* These fields stay mock-only for the demo, but mirror the layout
            users expect in a real ecommerce checkout. */}
        <label style={fieldGroupStyle}>
          <span style={fieldLabelStyle}>Card Number</span>
          <input
            type="text"
            value={cardDetails.number}
            onChange={(event) => onCardChange("number", event.target.value)}
            placeholder="4242 4242 4242 4242"
            style={inputStyle}
          />
        </label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          <label style={fieldGroupStyle}>
            <span style={fieldLabelStyle}>Expiry</span>
            <input
              type="text"
              value={cardDetails.expiry}
              onChange={(event) => onCardChange("expiry", event.target.value)}
              placeholder="MM/YY"
              style={inputStyle}
            />
          </label>

          <label style={fieldGroupStyle}>
            <span style={fieldLabelStyle}>CVV</span>
            <input
              type="password"
              value={cardDetails.cvv}
              onChange={(event) => onCardChange("cvv", event.target.value)}
              placeholder="123"
              style={inputStyle}
            />
          </label>
        </div>
      </section>
    );
  }

  const methodMessages = {
    GOOGLE_PAY: "Complete payment quickly using your linked Google Pay account.",
    PHONEPE: "Use your saved PhonePe setup for a fast mobile-first payment.",
    PAYTM: "Continue with Paytm wallet or saved instruments in demo mode.",
    NET_BANKING: "Choose your bank in the next step of the mock payment flow.",
  };

  return (
    <section style={panelStyle}>
      <div>
        <p style={sectionLabelStyle}>Payment Details</p>
        <h3 style={sectionTitleStyle}>Selected method is ready</h3>
      </div>

      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: "0.92rem",
          lineHeight: 1.6,
        }}
      >
        {methodMessages[selectedMethod]}
      </p>
    </section>
  );
}

const panelStyle = {
  display: "grid",
  gap: "14px",
  padding: "20px",
  borderRadius: "22px",
  background:
    "linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.52))",
  border: "1px solid rgba(148, 163, 184, 0.12)",
};

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

const fieldGroupStyle = {
  display: "grid",
  gap: "8px",
};

const fieldLabelStyle = {
  color: "#cbd5e1",
  fontSize: "0.86rem",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  minHeight: "52px",
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  backgroundColor: "rgba(2, 6, 23, 0.45)",
  color: "#f8fafc",
  padding: "0 16px",
  outline: "none",
};

export default PaymentMethodFields;
