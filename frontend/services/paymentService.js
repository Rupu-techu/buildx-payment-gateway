const mockStatuses = ["SUCCESS", "FAILED", "PENDING"];

function createMockPaymentId() {
  return `pay_mock_${Math.floor(Math.random() * 1000)}`;
}

export async function simulatePayment(paymentContext = {}) {
  // This timeout simulates the wait time of a real API request so the
  // frontend can show loading and result states before real integration.
  await new Promise((resolve) => {
    window.setTimeout(resolve, 1400);
  });

  const randomStatus =
    mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

  return {
    success: randomStatus === "SUCCESS",
    paymentId: createMockPaymentId(),
    status: randomStatus,
    method: paymentContext.method || "Mock Method",
  };
}
