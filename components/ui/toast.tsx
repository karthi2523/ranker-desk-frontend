"use client";

import React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
        error: <AlertCircle className="h-5 w-5 text-red-400" />,
        info: <Info className="h-5 w-5 text-indigo-400" />,
    };

    const bgColors = {
        success: "bg-emerald-500/10 border-emerald-500/20",
        error: "bg-red-500/10 border-red-500/20",
        info: "bg-indigo-500/10 border-indigo-500/20",
    };

    return (
        <div
            className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md animate-in slide-in-from-right-full duration-300",
                bgColors[type]
            )}
        >
            {icons[type]}
            <p className="text-sm font-medium text-slate-100">{message}</p>
            <button
                onClick={onClose}
                className="ml-auto rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
            >
                <X className="h-4 w-4 text-slate-400" />
            </button>
        </div>
    );
}
