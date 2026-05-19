import { useState } from "react";

import Loader from "../components/Loader.jsx";
import PaymentButton from "../components/PaymentButton.jsx";
import PaymentStatus from "../components/PaymentStatus.jsx";
import ToastMessage from "../components/ToastMessage.jsx";
import {
  createOrder,
  fetchPaymentStatus,
  verifyPayment,
} from "../services/paymentService.js";

const mockScenarios = [
  { value: "SUCCESS", label: "Successful payment" },
  { value: "FAILED", label: "Failed payment" },
  { value: "PENDING", label: "Pending payment" },
];

const resultContentMap = {
  SUCCESS: {
    variant: "success",
    title: "Mock payment completed",
    message: "The transaction was marked successful and saved in mock history.",
  },
  FAILED: {
    variant: "error",
    title: "Mock payment failed",
    message: "The transaction was marked failed and can be retried safely.",
  },
  PENDING: {
    variant: "pending",
    title: "Mock payment is still pending",
    message:
      "The transaction is still waiting for a final status. You can retry the flow any time.",
  },
};

function Checkout({ onPaymentComplete }) {
  const [selectedScenario, setSelectedScenario] = useState("SUCCESS");
  const [isLoading, setIsLoading] = useState(false);
  const [statusVariant, setStatusVariant] = useState("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Choose a mock payment result and click Pay Now to test the flow."
  );
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [mockAmount, setMockAmount] = useState("499.99");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("info");

  async function handlePayment() {
    setIsLoading(true);
    setStatusVariant("loading");
    setStatusMessage("Creating mock order and starting payment request...");
    setPaymentDetails(null);
    setToastVariant("info");
    setToastMessage("Starting a new mock payment attempt...");

    try {
      const orderResponse = await createOrder();
      const createdOrder = orderResponse.data;

      setMockAmount(Number(createdOrder.amount).toFixed(2));
      setStatusMessage("Order created. Verifying mock payment result...");
      setToastMessage(orderResponse.message);

      // The frontend sends the chosen scenario to the mock backend so we can
      // test different business outcomes without integrating a real gateway yet.
      let verificationResponse = await verifyPayment({
        paymentId: createdOrder.payment_id,
        status: selectedScenario,
      });
      let verificationDetails = {
        ...createdOrder,
        ...verificationResponse.data,
      };

      setPaymentDetails(verificationDetails);

      if (verificationDetails.status === "PENDING") {
        setStatusVariant("pending");
        setStatusMessage(
          "Payment is pending. We will check the latest status shortly."
        );
        setToastVariant("warning");
        setToastMessage("The payment is pending. Checking one more time...");

        // A pending payment usually needs one more backend lookup before the
        // final transaction result is presented to the user.
        await new Promise((resolve) => window.setTimeout(resolve, 1800));

        const statusResponse = await fetchPaymentStatus(verificationDetails.payment_id);
        verificationDetails = {
          ...verificationDetails,
          ...statusResponse.data,
        };

        verificationResponse = statusResponse;
        setPaymentDetails(verificationDetails);
      }

      const resultContent =
        resultContentMap[verificationDetails.status] || resultContentMap.PENDING;

      setStatusVariant(resultContent.variant);
      setStatusMessage(resultContent.message);
      setToastVariant(
        resultContent.variant === "pending"
          ? "warning"
          : resultContent.variant === "error"
            ? "error"
            : "success"
      );
      setToastMessage(verificationResponse.message);

      onPaymentComplete({
        ...resultContent,
        apiMessage: verificationResponse.message,
        paymentDetails: verificationDetails,
      });
    } catch (error) {
      setToastVariant("error");
      setToastMessage(error.message || "Something went wrong during payment.");
      setStatusVariant("error");
      setStatusMessage(
        error.message || "Something went wrong while processing payment."
      );
      setPaymentDetails(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)",
        fontFamily:
          "Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          borderRadius: "1.2rem",
          padding: "1.5rem",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#64748b",
          }}
        >
          Mock Checkout
        </p>
        <h1 style={{ margin: "0.4rem 0 0.75rem", color: "#0f172a" }}>
          Test the payment flow
        </h1>
        <p style={{ margin: "0 0 1.5rem", color: "#475569", lineHeight: 1.6 }}>
          This screen uses the mock backend only. It is safe for frontend testing
          and future Razorpay integration work.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <ToastMessage message={toastMessage} variant={toastVariant} />
        </div>

        <div
          style={{
            padding: "1rem",
            borderRadius: "0.9rem",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            marginBottom: "1rem",
          }}
        >
          <div style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Amount to pay
          </div>
          <div
            style={{
              marginTop: "0.35rem",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            ${mockAmount}
          </div>
        </div>

        <label
          htmlFor="payment-scenario"
          style={{
            display: "block",
            marginBottom: "0.45rem",
            color: "#334155",
            fontWeight: 600,
          }}
        >
          Mock payment scenario
        </label>
        <select
          id="payment-scenario"
          value={selectedScenario}
          onChange={(event) => setSelectedScenario(event.target.value)}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.85rem 1rem",
            borderRadius: "0.75rem",
            border: "1px solid #cbd5e1",
            backgroundColor: "#ffffff",
            color: "#0f172a",
            marginBottom: "1rem",
          }}
        >
          {mockScenarios.map((scenario) => (
            <option key={scenario.value} value={scenario.value}>
              {scenario.label}
            </option>
          ))}
        </select>

        <PaymentButton isLoading={isLoading} onClick={handlePayment}>
          {isLoading ? <Loader label="Processing payment..." size="small" /> : "Pay Now"}
        </PaymentButton>

        <div style={{ marginTop: "1rem" }}>
          <PaymentStatus
            variant={statusVariant}
            message={statusMessage}
            paymentDetails={paymentDetails}
          />
        </div>

        {statusVariant === "loading" ? (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.9rem 1rem",
              borderRadius: "0.9rem",
              backgroundColor: "#f8fafc",
              border: "1px dashed #cbd5e1",
            }}
          >
            <Loader label="Contacting the mock payment backend..." />
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default Checkout;
