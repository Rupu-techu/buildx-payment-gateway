<?php

// Mock API endpoint for creating a payment order.
// This returns a fake order and payment reference for frontend testing.

require_once __DIR__ . '/../models/Payment.php';

header('Content-Type: application/json');

$orderData = Payment::createMockOrder();

echo Payment::buildResponse(true, 'Order created', $orderData);
