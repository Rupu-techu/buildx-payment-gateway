import { useEffect } from "react";

import ToastMessage from "./ToastMessage.jsx";

function ToastViewport({ toasts, onDismiss }) {
  useEffect(() => {
    if (!toasts.length) {
      return undefined;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => onDismiss(toast.id), toast.duration ?? 3400)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onDismiss, toasts]);

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 999,
        width: "min(360px, calc(100vw - 24px))",
        display: "grid",
        gap: "12px",
      }}
    >
      {toasts.map((toast) => (
        <ToastMessage
          key={toast.id}
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastViewport;
