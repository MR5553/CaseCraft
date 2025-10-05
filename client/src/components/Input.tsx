import { cn } from "../lib/utils";
import { forwardRef, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";


type Elements = {
    root?: HTMLAttributes<HTMLDivElement>;
    input?: InputHTMLAttributes<HTMLInputElement>;
    startIcon?: HTMLAttributes<HTMLSpanElement>;
    endIcon?: HTMLAttributes<HTMLSpanElement>;
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    elements?: Elements;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ name, type, startIcon, endIcon, elements, className, ...props }, ref) => {
    return (
        <div
            {...elements?.root}
            className={cn("relative flex items-center", elements?.root?.className)}
        >
            {startIcon && (
                <span
                    {...elements?.startIcon}
                    className={cn("absolute left-3", elements?.startIcon?.className)}
                >
                    {startIcon}
                </span>
            )}
            <input
                {...elements?.input}
                ref={ref}
                name={name}
                type={type}
                className={cn("w-full text-base py-2 px-3 text-neutral-800 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-neutral-400 placeholder:text-neutral-400 outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    startIcon && "pl-8",
                    endIcon && "pr-8",
                    elements?.input?.className,
                    className
                )}
                {...props}
            />
            {endIcon && (
                <span
                    {...elements?.endIcon}
                    className={cn("absolute right-3", elements?.endIcon?.className)}
                >
                    {endIcon}
                </span>
            )}
        </div>
    );
});

export default Input;