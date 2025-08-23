import { cn } from "../lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ name, type, startIcon, endIcon, className = "", ...props }, ref) => {
    return (
        <div className="relative flex items-center">
            {startIcon && (<span className="absolute left-3">{startIcon}</span>)}
            <input
                name={name}
                type={type}
                className={cn(`flex items-center w-full text-base py-2 px-3 text-neutral-800 bg-neutral-100 rounded-xl border border-neutral-200 hover:border-neutral-400 placeholder:text-neutral-400 focus:text-neutral-800 outline-neutral-200 disabled:cursor-not-allowed disabled:opacity-80 ${startIcon && "pl-8"} ${endIcon && "pr-8"} ${className}`, className)}
                ref={ref}
                {...props}
            />
            {endIcon && (<span className="absolute right-3">{endIcon}</span>)}
        </div>
    )
});

export { Input };