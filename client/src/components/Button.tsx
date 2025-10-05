import { cn } from "../lib/utils";
import { type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ButtonVariants } from "../lib/ButtonVariant";


interface btn extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants> {
    children: ReactNode;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

const Button = ({ children, className, variant, size, endIcon, startIcon, ...props }: btn) => {
    return (
        <button
            className={cn(ButtonVariants({ variant, size, className }))}
            {...props}
        >
            {startIcon && startIcon}
            {children}
            {endIcon && endIcon}
        </button>
    )
};

export default Button;