import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
    {
        variants: {
            variant: {
                default:
                    "bg-[#c9a84c] text-[#0a0e1a] hover:bg-[#dbb95c]",
                outline:
                    "border border-[#1e2d45] bg-transparent text-[#f0f2f5] hover:bg-[#1a2235] hover:border-[#c9a84c]/40",
                ghost:
                    "bg-transparent text-[#8a9bb0] hover:bg-[#1a2235] hover:text-[#f0f2f5]",
                secondary:
                    "bg-[#1a2235] text-[#8a9bb0] hover:bg-[#202d44] hover:text-[#f0f2f5]",
                destructive:
                    "bg-[#e05252]/10 text-[#e05252] border border-[#e05252]/20 hover:bg-[#e05252]/20",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 px-4 text-xs",
                lg: "h-12 px-7 text-base",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
