"use client";

import { ToastProvider } from "@/lib/toast-context";
import { ToastContainer } from "@/components/toast-container";
import { StoreProvider } from "@/lib/store";
import { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <StoreProvider>
        <ToastContainer />
        {children}
      </StoreProvider>
    </ToastProvider>
  );
}
