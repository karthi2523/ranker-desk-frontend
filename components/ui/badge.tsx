import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-accent text-background shadow-none",
                secondary:
                    "border-border bg-surface text-text-secondary hover:bg-surface-raised",
                destructive:
                    "border-transparent bg-error/10 text-error border-error/20",
                success:
                    "border-transparent bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                warning:
                    "border-transparent bg-accent/10 text-accent border-accent/20",
                outline:
                    "border-border text-text-secondary",
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
