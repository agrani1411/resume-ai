"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "error" | "success";
  onClose: () => void;
}

export function Toast({ message, type = "error", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = type === "error"
    ? "bg-red-50 border-red-200 text-red-800"
    : "bg-green-50 border-green-200 text-green-800";

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${colors} shadow-lg max-w-md`}>
      <div className="flex items-center justify-between">
        <p className="text-sm">{message}</p>
        <button onClick={onClose} className="ml-4 text-current opacity-50 hover:opacity-100">&times;</button>
      </div>
    </div>
  );
}
