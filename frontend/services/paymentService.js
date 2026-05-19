const API_BASE_URL =
  import.meta.env.VITE_PAYMENT_API_BASE_URL || "/backend/api";

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);

  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    throw new Error("The server returned an unreadable response.");
  }

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}`
    );
  }

  if (!payload?.success) {
    const firstError = Array.isArray(payload?.errors) ? payload.errors[0] : null;
    throw new Error(
      firstError || payload?.message || "The request could not be completed."
    );
  }

  return payload;
}

export async function createOrder() {
  return requestJson(`${API_BASE_URL}/create-order.php`, {
    method: "POST",
  });
}

export async function verifyPayment({ paymentId, status }) {
  return requestJson(`${API_BASE_URL}/verify-payment.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payment_id: paymentId,
      status,
    }),
  });
}

export async function fetchPaymentStatus(paymentId) {
  const query = new URLSearchParams({ payment_id: paymentId });
  return requestJson(`${API_BASE_URL}/payment-status.php?${query.toString()}`);
}

export async function fetchTransactionHistory() {
  return requestJson(`${API_BASE_URL}/transaction-history.php`);
}
