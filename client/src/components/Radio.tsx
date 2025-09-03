import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    children: ReactNode;
}

export default function Radio({ children, value, checked, id, name, className, ...props }: RadioProps) {
    const inputId = `${name || id}-${Date.now()}`;

    return (
        <label
            htmlFor={inputId}
            className={cn(
                "inline-flex items-center gap-2 cursor-pointer rounded-lg border px-3 py-2 transition-colors", { "bg-blue-600": checked },
                className
            )}
        >
            <input
                type="radio"
                id={inputId}
                name={name}
                value={value}
                checked={checked}
                onChange={props.onChange}
                className="hidden"
                {...props}
            />
            <span className="text-sm font-medium text-gray-700">
                {children}
            </span>
        </label>
    );
}