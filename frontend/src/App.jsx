import { useState } from "react";

import Checkout from "../pages/Checkout.jsx";
import PaymentResult from "../pages/PaymentResult.jsx";

function App() {
  const [paymentResult, setPaymentResult] = useState(null);

  if (paymentResult) {
    return (
      <PaymentResult
        paymentResult={paymentResult}
        onRetry={() => setPaymentResult(null)}
      />
    );
  }

  return <Checkout onPaymentComplete={setPaymentResult} />;
}

export default App;
