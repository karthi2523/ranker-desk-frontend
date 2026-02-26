"use client";

import { AuthProvider } from"@/context/AuthContext";
import { ToastProvider } from"@/context/ToastContext";
import { NotificationProvider } from"@/context/NotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
 return (
 <ToastProvider>
 <AuthProvider>
 <NotificationProvider>
 {children}
 </NotificationProvider>
 </AuthProvider>
 </ToastProvider>
 );
}
