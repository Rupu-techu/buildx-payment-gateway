<?php

// Mock API endpoint for verifying payment results.
// This simulates a payment verification response without using a real gateway.

require_once __DIR__ . '/../models/Payment.php';

header('Content-Type: application/json');

$requestedStatus = $_GET['status'] ?? null;
$paymentData = Payment::verifyMockPayment($requestedStatus);
$isSuccessful = $paymentData['status'] === 'SUCCESS';

echo Payment::buildResponse(
    $isSuccessful,
    'Payment verification completed',
    $paymentData
);
