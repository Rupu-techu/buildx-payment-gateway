<?php

// Mock API endpoint for listing saved transaction attempts.
// This supports frontend transaction history screens without a real database.

require_once __DIR__ . '/../models/Payment.php';

header('Content-Type: application/json');

try {
    $transactions = Payment::getMockTransactionHistory();

    echo Payment::buildResponse(
        true,
        'Transaction history fetched successfully.',
        ['transactions' => $transactions],
        ['count' => count($transactions)]
    );
} catch (Throwable $exception) {
    http_response_code(500);

    echo Payment::buildResponse(
        false,
        'Could not fetch transaction history.',
        [],
        [],
        [$exception->getMessage()]
    );
}
