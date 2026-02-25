import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors",
    {
        variants: {
            variant: {
                default:
                    "border-[#c9a84c]/30 bg-[#c9a84c]/10 text-[#c9a84c]",
                success:
                    "border-[#4ade80]/20 bg-[#4ade80]/10 text-[#4ade80]",
                secondary:
                    "border-[#1e2d45] bg-[#1a2235] text-[#8a9bb0]",
                destructive:
                    "border-[#e05252]/20 bg-[#e05252]/10 text-[#e05252]",
                outline:
                    "border-[#1e2d45] bg-transparent text-[#8a9bb0]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
