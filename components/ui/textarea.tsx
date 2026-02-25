import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-lg border border-[#1e2d45] bg-[#0a0e1a] px-3 py-2 text-sm text-[#f0f2f5] placeholder:text-[#4a5a70] transition-colors",
                    "focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
