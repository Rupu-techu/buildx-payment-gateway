export function sanitizeUpiId(value = "") {
  return value.replace(/\s+/g, "").toLowerCase();
}

export function sanitizeCardInput(field, value = "") {
  if (field === "number") {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  if (field === "expiry") {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) {
      return digits;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  if (field === "cvv") {
    return value.replace(/\D/g, "").slice(0, 4);
  }

  return value.replace(/\s{2,}/g, " ").trimStart();
}

export function validatePaymentDetails({
  billingName,
  selectedMethod,
  upiId,
  cardDetails,
  selectedBank,
}) {
  const errors = {};

  if (!billingName.trim()) {
    errors.billingName = "Billing name is required.";
  } else if (billingName.trim().length < 3) {
    errors.billingName = "Enter the full billing name.";
  }

  if (selectedMethod === "UPI") {
    if (!upiId.trim()) {
      errors.upiId = "UPI ID is required.";
    } else if (!/^[a-z0-9.\-_]{2,}@[a-z]{2,}$/i.test(upiId.trim())) {
      errors.upiId = "Enter a valid UPI ID like name@bank.";
    }
  }

  if (selectedMethod === "CARD") {
    if (!cardDetails.name.trim()) {
      errors.name = "Cardholder name is required.";
    } else if (cardDetails.name.trim().length < 3) {
      errors.name = "Enter the full cardholder name.";
    }

    const cardNumber = cardDetails.number.replace(/\s/g, "");

    if (!cardNumber) {
      errors.number = "Card number is required.";
    } else if (cardNumber.length < 13 || cardNumber.length > 19 || !passesLuhn(cardNumber)) {
      errors.number = "Enter a valid card number.";
    }

    if (!cardDetails.expiry.trim()) {
      errors.expiry = "Expiry date is required.";
    } else if (!isExpiryValid(cardDetails.expiry.trim())) {
      errors.expiry = "Enter a valid future expiry in MM/YY format.";
    }

    if (!cardDetails.cvv.trim()) {
      errors.cvv = "CVV is required.";
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv.trim())) {
      errors.cvv = "Enter a valid CVV.";
    }
  }

  if (selectedMethod === "NET_BANKING" && !selectedBank.trim()) {
    errors.bank = "Choose a bank to continue.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function isExpiryValid(value) {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return false;
  }

  const [monthText, yearText] = value.split("/");
  const month = Number(monthText);
  const year = Number(`20${yearText}`);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);

  return expiryDate >= now;
}

function passesLuhn(numberText) {
  if (!/^\d+$/.test(numberText)) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let index = numberText.length - 1; index >= 0; index -= 1) {
    let digit = Number(numberText[index]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
