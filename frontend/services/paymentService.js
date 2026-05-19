const API_BASE_URL =
  import.meta.env.VITE_PAYMENT_API_BASE_URL || "/backend/api";

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function createOrder() {
  return requestJson(`${API_BASE_URL}/create-order.php`);
}

export async function verifyPayment(status) {
  const query = new URLSearchParams({ status });
  return requestJson(`${API_BASE_URL}/verify-payment.php?${query.toString()}`);
}

export async function fetchPaymentStatus(paymentId) {
  const query = new URLSearchParams({ payment_id: paymentId });
  return requestJson(`${API_BASE_URL}/payment-status.php?${query.toString()}`);
}
