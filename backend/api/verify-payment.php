<?php

// Mock API endpoint for verifying payment results.
// This updates the saved mock transaction without using a real gateway.

require_once __DIR__ . '/../models/Payment.php';

header('Content-Type: application/json');

$rawPayload = file_get_contents('php://input');
$payload = json_decode($rawPayload ?: '[]', true);
$payload = is_array($payload) ? $payload : [];

$requestedStatus = $payload['status'] ?? $_GET['status'] ?? null;
$paymentId = $payload['payment_id'] ?? $_GET['payment_id'] ?? null;

try {
    $paymentData = Payment::verifyMockPayment($paymentId, $requestedStatus);

    echo Payment::buildResponse(
        true,
        'Mock payment verification completed successfully.',
        $paymentData
    );
} catch (Throwable $exception) {
    http_response_code(422);

    echo Payment::buildResponse(
        false,
        'Could not verify mock payment.',
        [],
        [],
        [$exception->getMessage()]
    );
}
