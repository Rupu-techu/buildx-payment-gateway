function ProductCard({ product, onAddToCart }) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "30px",
        padding: "26px",
        background: "rgba(8, 15, 27, 0.78)",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        boxShadow: "0 28px 80px rgba(2, 6, 23, 0.45)",
        backdropFilter: "blur(18px)",
        color: "#f8fafc",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "auto -30px -40px auto",
          width: "160px",
          height: "160px",
          borderRadius: "999px",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.34), rgba(59, 130, 246, 0))",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "grid",
          gap: "22px",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <div
            style={{
              height: "240px",
              borderRadius: "24px",
              background:
                "linear-gradient(145deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 0.92) 55%, rgba(37, 99, 235, 0.7) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
            }}
          >
            <div
              style={{
                width: "74%",
                maxWidth: "280px",
                aspectRatio: "1 / 1",
                borderRadius: "28px",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04))",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                display: "grid",
                placeItems: "center",
                color: "#dbeafe",
                fontSize: "0.95rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Product Preview
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "grid", gap: "10px" }}>
              <span
                style={{
                  width: "fit-content",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(15, 23, 42, 0.42)",
                  border: "1px solid rgba(125, 211, 252, 0.18)",
                  color: "#93c5fd",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {product.category}
              </span>

              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
                  letterSpacing: "-0.04em",
                  fontWeight: 800,
                }}
              >
                {product.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: "0.98rem",
                  lineHeight: 1.6,
                  maxWidth: "56ch",
                }}
              >
                {product.description}
              </p>
            </div>

            <div
              style={{
                padding: "14px 16px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(148, 163, 184, 0.12)",
                minWidth: "140px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Price
              </p>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#f8fafc",
                  fontSize: "2rem",
                  fontWeight: 800,
                  letterSpacing: "-0.06em",
                }}
              >
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          style={{
            width: "100%",
            minHeight: "58px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "18px",
            padding: "16px 20px",
            background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
            color: "#020617",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            boxShadow: "0 16px 30px rgba(15, 23, 42, 0.22)",
          }}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
