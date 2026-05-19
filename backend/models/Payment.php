<?php

// Simple mock payment model used to keep API response formatting consistent.
// This can later evolve into a real model with database and gateway logic.

class Payment
{
    private const STORAGE_FILE = __DIR__ . '/../storage/mock-transactions.json';

    public static function createMockOrder(): array
    {
        $orderId = 'ORD-' . strtoupper(substr(uniqid(), -8));
        $paymentId = 'PAY-' . strtoupper(substr(uniqid('', true), -8));
        $timestamp = self::now();

        $transaction = [
            'order_id' => $orderId,
            'payment_id' => $paymentId,
            'user_id' => 1001,
            'amount' => 499.99,
            'currency' => 'USD',
            'status' => 'PENDING',
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
            'completed_at' => null,
            'gateway_response' => [
                'step' => 'order_created',
                'message' => 'Mock payment order created for frontend testing.',
            ],
        ];

        $transactions = self::readTransactions();
        $transactions[] = $transaction;
        self::writeTransactions($transactions);

        return $transaction;
    }

    public static function verifyMockPayment(?string $paymentId = null, ?string $status = null): array
    {
        $normalizedStatus = self::normalizeStatus($status);
        $transactions = self::readTransactions();
        $transactionIndex = self::findTransactionIndex($transactions, $paymentId);

        if ($transactionIndex === null) {
            throw new RuntimeException('Transaction not found for verification.');
        }

        $transactions[$transactionIndex]['status'] = $normalizedStatus;
        $transactions[$transactionIndex]['updated_at'] = self::now();
        $transactions[$transactionIndex]['completed_at'] = $normalizedStatus === 'PENDING'
            ? null
            : $transactions[$transactionIndex]['updated_at'];
        $transactions[$transactionIndex]['gateway_response'] = [
            'step' => 'payment_verified',
            'requested_status' => $normalizedStatus,
            'message' => 'Mock payment verification completed.',
        ];

        self::writeTransactions($transactions);

        return $transactions[$transactionIndex];
    }

    public static function getMockPaymentStatus(?string $paymentId = null): array
    {
        $transactions = self::readTransactions();
        $transactionIndex = self::findTransactionIndex($transactions, $paymentId);

        if ($transactionIndex === null) {
            throw new RuntimeException('Transaction not found for status lookup.');
        }

        // Pending payments simulate a later callback or status poll from the gateway.
        if ($transactions[$transactionIndex]['status'] === 'PENDING') {
            $statuses = ['SUCCESS', 'FAILED', 'PENDING'];
            $resolvedStatus = $statuses[array_rand($statuses)];

            $transactions[$transactionIndex]['status'] = $resolvedStatus;
            $transactions[$transactionIndex]['updated_at'] = self::now();
            $transactions[$transactionIndex]['completed_at'] = $resolvedStatus === 'PENDING'
                ? null
                : $transactions[$transactionIndex]['updated_at'];
            $transactions[$transactionIndex]['gateway_response'] = [
                'step' => 'status_checked',
                'resolved_status' => $resolvedStatus,
                'message' => 'Mock payment status checked after pending state.',
            ];

            self::writeTransactions($transactions);
        }

        return $transactions[$transactionIndex];
    }

    public static function getMockTransactionHistory(): array
    {
        $transactions = self::readTransactions();

        usort($transactions, static function (array $left, array $right): int {
            return strcmp($right['updated_at'], $left['updated_at']);
        });

        return $transactions;
    }

    public static function buildResponse(
        bool $success,
        string $message,
        array $data = [],
        array $meta = [],
        array $errors = []
    ): string {
        return json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'meta' => $meta,
            'errors' => $errors,
            'timestamp' => self::now(),
        ], JSON_PRETTY_PRINT);
    }

    private static function normalizeStatus(?string $status = null): string
    {
        $normalizedStatus = strtoupper((string) $status);
        $allowedStatuses = ['SUCCESS', 'FAILED', 'PENDING'];

        if (!in_array($normalizedStatus, $allowedStatuses, true)) {
            return 'SUCCESS';
        }

        return $normalizedStatus;
    }

    private static function readTransactions(): array
    {
        self::ensureStorage();

        $contents = file_get_contents(self::STORAGE_FILE);

        if ($contents === false || trim($contents) === '') {
            return [];
        }

        $transactions = json_decode($contents, true);

        return is_array($transactions) ? $transactions : [];
    }

    private static function writeTransactions(array $transactions): void
    {
        self::ensureStorage();

        file_put_contents(
            self::STORAGE_FILE,
            json_encode($transactions, JSON_PRETTY_PRINT),
            LOCK_EX
        );
    }

    private static function ensureStorage(): void
    {
        $directory = dirname(self::STORAGE_FILE);

        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        if (!file_exists(self::STORAGE_FILE)) {
            file_put_contents(self::STORAGE_FILE, "[]");
        }
    }

    private static function findTransactionIndex(array $transactions, ?string $paymentId = null): ?int
    {
        if ($paymentId === null || $paymentId === '') {
            return null;
        }

        foreach ($transactions as $index => $transaction) {
            if (($transaction['payment_id'] ?? null) === $paymentId) {
                return $index;
            }
        }

        return null;
    }

    private static function now(): string
    {
        return date('Y-m-d H:i:s');
    }
}
