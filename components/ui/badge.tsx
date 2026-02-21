import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "border-transparent bg-indigo-500 text-white hover:bg-indigo-600",
        secondary: "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-700",
        destructive: "border-transparent bg-red-900 text-red-100 hover:bg-red-800",
        success: "border-transparent bg-emerald-900 text-emerald-100 hover:bg-emerald-800",
        warning: "border-transparent bg-yellow-900 text-yellow-100 hover:bg-yellow-800",
        outline: "text-slate-100",
    }

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
