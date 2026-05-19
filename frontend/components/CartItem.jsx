function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article
      style={{
        display: "grid",
        gap: "14px",
        padding: "18px",
        borderRadius: "22px",
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.52))",
        border: "1px solid rgba(148, 163, 184, 0.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: "#f8fafc",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            {item.title}
          </h3>
          <p
            style={{
              margin: "8px 0 0",
              color: "#94a3b8",
              fontSize: "0.9rem",
            }}
          >
            ${item.price.toFixed(2)} each
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          style={actionButtonStyle}
        >
          Remove
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px",
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
          }}
        >
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            style={quantityButtonStyle}
          >
            -
          </button>

          <span
            style={{
              minWidth: "28px",
              textAlign: "center",
              color: "#f8fafc",
              fontWeight: 700,
            }}
          >
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onIncrease(item.id)}
            style={quantityButtonStyle}
          >
            +
          </button>
        </div>

        <p
          style={{
            margin: 0,
            color: "#f8fafc",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </article>
  );
}

const actionButtonStyle = {
  border: "none",
  padding: "0",
  background: "transparent",
  color: "#93c5fd",
  fontSize: "0.88rem",
  fontWeight: 600,
  cursor: "pointer",
};

const quantityButtonStyle = {
  width: "34px",
  height: "34px",
  border: "none",
  borderRadius: "12px",
  backgroundColor: "rgba(248, 250, 252, 0.08)",
  color: "#f8fafc",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
};

export default CartItem;
