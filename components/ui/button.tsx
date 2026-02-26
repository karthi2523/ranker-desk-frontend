import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    "bg-accent text-background hover:bg-accent-hover shadow-none",
                destructive:
                    "bg-error/10 text-error border border-error/20 hover:bg-error/20",
                outline:
                    "border border-border bg-surface text-text-primary hover:bg-surface-raised hover:border-accent",
                secondary:
                    "bg-surface text-text-primary hover:bg-surface-raised",
                ghost:
                    "bg-transparent text-text-secondary hover:bg-transparent hover:text-accent",
                link:
                    "text-accent underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-5 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-8 text-base rounded-2xl",
                icon: "h-10 w-10",
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
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
