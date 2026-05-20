import { useState } from "react";

import CheckoutStepper from "../components/CheckoutStepper.jsx";
import DesktopWalletModal from "../components/DesktopWalletModal.jsx";
import MobilePaymentModal from "../components/MobilePaymentModal.jsx";
import Loader from "../components/Loader.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import PaymentButton from "../components/PaymentButton.jsx";
import PaymentMethodFields from "../components/PaymentMethodFields.jsx";
import PaymentMethodSelector from "../components/PaymentMethodSelector.jsx";
import PaymentStatus from "../components/PaymentStatus.jsx";
import StatePanel from "../components/StatePanel.jsx";
import { simulatePayment } from "../services/paymentService.js";
import {
  validatePaymentDetails,
} from "../utils/paymentValidation.js";
import { getPaymentFlowType } from "../utils/deviceDetection.js";

const statusContent = {
  SUCCESS: {
    variant: "success",
    message: "Payment received",
  },
  FAILED: {
    variant: "error",
    message: "Payment could not be completed",
  },
  PENDING: {
    variant: "pending",
    message: "Payment is awaiting confirmation",
  },
};

const initialStatus = {
  variant: "idle",
  message: "Select a payment method to continue",
  payment: null,
};

function Payment({
  cartItems,
  subtotal,
  pricing,
  orderId,
  paymentMethods,
  selectedMethod,
  couponCode,
  appliedCoupon,
  billingName,
  upiId,
  cardDetails,
  selectedBank,
  bankOptions,
  onBackToCheckout,
  onMethodSelect,
  onCouponChange,
  onApplyCoupon,
  onClearCoupon,
  onBillingNameChange,
  onUpiChange,
  onCardChange,
  onBankChange,
  onPaymentSuccess,
  onNotify,
  isApplyingCoupon = false,
  isCompact = false,
  isMobile = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(initialStatus);
  const [validationErrors, setValidationErrors] = useState({});
  const [walletModalStage, setWalletModalStage] = useState("scan");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [mobilePaymentModalStage, setMobilePaymentModalStage] = useState("processing");
  const [isMobilePaymentModalOpen, setIsMobilePaymentModalOpen] = useState(false);
  const flowType = getPaymentFlowType();
  const primaryItem = cartItems[0];
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const selectedMethodDetails = paymentMethods.find(
    (method) => method.id === selectedMethod
  );

  if (cartItems.length === 0) {
    return (
      <main style={paymentStyles.page}>
        <section style={paymentStyles.shell}>
          <article style={paymentStyles.card}>
            <StatePanel
              eyebrow="Empty Cart"
              title="There is no payment to process yet"
              message="Return to the cart, add the BuildX Learning Pass, and then continue back here to complete the payment flow."
              variant="neutral"
              actionLabel="Back to Checkout"
              onAction={onBackToCheckout}
            />
          </article>
        </section>
      </main>
    );
  }

  function handleMethodSelect(methodId) {
    onMethodSelect(methodId);
    setPaymentStatus({
      variant: "idle",
      message: "Payment method updated",
      payment: null,
    });
    setValidationErrors({});
  }

  function getMethodLabel() {
    return (
      selectedMethodDetails?.label ||
      "Payment Method"
    );
  }

  function requiresWalletModal() {
    return selectedMethod === "GOOGLE_PAY" || selectedMethod === "PHONEPE";
  }

  function getResolvedMethodLabel() {
    return selectedMethod === "NET_BANKING"
      ? `${getMethodLabel()} - ${selectedBank}`
      : getMethodLabel();
  }

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function updateFieldError(fieldKey, nextState) {
    const nextValidation = validatePaymentDetails(nextState);

    setValidationErrors((currentErrors) => {
      if (!currentErrors[fieldKey]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };

      if (nextValidation.errors[fieldKey]) {
        nextErrors[fieldKey] = nextValidation.errors[fieldKey];
      } else {
        delete nextErrors[fieldKey];
      }

      return nextErrors;
    });
  }

  function validateBeforePayment() {
    const validation = validatePaymentDetails({
      billingName,
      selectedMethod,
      upiId,
      cardDetails,
      selectedBank,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setPaymentStatus({
        variant: "idle",
        message: "Complete the required payment details to continue",
        payment: null,
      });
      onNotify?.({
        variant: "error",
        title: "Check your payment details",
        message: "Fix the highlighted fields and try again.",
      });
      return false;
    }

    setValidationErrors({});
    return true;
  }

  async function finalizeSuccessfulPayment(response) {
    const paidAt = new Date().toISOString();

    setPaymentStatus({
      variant: "success",
      message: `Payment received via ${getMethodLabel()}. Access Activated.`,
      payment: response,
    });
    await wait(900);
    onNotify?.({
      variant: "success",
      title: "Payment successful",
      message: "Payment received and access is ready to unlock.",
    });
    onPaymentSuccess({
      transactionId: response.paymentId,
      customerName: billingName.trim(),
      method: getResolvedMethodLabel(),
      amount: formatCurrency(pricing.total),
      orderId,
      status: "SUCCESS",
      currency: "INR",
      paidAt,
      billingSummary: {
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          amount: item.price * item.quantity,
        })),
        subtotal,
        platformFee: pricing.platformFee,
        gst: pricing.gst,
        gstRate: pricing.rules.gstRate,
        discount: pricing.discount,
        discountCode: appliedCoupon,
        finalAmount: pricing.total,
      },
    });
  }

  async function runPaymentFlow({ fromWallet = false } = {}) {
    setIsLoading(true);
    setPaymentStatus({
      variant: "loading",
      message: fromWallet
        ? `Waiting for ${getMethodLabel()} confirmation`
        : `Processing ${getMethodLabel()} payment`,
      payment: null,
    });

    try {
      if (!fromWallet) {
        await wait(700);
        setPaymentStatus({
          variant: "loading",
          message: "Payment is being processed securely",
          payment: null,
        });
      }

      await wait(700);
      setPaymentStatus({
        variant: "loading",
        message: "Verifying payment and activating access",
        payment: null,
      });

      const response = await simulatePayment({
        method: getResolvedMethodLabel(),
        allowedStatuses: fromWallet
          ? ["SUCCESS", "FAILED", "PENDING"]
          : undefined,
      });
      const nextStatus = statusContent[response.status] || statusContent.PENDING;

      setPaymentStatus({
        variant: nextStatus.variant,
        message: `${nextStatus.message} via ${getMethodLabel()}`,
        payment: response,
      });

      if (response.status === "FAILED") {
        if (fromWallet) {
          if (flowType === "mobile-app") {
            setMobilePaymentModalStage("failed");
          } else {
            setWalletModalStage("failed");
          }
        }
        onNotify?.({
          variant: "error",
          title: "Payment failed",
          message: `Your ${getMethodLabel()} payment was declined. Please try again.`,
        });
      } else if (response.status === "PENDING") {
        if (fromWallet) {
          if (flowType === "mobile-app") {
            setMobilePaymentModalStage("failed");
          } else {
            setWalletModalStage("failed");
          }
        }
        onNotify?.({
          variant: "warning",
          title: "Payment pending",
          message: `We are still waiting for ${getMethodLabel()} confirmation.`,
        });
      }

      if (response.status === "SUCCESS") {
        if (fromWallet) {
          if (flowType === "mobile-app") {
            setMobilePaymentModalStage("success");
            await wait(850);
            setIsMobilePaymentModalOpen(false);
          } else {
            setWalletModalStage("success");
            await wait(850);
            setIsWalletModalOpen(false);
          }
        }

        await finalizeSuccessfulPayment(response);
      }
    } catch (error) {
      setPaymentStatus({
        variant: "error",
        message: error.message || "Payment request failed",
        payment: null,
      });
      if (fromWallet) {
        if (flowType === "mobile-app") {
          setMobilePaymentModalStage("failed");
        } else {
          setWalletModalStage("failed");
        }
      }
      onNotify?.({
        variant: "error",
        title: "Request failed",
        message: error.message || "Payment request failed",
      });
    } finally {
      setIsLoading(false);
    }
  }
  }

  async function handleMockPayment() {
    if (cartItems.length === 0) {
      onNotify?.({
        variant: "warning",
        title: "Cart is empty",
        message: "Add an item before trying to complete payment.",
      });
      return;
    }

    if (!validateBeforePayment()) {
      return;
    }

    if (requiresWalletModal()) {
      // Use device-specific payment flow
      if (flowType === "mobile-app") {
        // Mobile: show direct app opening flow
        setMobilePaymentModalStage("redirecting");
        setIsMobilePaymentModalOpen(true);
        setPaymentStatus({
          variant: "idle",
          message: `Opening ${getMethodLabel()} for payment`,
          payment: null,
        });
        await wait(1500);
        await runPaymentFlow({ fromWallet: true });
      } else {
        // Desktop: show QR code modal
        setWalletModalStage("scan");
        setIsWalletModalOpen(true);
        setPaymentStatus({
          variant: "idle",
          message: `Open the ${getMethodLabel()} QR modal and confirm on your phone`,
          payment: null,
        });
      }
      return;
    }

    await runPaymentFlow();
  }

  function handleRetryPayment() {
    setPaymentStatus({
      variant: "idle",
      message: "Ready to try payment again",
      payment: null,
    });
  }

  async function handleWalletConfirm() {
    setWalletModalStage("processing");
    await wait(1200);
    setWalletModalStage("verifying");
    await runPaymentFlow({ fromWallet: true });
  }

  function handleWalletClose() {
    if (isLoading) {
      return;
    }

    setIsWalletModalOpen(false);
    setWalletModalStage("scan");
  }

  function handleWalletRetry() {
    setWalletModalStage("scan");
  }

  function handleMobilePaymentClose() {
    if (isLoading) {
      return;
    }
    setIsMobilePaymentModalOpen(false);
    setMobilePaymentModalStage("processing");
  }

  function handleMobilePaymentRetry() {
    setMobilePaymentModalStage("redirecting");
    handleMockPayment();
  }

  function handleUpiInputChange(value) {
    onUpiChange(value);
    updateFieldError("upiId", {
      billingName,
      selectedMethod,
      upiId: value,
      cardDetails,
      selectedBank,
    });
  }

  function handleCardInputChange(field, value) {
    const nextCardDetails = {
      ...cardDetails,
      [field]: value,
    };

    onCardChange(field, value);
    updateFieldError(field, {
      billingName,
      selectedMethod,
      upiId,
      cardDetails: nextCardDetails,
      selectedBank,
    });
  }

  function handleBankInputChange(value) {
    onBankChange(value);
    updateFieldError("bank", {
      billingName,
      selectedMethod,
      upiId,
      cardDetails,
      selectedBank: value,
    });
  }

  function handleBillingNameInputChange(value) {
    onBillingNameChange(value);
    updateFieldError("billingName", {
      billingName: value,
      selectedMethod,
      upiId,
      cardDetails,
      selectedBank,
    });
  }

  return (
    <main style={paymentStyles.page}>
      <section style={paymentStyles.shell}>
        <div
          style={{
            ...paymentStyles.glow,
            inset: isMobile ? "-8px" : isCompact ? "-12px" : "-18px",
          }}
          aria-hidden="true"
        />

        <article
          style={{
            ...paymentStyles.card,
            gap: isMobile ? "24px" : "32px",
            padding: isMobile ? "18px" : isCompact ? "22px" : "clamp(20px, 4vw, 36px)",
            borderRadius: isMobile ? "26px" : "36px",
          }}
        >
          <div
            style={{
              ...paymentStyles.header,
              gap: isMobile ? "16px" : "24px",
            }}
          >
            <div style={paymentStyles.headerLeft}>
              <button
                type="button"
                onClick={onBackToCheckout}
                style={paymentStyles.backButton}
              >
                Back to Checkout
              </button>
              <span style={paymentStyles.badge}>BuildX Payments</span>
              <h1 style={paymentStyles.heading}>Complete your payment</h1>
              <p style={paymentStyles.subtext}>
                Confirm your method, finish securely, and unlock your access the moment
                payment succeeds.
              </p>
            </div>

            <span style={paymentStyles.securePill}>Secure Demo</span>
          </div>

          <CheckoutStepper activeStep="payment" compact={isCompact} mobile={isMobile} />

          <div
            style={{
              ...paymentStyles.layout,
              gridTemplateColumns: isCompact
                ? "minmax(0, 1fr)"
                : "minmax(0, 1.08fr) minmax(360px, 0.92fr)",
              gap: isMobile ? "16px" : "clamp(20px, 3vw, 28px)",
            }}
          >
            <div style={{ ...paymentStyles.leftColumn, gap: isMobile ? "16px" : "24px" }}>
              <section
                style={{
                  ...paymentStyles.productCard,
                  padding: isMobile ? "20px" : isCompact ? "24px" : "30px",
                  borderRadius: isMobile ? "24px" : "30px",
                }}
              >
                <div
                  style={{
                    ...paymentStyles.productTop,
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "14px" : "20px",
                  }}
                >
                  <div>
                    <p style={paymentStyles.productLabel}>Order</p>
                    <h2 style={paymentStyles.productTitle}>
                      {primaryItem?.title || "BuildX Starter Plan"}
                    </h2>
                    <p style={paymentStyles.productMeta}>{itemCount} item(s) in order</p>
                  </div>

                  <span style={paymentStyles.chip}>Payment Step</span>
                </div>

                <div
                  style={{
                    ...paymentStyles.divider,
                    margin: isMobile ? "20px 0" : "28px 0",
                  }}
                />

                <div
                  style={{
                    ...paymentStyles.amountRow,
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "flex-end",
                    gap: isMobile ? "16px" : "24px",
                  }}
                >
                  <div>
                    <p style={paymentStyles.amountLabel}>Payable now</p>
                    <p
                      style={{
                        ...paymentStyles.amountValue,
                        fontSize: isMobile ? "2.2rem" : "2.8rem",
                      }}
                    >
                      {formatCurrency(pricing.total)}
                    </p>
                  </div>

                  <div
                    style={{
                      ...paymentStyles.orderWrap,
                      justifyItems: isMobile ? "start" : "end",
                      textAlign: isMobile ? "left" : "right",
                    }}
                  >
                    <p style={paymentStyles.orderLabel}>Order ID</p>
                    <p style={paymentStyles.orderValue}>{orderId}</p>
                  </div>
                </div>
              </section>

              <PaymentMethodSelector
                methods={paymentMethods}
                selectedMethod={selectedMethod}
                onSelect={handleMethodSelect}
                disabled={isLoading}
                compact={isCompact}
                mobile={isMobile}
              />

              <PaymentMethodFields
                billingName={billingName}
                selectedMethod={selectedMethod}
                upiId={upiId}
                cardDetails={cardDetails}
                selectedBank={selectedBank}
                bankOptions={bankOptions}
                validationErrors={validationErrors}
                onBillingNameChange={handleBillingNameInputChange}
                onUpiChange={handleUpiInputChange}
                onCardChange={handleCardInputChange}
                onBankChange={handleBankInputChange}
                disabled={isLoading}
                isCompact={isCompact}
                isMobile={isMobile}
              />
            </div>

            <div style={{ ...paymentStyles.rightColumn, gap: isMobile ? "16px" : "24px" }}>
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

              <PaymentStatus
                variant={paymentStatus.variant}
                message={paymentStatus.message}
                payment={paymentStatus.payment}
                onRetry={paymentStatus.variant === "error" ? handleRetryPayment : null}
                compact={isCompact}
              />

              <div style={paymentStyles.buttonWrap}>
                <PaymentButton
                  label={
                    requiresWalletModal()
                      ? `Open ${getMethodLabel()} QR`
                      : `Pay with ${getMethodLabel()}`
                  }
                  onClick={handleMockPayment}
                  disabled={cartItems.length === 0}
                  loading={isLoading}
                  loadingLabel="Processing Payment..."
                  futureAction="mock-payment-request"
                />

                {isLoading ? (
                  <div style={paymentStyles.loaderWrap}>
                    <Loader
                      label={
                        paymentStatus.message || "Processing and verifying payment"
                      }
                      size="small"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      </section>

      <DesktopWalletModal
        open={isWalletModalOpen}
        methodLabel={getMethodLabel()}
        amount={formatCurrency(pricing.total)}
        orderId={orderId}
        stage={walletModalStage}
        compact={isCompact}
        mobile={isMobile}
        onClose={handleWalletClose}
        onConfirm={handleWalletConfirm}
        onRetry={handleWalletRetry}
      />

      <MobilePaymentModal
        open={isMobilePaymentModalOpen}
        methodLabel={getMethodLabel()}
        amount={formatCurrency(pricing.total)}
        orderId={orderId}
        stage={mobilePaymentModalStage}
        compact={isCompact}
        onClose={handleMobilePaymentClose}
        onRetry={handleMobilePaymentRetry}
      />
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

const paymentStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(12px, 3vw, 40px) clamp(12px, 3vw, 28px)",
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
    borderRadius: "clamp(24px, 5vw, 36px)",
    padding: "clamp(16px, 3vw, 36px)",
    background: "rgba(8, 15, 27, 0.78)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
    backdropFilter: "blur(18px)",
    color: "#f8fafc",
    display: "grid",
    gap: "clamp(20px, 3vw, 32px)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "clamp(12px, 3vw, 24px)",
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
    transition: "transform 180ms ease, border-color 180ms ease",
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
    fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
    fontWeight: 800,
  },
  subtext: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "1rem",
    lineHeight: 1.7,
    maxWidth: "560px",
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
    gap: "clamp(16px, 2.5vw, 28px)",
    alignItems: "start",
  },
  leftColumn: {
    display: "grid",
    gap: "clamp(14px, 2.5vw, 24px)",
  },
  rightColumn: {
    display: "grid",
    gap: "clamp(14px, 2.5vw, 24px)",
  },
  productCard: {
    padding: "clamp(16px, 4vw, 30px)",
    borderRadius: "clamp(24px, 5vw, 30px)",
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
  productLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  productTitle: {
    margin: "14px 0 8px",
    fontSize: "1.46rem",
    fontWeight: 700,
    letterSpacing: "-0.03em",
  },
  productMeta: {
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
    margin: "clamp(12px, 3vw, 28px) 0",
    background:
      "linear-gradient(90deg, rgba(148, 163, 184, 0), rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0))",
  },
  amountRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "clamp(12px, 3vw, 24px)",
    flexWrap: "wrap",
  },
  amountLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.88rem",
  },
  amountValue: {
    margin: "clamp(6px, 2vw, 12px) 0 0",
    fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
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
  buttonWrap: {
    display: "grid",
    gap: "clamp(10px, 2vw, 18px)",
    paddingTop: "clamp(0px, 1vw, 4px)",
  },
  loaderWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
  },
};

export default Payment;
