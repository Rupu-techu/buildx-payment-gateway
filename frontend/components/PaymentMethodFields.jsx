function PaymentMethodFields({
  billingName,
  selectedMethod,
  upiId,
  cardDetails,
  selectedBank,
  bankOptions = [],
  validationErrors = {},
  onBillingNameChange,
  onUpiChange,
  onCardChange,
  onBankChange,
  disabled = false,
  isCompact = false,
  isMobile = false,
}) {
  const billingNameField = (
    <>
      <label style={fieldGroupStyle}>
        <span style={fieldLabelStyle}>Billing Name</span>
        <input
          type="text"
          value={billingName}
          onChange={(event) => onBillingNameChange(event.target.value)}
          placeholder="Aarav Sharma"
          style={inputStyle(validationErrors.billingName)}
          disabled={disabled}
        />
      </label>

      {validationErrors.billingName ? (
        <p style={errorTextStyle}>{validationErrors.billingName}</p>
      ) : null}
    </>
  );

  if (selectedMethod === "GOOGLE_PAY" || selectedMethod === "PHONEPE") {
    const brandDetails =
      selectedMethod === "GOOGLE_PAY"
        ? {
            title: "Continue with Google Pay",
            label: "Google Pay",
            accent: "#60a5fa",
            panel: "linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(15, 23, 42, 0.58))",
            message:
              "Open a desktop payment modal, scan the QR using Google Pay on mobile, and return here while verification completes.",
            action: "Open Google Pay QR modal",
          }
        : {
            title: "Continue with PhonePe",
            label: "PhonePe",
            accent: "#c084fc",
            panel: "linear-gradient(135deg, rgba(126, 34, 206, 0.2), rgba(15, 23, 42, 0.58))",
            message:
              "A realistic desktop QR handoff lets you scan with PhonePe on mobile before the payment is verified here.",
            action: "Open PhonePe QR modal",
          };

    return (
      <section
        style={{
          ...panelStyle,
          ...responsivePanelStyle(isMobile, isCompact),
          background: brandDetails.panel,
        }}
      >
        {billingNameField}

        <div style={heroRowStyle}>
          <div>
            <p style={sectionLabelStyle}>Express Checkout</p>
            <h3 style={sectionTitleStyle}>{brandDetails.title}</h3>
          </div>
          <span
            style={{
              ...badgeStyle,
              border: `1px solid ${brandDetails.accent}33`,
              color: brandDetails.accent,
            }}
          >
            Instant Access
          </span>
        </div>


      </section>
    );
  }

  if (selectedMethod === "UPI") {
    return (
      <section style={{ ...panelStyle, ...responsivePanelStyle(isMobile, isCompact) }}>
        {billingNameField}

        <div>
          <p style={sectionLabelStyle}>UPI Details</p>
          <h3 style={sectionTitleStyle}>Pay with UPI and activate instantly</h3>
        </div>

        <label style={fieldGroupStyle}>
          <span style={fieldLabelStyle}>UPI ID</span>
          <input
            type="text"
            value={upiId}
            onChange={(event) => onUpiChange(event.target.value)}
            placeholder="name@upi"
            style={{
              ...inputStyle(validationErrors.upiId),
              minHeight: upiId.trim() ? "64px" : "52px",
              fontSize: upiId.trim() ? "1rem" : "0.96rem",
            }}
            disabled={disabled}
          />
        </label>

        {validationErrors.upiId ? (
          <p style={errorTextStyle}>{validationErrors.upiId}</p>
        ) : null}
      </section>
    );
  }

  if (selectedMethod === "CARD") {
    return (
      <section style={{ ...panelStyle, ...responsivePanelStyle(isMobile, isCompact) }}>
        {billingNameField}

        <div>
          <p style={sectionLabelStyle}>Card Details</p>
          <h3 style={sectionTitleStyle}>Enter your card information</h3>
        </div>

        <label style={fieldGroupStyle}>
          <span style={fieldLabelStyle}>Cardholder Name</span>
          <input
            type="text"
            value={cardDetails.name}
            onChange={(event) => onCardChange("name", event.target.value)}
            placeholder="Aarav Sharma"
            style={inputStyle(validationErrors.name)}
            disabled={disabled}
          />
        </label>

        {validationErrors.name ? (
          <p style={errorTextStyle}>{validationErrors.name}</p>
        ) : null}

        <label style={fieldGroupStyle}>
          <span style={fieldLabelStyle}>Card Number</span>
          <input
            type="text"
            value={cardDetails.number}
            onChange={(event) => onCardChange("number", event.target.value)}
            placeholder="4242 4242 4242 4242"
            style={inputStyle(validationErrors.number)}
            disabled={disabled}
          />
        </label>

        {validationErrors.number ? (
          <p style={errorTextStyle}>{validationErrors.number}</p>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isCompact
              ? "minmax(0, 1fr)"
              : "repeat(2, minmax(0, 1fr))",
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
              style={inputStyle(validationErrors.expiry)}
              disabled={disabled}
            />
            {validationErrors.expiry ? (
              <span style={errorTextStyle}>{validationErrors.expiry}</span>
            ) : null}
          </label>

          <label style={fieldGroupStyle}>
            <span style={fieldLabelStyle}>CVV</span>
            <input
              type="password"
              value={cardDetails.cvv}
              onChange={(event) => onCardChange("cvv", event.target.value)}
              placeholder="123"
              style={inputStyle(validationErrors.cvv)}
              disabled={disabled}
            />
            {validationErrors.cvv ? (
              <span style={errorTextStyle}>{validationErrors.cvv}</span>
            ) : null}
          </label>
        </div>
      </section>
    );
  }

  if (selectedMethod === "NET_BANKING") {
    return (
      <section style={{ ...panelStyle, ...responsivePanelStyle(isMobile, isCompact) }}>
        {billingNameField}

        <div>
          <p style={sectionLabelStyle}>Net Banking</p>
          <h3 style={sectionTitleStyle}>Choose your bank</h3>
        </div>

        <label style={fieldGroupStyle}>
          <span style={fieldLabelStyle}>Preferred Bank</span>
          <select
            value={selectedBank}
            onChange={(event) => onBankChange(event.target.value)}
            style={inputStyle(validationErrors.bank)}
            disabled={disabled}
          >
            <option value="">Select your bank</option>
            {bankOptions.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </label>

        {validationErrors.bank ? (
          <p style={errorTextStyle}>{validationErrors.bank}</p>
        ) : null}
      </section>
    );
  }

  const methodMessages = {
    PAYTM: "Use your digital wallet for a quick subscription checkout and instant activation.",
  };

  return (
    <section style={{ ...panelStyle, ...responsivePanelStyle(isMobile, isCompact) }}>
      {billingNameField}

      <div>
        <p style={sectionLabelStyle}>Payment Details</p>
        <h3 style={sectionTitleStyle}>Selected method is ready</h3>
      </div>

      <p
        style={supportCopyStyle}
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
  overflow: "hidden",
};

function responsivePanelStyle(isMobile, isCompact) {
  return {
    gap: isMobile ? "12px" : "14px",
    padding: isMobile ? "16px" : isCompact ? "18px" : "20px",
    borderRadius: isMobile ? "20px" : "22px",
  };
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

const fieldGroupStyle = {
  display: "grid",
  gap: "8px",
};

const fieldLabelStyle = {
  color: "#cbd5e1",
  fontSize: "0.86rem",
  fontWeight: 600,
};

const inputStyle = (hasError) => ({
  width: "100%",
  minHeight: "52px",
  borderRadius: "16px",
  border: hasError
    ? "1px solid rgba(248, 113, 113, 0.48)"
    : "1px solid rgba(148, 163, 184, 0.18)",
  backgroundColor: "rgba(2, 6, 23, 0.45)",
  color: "#f8fafc",
  padding: "0 16px",
  outline: "none",
  boxShadow: hasError ? "0 0 0 1px rgba(248, 113, 113, 0.12)" : "none",
});

const supportCopyStyle = {
  margin: 0,
  color: "#94a3b8",
  fontSize: "0.92rem",
  lineHeight: 1.6,
};

const errorTextStyle = {
  margin: "-4px 0 0",
  color: "#fca5a5",
  fontSize: "0.82rem",
  lineHeight: 1.5,
};

const heroRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const badgeStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  fontSize: "0.78rem",
  fontWeight: 700,
};

export default PaymentMethodFields;
