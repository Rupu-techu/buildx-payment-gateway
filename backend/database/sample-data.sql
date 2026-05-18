-- Sample transaction records for local development and testing.
-- These entries represent successful, failed, and pending payment states.

INSERT INTO transactions (
    order_id,
    payment_id,
    user_id,
    amount,
    currency,
    status,
    gateway_response
) VALUES
(
    'ORD-1001',
    'PAY-2001',
    101,
    149.99,
    'USD',
    'successful',
    JSON_OBJECT(
        'gateway', 'stripe',
        'message', 'Payment captured successfully',
        'code', 'PAYMENT_SUCCESS'
    )
),
(
    'ORD-1002',
    'PAY-2002',
    102,
    89.50,
    'USD',
    'failed',
    JSON_OBJECT(
        'gateway', 'razorpay',
        'message', 'Payment authorization failed',
        'code', 'AUTH_FAILED'
    )
),
(
    'ORD-1003',
    'PAY-2003',
    103,
    220.00,
    'USD',
    'pending',
    JSON_OBJECT(
        'gateway', 'paypal',
        'message', 'Payment is awaiting confirmation',
        'code', 'PENDING_CONFIRMATION'
    )
);
