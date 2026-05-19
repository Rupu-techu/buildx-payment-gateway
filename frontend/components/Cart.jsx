import CartItem from "./CartItem.jsx";

function Cart({
  items,
  subtotal,
  pricing,
  onIncrease,
  onDecrease,
  onRemove,
  onProceed,
}) {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <aside
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "30px",
        padding: "24px",
        background: "rgba(8, 15, 27, 0.78)",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        boxShadow: "0 28px 80px rgba(2, 6, 23, 0.45)",
        backdropFilter: "blur(18px)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Cart
          </p>
          <h2
            style={{
              margin: "10px 0 0",
              color: "#f8fafc",
              fontSize: "1.6rem",
              letterSpacing: "-0.04em",
              fontWeight: 800,
            }}
          >
            Order summary
          </h2>
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
            color: "#cbd5e1",
            fontSize: "0.86rem",
            fontWeight: 600,
          }}
        >
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </div>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            padding: "22px",
            borderRadius: "22px",
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.52))",
            border: "1px solid rgba(148, 163, 184, 0.12)",
            color: "#94a3b8",
            lineHeight: 1.6,
          }}
        >
          Add the mock product to begin the payment flow.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "24px",
          background:
            "linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6))",
          border: "1px solid rgba(148, 163, 184, 0.12)",
          display: "grid",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Subtotal
            </p>
            <p
              style={{
                margin: "8px 0 0",
                color: "#f8fafc",
                fontSize: "2.1rem",
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(subtotal)}
            </p>
          </div>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "0.9rem",
            }}
          >
            {subtotal > 0
              ? "Instant access starts after payment"
              : "Taxes calculated at checkout"}
          </p>
        </div>

        {items.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: "10px",
              padding: "14px 16px",
              borderRadius: "18px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(148, 163, 184, 0.08)",
            }}
          >
            <div style={priceHintRowStyle}>
              <span>Platform fee</span>
              <strong>{formatCurrency(pricing.platformFee)}</strong>
            </div>
            <div style={priceHintRowStyle}>
              <span>Estimated payable</span>
              <strong>{formatCurrency(pricing.total)}</strong>
            </div>
            <div style={priceHintRowStyle}>
              <span>Access</span>
              <strong>Instant</strong>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onProceed}
          disabled={items.length === 0}
          style={{
            width: "100%",
            minHeight: "58px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "18px",
            padding: "16px 20px",
            background:
              items.length === 0
                ? "linear-gradient(135deg, #334155 0%, #475569 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
            color: "#020617",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            cursor: items.length === 0 ? "not-allowed" : "pointer",
            boxShadow:
              items.length === 0
                ? "none"
                : "0 16px 30px rgba(15, 23, 42, 0.22)",
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </aside>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const priceHintRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
  color: "#cbd5e1",
  fontSize: "0.88rem",
};

export default Cart;
