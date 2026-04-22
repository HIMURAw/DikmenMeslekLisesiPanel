"use client";

import { useToast } from "@/lib/toast-context";
import * as LucideIcons from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div className="space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl border animate-in fade-in slide-in-from-top-5 duration-300 shadow-2xl ${
              toast.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-100"
                : toast.type === "error"
                ? "bg-rose-500/20 border-rose-500/30 text-rose-100"
                : "bg-cyan-500/20 border-cyan-500/30 text-cyan-100"
            }`}
          >
            <div>
              {toast.type === "success" && (
                <LucideIcons.CheckCircle className="w-5 h-5 text-emerald-400" />
              )}
              {toast.type === "error" && (
                <LucideIcons.AlertCircle className="w-5 h-5 text-rose-400" />
              )}
              {toast.type === "info" && (
                <LucideIcons.Info className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <p className="font-black text-sm">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 hover:opacity-70 transition-opacity"
            >
              <LucideIcons.X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
