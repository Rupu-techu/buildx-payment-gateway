<?php

// Mock API endpoint for checking the current status of a payment.
// This helps the frontend test polling and status display behavior.

require_once __DIR__ . '/../models/Payment.php';

header('Content-Type: application/json');

$paymentId = $_GET['payment_id'] ?? null;

try {
    $statusData = Payment::getMockPaymentStatus($paymentId);

    echo Payment::buildResponse(
        true,
        'Mock payment status fetched successfully.',
        $statusData
    );
} catch (Throwable $exception) {
    http_response_code(404);

    echo Payment::buildResponse(
        false,
        'Could not fetch mock payment status.',
        [],
        [],
        [$exception->getMessage()]
    );
}
