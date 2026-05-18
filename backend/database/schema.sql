-- Payment Gateway Module
-- Base schema for transaction logging and payment status tracking.

CREATE TABLE transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL COMMENT 'Internal ecommerce order reference linked to the payment attempt',
    payment_id VARCHAR(100) NOT NULL UNIQUE COMMENT 'Gateway-side or system-side unique payment reference',
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'Identifier of the customer or user who initiated the payment',
    amount DECIMAL(12, 2) NOT NULL COMMENT 'Transaction amount stored in major currency units',
    currency CHAR(3) NOT NULL DEFAULT 'USD' COMMENT 'ISO 4217 currency code such as USD or INR',
    status ENUM('pending', 'successful', 'failed') NOT NULL DEFAULT 'pending' COMMENT 'Current payment lifecycle status',
    gateway_response JSON NULL COMMENT 'Raw or structured response returned by the payment gateway',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    INDEX idx_order_id (order_id),
    INDEX idx_payment_id (payment_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
