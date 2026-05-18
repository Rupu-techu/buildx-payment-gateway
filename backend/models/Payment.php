<?php

// Simple mock payment model used to keep API response formatting consistent.
// This can later evolve into a real model with database and gateway logic.

class Payment
{
    public static function createMockOrder(): array
    {
        $orderId = 'ORD-' . strtoupper(substr(uniqid(), -8));
        $paymentId = 'PAY-' . strtoupper(substr(uniqid('', true), -8));

        return [
            'order_id' => $orderId,
            'payment_id' => $paymentId,
            'amount' => 499.99,
            'currency' => 'USD',
            'status' => 'PENDING',
        ];
    }

    public static function verifyMockPayment(?string $status = null): array
    {
        $normalizedStatus = strtoupper((string) $status);
        $allowedStatuses = ['SUCCESS', 'FAILED', 'PENDING'];

        if (!in_array($normalizedStatus, $allowedStatuses, true)) {
            $normalizedStatus = 'SUCCESS';
        }

        return [
            'payment_id' => 'PAY-' . strtoupper(substr(uniqid(), -8)),
            'order_id' => 'ORD-' . strtoupper(substr(uniqid(), -8)),
            'status' => $normalizedStatus,
        ];
    }

    public static function getMockPaymentStatus(?string $paymentId = null): array
    {
        $statuses = ['SUCCESS', 'FAILED', 'PENDING'];
        $status = $statuses[array_rand($statuses)];

        return [
            'payment_id' => $paymentId ?: 'PAY-' . strtoupper(substr(uniqid(), -8)),
            'status' => $status,
            'updated_at' => date('Y-m-d H:i:s'),
        ];
    }

    public static function buildResponse(bool $success, string $message, array $data = []): string
    {
        return json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ], JSON_PRETTY_PRINT);
    }
}
