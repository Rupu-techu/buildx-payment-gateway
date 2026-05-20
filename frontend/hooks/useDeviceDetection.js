import { useState, useEffect } from "react";
import { isMobileViewport, getBreakpoint, getPaymentFlowType } from "../utils/deviceDetection.js";

/**
 * Hook for monitoring viewport changes and device state
 * @returns {{isMobile: boolean, breakpoint: string, flowType: string}}
 */
export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(isMobileViewport());
  const [breakpoint, setBreakpoint] = useState(getBreakpoint());
  const [flowType, setFlowType] = useState(getPaymentFlowType());

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileViewport());
      setBreakpoint(getBreakpoint());
      setFlowType(getPaymentFlowType());
    }

    const resizeObserver = new ResizeObserver(handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return { isMobile, breakpoint, flowType };
}
