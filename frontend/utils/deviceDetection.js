/**
 * Device detection utilities for mobile vs desktop payment flows
 */

/**
 * Check if the current viewport is mobile (< 768px width)
 * @returns {boolean}
 */
export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if device is likely a mobile device based on user agent
 * @returns {boolean}
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}

/**
 * Determine payment flow type based on device and screen
 * Returns 'mobile-app' for direct mobile app opening,
 * 'desktop-qr' for QR code scanning on desktop
 * @returns {'mobile-app' | 'desktop-qr'}
 */
export function getPaymentFlowType() {
  const isMobile = isMobileViewport() || isMobileDevice();
  return isMobile ? 'mobile-app' : 'desktop-qr';
}

/**
 * Get responsive breakpoint
 * @returns {'xs' | 'sm' | 'md' | 'lg' | 'xl'}
 */
export function getBreakpoint() {
  if (typeof window === 'undefined') return 'md';
  const width = window.innerWidth;
  if (width < 480) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1440) return 'lg';
  return 'xl';
}


