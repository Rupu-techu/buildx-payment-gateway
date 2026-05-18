<?php

// Mock API endpoint for checking the current status of a payment.
// This helps the frontend test polling and status display behavior.

require_once __DIR__ . '/../models/Payment.php';

header('Content-Type: application/json');

$paymentId = $_GET['payment_id'] ?? null;
$statusData = Payment::getMockPaymentStatus($paymentId);
$isSuccessful = $statusData['status'] !== 'FAILED';

echo Payment::buildResponse(
    $isSuccessful,
    'Payment status fetched',
    $statusData
);
