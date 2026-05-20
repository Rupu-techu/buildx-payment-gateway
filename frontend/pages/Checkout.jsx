import CheckoutStepper from "../components/CheckoutStepper.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import PaymentButton from "../components/PaymentButton.jsx";
import PaymentMethodSelector from "../components/PaymentMethodSelector.jsx";
import StatePanel from "../components/StatePanel.jsx";

const checkoutStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(20px, 4vw, 40px) clamp(16px, 4vw, 28px)",
    background:
      "radial-gradient(circle at top, rgba(59, 130, 246, 0.16), transparent 30%), linear-gradient(180deg, #06121f 0%, #0b1728 48%, #08111d 100%)",
  },
  shell: {
    position: "relative",
    width: "100%",
    maxWidth: "1280px",
  },
  glow: {
    position: "absolute",
    inset: "-18px",
    borderRadius: "36px",
    background:
      "linear-gradient(135deg, rgba(96, 165, 250, 0.24), rgba(129, 140, 248, 0.1), rgba(16, 185, 129, 0.16))",
    filter: "blur(22px)",
    opacity: 0.9,
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "36px",
    padding: "clamp(20px, 4vw, 36px)",
    background: "rgba(8, 15, 27, 0.78)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
    backdropFilter: "blur(18px)",
    color: "#f8fafc",
    display: "grid",
    gap: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "grid",
    gap: "12px",
    maxWidth: "620px",
  },
  backButton: {
    border: "1px solid rgba(125, 211, 252, 0.22)",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(15, 23, 42, 0.36)",
    color: "#dbeafe",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    width: "fit-content",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "7px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    color: "#93c5fd",
    fontSize: "0.74rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  heading: {
    margin: 0,
    fontSize: "clamp(2rem, 6vw, 2.8rem)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
    fontWeight: 800,
  },
  subtext: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "1rem",
    lineHeight: 1.7,
  },
  securePill: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(16, 185, 129, 0.14)",
    border: "1px solid rgba(52, 211, 153, 0.26)",
    color: "#6ee7b7",
    fontSize: "0.78rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  layout: {
    display: "grid",
    gap: "clamp(20px, 3vw, 28px)",
    alignItems: "start",
  },
  leftColumn: {
    display: "grid",
    gap: "24px",
  },
  rightColumn: {
    display: "grid",
    gap: "24px",
  },
  productCard: {
    padding: "30px",
    borderRadius: "30px",
    background:
      "linear-gradient(145deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.92) 60%, rgba(51, 65, 85, 0.9) 100%)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  },
  productTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  sectionLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  sectionTitle: {
    margin: "14px 0 8px",
    fontSize: "1.46rem",
    fontWeight: 700,
    letterSpacing: "-0.03em",
  },
  sectionMeta: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "0.92rem",
    lineHeight: 1.6,
  },
  chip: {
    padding: "10px 12px",
    borderRadius: "16px",
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    color: "#e2e8f0",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  divider: {
    height: "1px",
    margin: "28px 0",
    background:
      "linear-gradient(90deg, rgba(148, 163, 184, 0), rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0))",
  },
  amountRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "24px",
  },
  amountLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.88rem",
  },
  amountValue: {
    margin: "12px 0 0",
    fontSize: "2.8rem",
    lineHeight: 0.95,
    letterSpacing: "-0.06em",
    fontWeight: 800,
  },
  orderWrap: {
    display: "grid",
    gap: "6px",
    justifyItems: "end",
    textAlign: "right",
  },
  orderLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  orderValue: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "0.92rem",
    fontWeight: 600,
  },
  continuationCard: {
    display: "grid",
    gap: "24px",
    padding: "28px",
    borderRadius: "28px",
    background:
      "linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.72))",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },
  continuationMeta: {
    display: "grid",
    gap: "12px",
  },
  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "16px",
  },
  trustCard: {
    padding: "20px",
    borderRadius: "22px",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    display: "grid",
    gap: "10px",
  },
  trustTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "0.94rem",
    fontWeight: 700,
  },
  trustBody: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.84rem",
    lineHeight: 1.65,
  },
  methodPreview: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    padding: "20px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(15, 23, 42, 0.35))",
    border: "1px solid rgba(96, 165, 250, 0.16)",
    flexWrap: "wrap",
  },
};

function Checkout({
  cartItems,
  subtotal,
  pricing,
  orderId,
  paymentMethods,
  selectedMethod,
  couponCode,
  appliedCoupon,
  onBack,
  onContinue,
  onMethodSelect,
  onCouponChange,
  onApplyCoupon,
  onClearCoupon,
  isApplyingCoupon = false,
  isCompact = false,
  isMobile = false,
}) {
  const primaryItem = cartItems[0];
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const selectedMethodDetails = paymentMethods.find(
    (method) => method.id === selectedMethod
  );

  if (cartItems.length === 0) {
    return (
      <main style={checkoutStyles.page}>
        <section style={checkoutStyles.shell}>
          <article style={checkoutStyles.card}>
            <StatePanel
              eyebrow="Empty Cart"
              title="Checkout is empty right now"
              message="Add the product from the cart screen first, then come back to review totals and continue to payment."
              variant="neutral"
              actionLabel="Back to Cart"
              onAction={onBack}
            />
          </article>
        </section>
      </main>
    );
  }

  return (
    <main style={checkoutStyles.page}>
      <section style={checkoutStyles.shell}>
        <div
          style={{
            ...checkoutStyles.glow,
            inset: isMobile ? "-8px" : isCompact ? "-12px" : "-18px",
          }}
          aria-hidden="true"
        />

        <article
          style={{
            ...checkoutStyles.card,
            gap: isMobile ? "24px" : "32px",
            padding: isMobile ? "18px" : isCompact ? "22px" : "clamp(20px, 4vw, 36px)",
            borderRadius: isMobile ? "26px" : "36px",
          }}
        >
          <div
            style={{
              ...checkoutStyles.header,
              gap: isMobile ? "16px" : "24px",
            }}
          >
            <div style={checkoutStyles.headerLeft}>
              <button type="button" onClick={onBack} style={checkoutStyles.backButton}>
                Back to Cart
              </button>
              <span style={checkoutStyles.badge}>BuildX Payments</span>
              <h1 style={checkoutStyles.heading}>Review your checkout</h1>
              <p style={checkoutStyles.subtext}>
                Confirm your subscription, keep totals visible, and continue to secure
                payment with instant activation.
              </p>
            </div>

            <span style={checkoutStyles.securePill}>Secure Demo</span>
          </div>

          <CheckoutStepper activeStep="checkout" compact={isCompact} mobile={isMobile} />

          <div
            style={{
              ...checkoutStyles.layout,
              gridTemplateColumns: isCompact
                ? "minmax(0, 1fr)"
                : "minmax(0, 1.08fr) minmax(360px, 0.92fr)",
              gap: isMobile ? "16px" : "clamp(20px, 3vw, 28px)",
            }}
          >
            <div style={{ ...checkoutStyles.leftColumn, gap: isMobile ? "16px" : "24px" }}>
              <section
                style={{
                  ...checkoutStyles.productCard,
                  padding: isMobile ? "20px" : isCompact ? "24px" : "30px",
                  borderRadius: isMobile ? "24px" : "30px",
                }}
              >
                <div
                  style={{
                    ...checkoutStyles.productTop,
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "14px" : "20px",
                  }}
                >
                  <div>
                    <p style={checkoutStyles.sectionLabel}>Order</p>
                    <h2 style={checkoutStyles.sectionTitle}>
                      {primaryItem?.title || "BuildX Starter Plan"}
                    </h2>
                    <p style={checkoutStyles.sectionMeta}>{itemCount} item(s) in order</p>
                  </div>

                  <span style={checkoutStyles.chip}>Checkout Step</span>
                </div>

                <div
                  style={{
                    ...checkoutStyles.divider,
                    margin: isMobile ? "20px 0" : "28px 0",
                  }}
                />

                <div
                  style={{
                    ...checkoutStyles.amountRow,
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "flex-end",
                    gap: isMobile ? "16px" : "24px",
                  }}
                >
                  <div>
                    <p style={checkoutStyles.amountLabel}>Estimated total</p>
                    <p
                      style={{
                        ...checkoutStyles.amountValue,
                        fontSize: isMobile ? "2.2rem" : "2.8rem",
                      }}
                    >
                      {formatCurrency(pricing.total)}
                    </p>
                  </div>

                  <div
                    style={{
                      ...checkoutStyles.orderWrap,
                      justifyItems: isMobile ? "start" : "end",
                      textAlign: isMobile ? "left" : "right",
                    }}
                  >
                    <p style={checkoutStyles.orderLabel}>Order ID</p>
                    <p style={checkoutStyles.orderValue}>{orderId}</p>
                  </div>
                </div>
              </section>

              <PaymentMethodSelector
                methods={paymentMethods}
                selectedMethod={selectedMethod}
                onSelect={onMethodSelect}
                compact={isCompact}
                mobile={isMobile}
              />

              <section
                style={{
                  ...checkoutStyles.continuationCard,
                  gap: isMobile ? "18px" : "24px",
                  padding: isMobile ? "20px" : isCompact ? "22px" : "28px",
                  borderRadius: isMobile ? "24px" : "28px",
                }}
              >
                <div style={checkoutStyles.continuationMeta}>
                  <p style={checkoutStyles.sectionLabel}>Payment Preview</p>
                  <h3 style={checkoutStyles.sectionTitle}>Continue with confidence</h3>
                  <p style={checkoutStyles.sectionMeta}>
                    Your selected method, coupon, and pricing carry forward exactly as
                    they are when you move to payment, with instant access right after
                    checkout.
                  </p>
                </div>

                <div
                  style={{
                    ...checkoutStyles.methodPreview,
                    gap: isMobile ? "12px" : "16px",
                    padding: isMobile ? "16px" : "20px",
                    borderRadius: isMobile ? "18px" : "22px",
                  }}
                >
                  <div>
                    <p style={checkoutStyles.sectionLabel}>Selected method</p>
                    <p style={{ ...checkoutStyles.sectionTitle, margin: "8px 0 0" }}>
                      {selectedMethodDetails?.label || "Google Pay"}
                    </p>
                  </div>

                  <span style={checkoutStyles.chip}>
                    {appliedCoupon ? `Coupon ${appliedCoupon}` : "No coupon applied"}
                  </span>
                </div>

                <div
                  style={{
                    ...checkoutStyles.trustGrid,
                    gridTemplateColumns: isMobile
                      ? "minmax(0, 1fr)"
                      : checkoutStyles.trustGrid.gridTemplateColumns,
                    gap: isMobile ? "12px" : "16px",
                  }}
                >
                  <article style={checkoutStyles.trustCard}>
                    <p style={checkoutStyles.trustTitle}>Fast step-by-step flow</p>
                    <p style={checkoutStyles.trustBody}>
                      Review first, then activate. The flow feels closer to a premium
                      learning or SaaS purchase.
                    </p>
                  </article>

                  <article style={checkoutStyles.trustCard}>
                    <p style={checkoutStyles.trustTitle}>State stays intact</p>
                    <p style={checkoutStyles.trustBody}>
                      Cart items, totals, and payment preference stay preserved as you
                      move around the digital checkout.
                    </p>
                  </article>

                  <article style={checkoutStyles.trustCard}>
                    <p style={checkoutStyles.trustTitle}>Mobile-friendly layout</p>
                    <p style={checkoutStyles.trustBody}>
                      Cards stack cleanly on smaller screens so subscription checkout
                      stays readable.
                    </p>
                  </article>
                </div>
              </section>
            </div>

            <div style={{ ...checkoutStyles.rightColumn, gap: isMobile ? "16px" : "24px" }}>
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                pricing={pricing}
                couponCode={couponCode}
                appliedCoupon={appliedCoupon}
                isApplyingCoupon={isApplyingCoupon}
                isCompact={isCompact}
                isMobile={isMobile}
                onCouponChange={onCouponChange}
                onApplyCoupon={onApplyCoupon}
                onClearCoupon={onClearCoupon}
              />

              <div
                style={{
                  display: "grid",
                  gap: isMobile ? "14px" : "18px",
                  paddingTop: isMobile ? "0" : "4px",
                }}
              >
                <PaymentButton
                  label="Continue to Payment"
                  onClick={onContinue}
                  disabled={cartItems.length === 0}
                  futureAction="move-to-payment"
                />

                <p
                  style={{
                    margin: 0,
                    color: "#94a3b8",
                    fontSize: "0.84rem",
                    lineHeight: 1.5,
                    textAlign: isCompact ? "left" : "center",
                  }}
                >
                  You can return from payment anytime and pick up from this exact
                  checkout state.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default Checkout;
