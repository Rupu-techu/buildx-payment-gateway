import { couponCatalog, formatCurrency } from "../utils/pricing.js";

function OrderSummary({
  cartItems,
  subtotal,
  pricing,
  couponCode,
  appliedCoupon,
  onCouponChange,
  onApplyCoupon,
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: "24px",
        padding: "28px",
        borderRadius: "28px",
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.58))",
        border: "1px solid rgba(148, 163, 184, 0.14)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={labelStyle}>Order Summary</p>
          <h3 style={titleStyle}>Review your payment</h3>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 12px",
            borderRadius: "999px",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(52, 211, 153, 0.2)",
            color: "#6ee7b7",
            fontSize: "0.78rem",
            fontWeight: 700,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              backgroundColor: "#34d399",
              boxShadow: "0 0 14px rgba(52, 211, 153, 0.7)",
            }}
          />
          Secure Payment
        </span>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "center",
              padding: "18px 20px",
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(148, 163, 184, 0.08)",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: "0.94rem",
                  fontWeight: 600,
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#94a3b8",
                  fontSize: "0.84rem",
                }}
              >
                Qty {item.quantity}
              </p>
            </div>

            <strong style={{ color: "#f8fafc", fontSize: "0.95rem" }}>
              {formatCurrency(item.price * item.quantity)}
            </strong>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gap: "14px",
          padding: "20px",
          borderRadius: "22px",
          backgroundColor: "rgba(2, 6, 23, 0.35)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
        }}
      >
        <div style={rowStyle}>
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <div style={rowStyle}>
        <span>Platform Fee</span>
          <strong>{formatCurrency(pricing.platformFee)}</strong>
        </div>
        <div style={rowStyle}>
          <span>Access</span>
          <strong>Instant Access</strong>
        </div>
        <div style={rowStyle}>
          <span>GST ({Math.round(pricing.rules.gstRate * 100)}%)</span>
          <strong>{formatCurrency(pricing.gst)}</strong>
        </div>
        <div style={{ ...rowStyle, color: "#6ee7b7" }}>
          <span>Discount</span>
          <strong>-{formatCurrency(pricing.discount)}</strong>
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          borderRadius: "22px",
          background:
            "linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(15, 23, 42, 0.55))",
          border: "1px solid rgba(96, 165, 250, 0.18)",
          display: "grid",
          gap: "12px",
        }}
      >
        <p style={labelStyle}>Coupon Code</p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {Object.values(couponCatalog).map((coupon) => (
            <span key={coupon.code} style={couponTagStyle}>
              {coupon.code}: {coupon.label}
            </span>
          ))}
          {appliedCoupon ? (
            <span
              style={{
                ...couponTagStyle,
                color: "#6ee7b7",
                border: "1px solid rgba(52, 211, 153, 0.24)",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
              }}
            >
              Active: {appliedCoupon}
            </span>
          ) : null}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: "12px",
          }}
        >
          <input
            type="text"
            value={couponCode}
            onChange={(event) => onCouponChange(event.target.value)}
            placeholder="Use SAVE10 or FIRST50"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            style={couponButtonStyle}
          >
            Apply
          </button>
        </div>

        <p
          style={{
            margin: 0,
            color:
              pricing.couponStatus === "applied"
                ? "#6ee7b7"
                : pricing.couponStatus === "invalid"
                  ? "#fca5a5"
                  : "#94a3b8",
            fontSize: "0.84rem",
            lineHeight: 1.5,
          }}
        >
          {pricing.couponMessage}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "12px",
          padding: "20px",
          borderRadius: "22px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(148, 163, 184, 0.08)",
        }}
      >
        <div style={{ ...rowStyle, color: "#f8fafc", fontSize: "1.02rem" }}>
          <span>Final Total</span>
          <strong>{formatCurrency(pricing.total)}</strong>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#6ee7b7",
              fontSize: "0.88rem",
              fontWeight: 700,
            }}
          >
            You Saved {formatCurrency(pricing.totalSaved)}
          </p>
          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "0.84rem",
            }}
          >
            Subscription activates immediately after a successful payment.
          </p>
        </div>
      </div>
    </section>
  );
}

const labelStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: "10px 0 0",
  color: "#f8fafc",
  fontSize: "1.14rem",
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "center",
  color: "#cbd5e1",
  fontSize: "0.94rem",
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

const couponButtonStyle = {
  minWidth: "96px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  padding: "0 16px",
  background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
  color: "#020617",
  fontWeight: 700,
  cursor: "pointer",
};

const couponTagStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "9px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  color: "#cbd5e1",
  fontSize: "0.76rem",
  fontWeight: 600,
};

export default OrderSummary;
