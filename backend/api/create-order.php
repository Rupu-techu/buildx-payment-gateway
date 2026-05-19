<?php

// Mock API endpoint for creating a payment order.
// This returns and stores a fake order for frontend testing.

require_once __DIR__ . '/../models/Payment.php';

header('Content-Type: application/json');

try {
    $orderData = Payment::createMockOrder();

    echo Payment::buildResponse(
        true,
        'Mock order created successfully.',
        $orderData
    );
} catch (Throwable $exception) {
    http_response_code(500);

    echo Payment::buildResponse(
        false,
        'Could not create mock order.',
        [],
        [],
        [$exception->getMessage()]
    );
}
