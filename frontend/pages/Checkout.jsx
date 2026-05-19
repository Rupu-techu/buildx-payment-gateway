import { useEffect, useState } from "react";

import PaymentButton from "../components/PaymentButton.jsx";
import PaymentStatus from "../components/PaymentStatus.jsx";
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

function Checkout() {
  const [selectedScenario, setSelectedScenario] = useState("SUCCESS");
  const [isLoading, setIsLoading] = useState(false);
  const [statusVariant, setStatusVariant] = useState("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Choose a mock payment result and click Pay Now to test the flow."
  );
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [mockAmount, setMockAmount] = useState("499.99");

  useEffect(() => {
    if (statusVariant !== "pending" || !paymentDetails?.payment_id) {
      return undefined;
    }

    // When the payment is pending, we wait briefly and then check the mock
    // status endpoint so the UI can demonstrate a follow-up payment update.
    const timeoutId = window.setTimeout(async () => {
      try {
        setStatusMessage("Payment is still pending. Checking latest status...");

        const statusResponse = await fetchPaymentStatus(paymentDetails.payment_id);
        const latestDetails = {
          ...paymentDetails,
          ...statusResponse.data,
        };

        setPaymentDetails(latestDetails);

        if (latestDetails.status === "SUCCESS") {
          setStatusVariant("success");
          setStatusMessage("Pending payment moved to success.");
        } else if (latestDetails.status === "FAILED") {
          setStatusVariant("error");
          setStatusMessage("Pending payment moved to failed.");
        } else {
          setStatusMessage(
            "Payment is still pending. You can trigger another test run anytime."
          );
        }
      } catch (error) {
        setStatusVariant("error");
        setStatusMessage(
          error.message || "Could not fetch the latest payment status."
        );
      }
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [paymentDetails, statusVariant]);

  async function handlePayment() {
    setIsLoading(true);
    setStatusVariant("loading");
    setStatusMessage("Creating mock order and starting payment request...");
    setPaymentDetails(null);

    try {
      const orderResponse = await createOrder();
      const createdOrder = orderResponse.data;

      setMockAmount(Number(createdOrder.amount).toFixed(2));
      setStatusMessage("Order created. Verifying mock payment result...");

      // We pass the selected scenario to the backend so we can test
      // success, failure, and pending states on demand.
      const verificationResponse = await verifyPayment(selectedScenario);
      const verificationDetails = {
        ...createdOrder,
        ...verificationResponse.data,
      };

      setPaymentDetails(verificationDetails);

      if (verificationDetails.status === "SUCCESS") {
        setStatusVariant("success");
        setStatusMessage("Payment completed successfully.");
      } else if (verificationDetails.status === "FAILED") {
        setStatusVariant("error");
        setStatusMessage("Payment failed in the mock flow.");
      } else {
        setStatusVariant("pending");
        setStatusMessage(
          "Payment is pending. We will check the latest status shortly."
        );
      }
    } catch (error) {
      setStatusVariant("error");
      setStatusMessage(
        error.message || "Something went wrong while processing payment."
      );
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

        <PaymentButton isLoading={isLoading} onClick={handlePayment} />

        <div style={{ marginTop: "1rem" }}>
          <PaymentStatus
            variant={statusVariant}
            message={statusMessage}
            paymentDetails={paymentDetails}
          />
        </div>
      </section>
    </main>
  );
}

export default Checkout;
