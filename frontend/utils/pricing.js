const GST_RATE = 0.18;
const LOW_ORDER_PLATFORM_FEE = 12;
const STANDARD_PLATFORM_FEE = 29;
const PREMIUM_ORDER_PLATFORM_FEE = 39;
const PLATFORM_FEE_WAIVER_THRESHOLD = 2000;

export const couponCatalog = {
  SAVE10: {
    code: "SAVE10",
    label: "10% OFF",
    type: "percentage",
    value: 10,
    maxDiscount: 180,
    minSubtotal: 300,
  },
  FIRST50: {
    code: "FIRST50",
    label: "Rs.50 OFF",
    type: "flat",
    value: 50,
    minSubtotal: 499,
  },
};

export function normalizeCouponCode(code = "") {
  return code.trim().toUpperCase();
}

export function resolveCoupon(rawCode, subtotal) {
  const code = normalizeCouponCode(rawCode);

  if (!code) {
    return {
      code: "",
      status: "idle",
      message: "Apply SAVE10 or FIRST50 to unlock a mock discount.",
      coupon: null,
      discount: 0,
    };
  }

  const coupon = couponCatalog[code];

  if (!coupon) {
    return {
      code: "",
      status: "invalid",
      message: "Coupon not recognized. Try SAVE10 or FIRST50.",
      coupon: null,
      discount: 0,
    };
  }

  if (subtotal < coupon.minSubtotal) {
    return {
      code: "",
      status: "invalid",
      message: `${coupon.code} unlocks at ${formatCurrency(coupon.minSubtotal)} or above.`,
      coupon,
      discount: 0,
    };
  }

  const rawDiscount =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  const discount = Math.min(rawDiscount, coupon.maxDiscount ?? rawDiscount, subtotal);

  return {
    code: coupon.code,
    status: "applied",
    message: `${coupon.code} applied: ${coupon.label}`,
    coupon,
    discount,
  };
}

export function calculatePricing({ cartItems, couponCode }) {
  const subtotal = cartItems.reduce(
    (runningTotal, item) => runningTotal + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce(
    (runningCount, item) => runningCount + item.quantity,
    0
  );

  // The fee tiers keep the demo feeling closer to a marketplace checkout
  // while staying readable for beginners.
  const platformFee =
    subtotal === 0
      ? 0
      : subtotal >= PLATFORM_FEE_WAIVER_THRESHOLD
        ? 0
        : subtotal < 300
          ? LOW_ORDER_PLATFORM_FEE
          : subtotal < 1000
            ? STANDARD_PLATFORM_FEE
            : PREMIUM_ORDER_PLATFORM_FEE;

  const couponResult = resolveCoupon(couponCode, subtotal);
  const taxableAmount = Math.max(subtotal + platformFee - couponResult.discount, 0);
  const gst = Math.round(taxableAmount * GST_RATE);
  const total = Math.max(subtotal + platformFee + gst - couponResult.discount, 0);
  const platformSavings =
    subtotal >= PLATFORM_FEE_WAIVER_THRESHOLD ? PREMIUM_ORDER_PLATFORM_FEE : 0;
  const totalSaved = couponResult.discount + platformSavings;

  return {
    subtotal,
    itemCount,
    platformFee,
    gst,
    discount: couponResult.discount,
    total,
    totalSaved,
    appliedCoupon: couponResult.code,
    couponStatus: couponResult.status,
    couponMessage: couponResult.message,
    couponMeta: couponResult.coupon,
    rules: {
      gstRate: GST_RATE,
      platformFeeWaiverThreshold: PLATFORM_FEE_WAIVER_THRESHOLD,
    },
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
