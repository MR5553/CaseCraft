import { forwardRef, type HTMLAttributes, type InputHTMLAttributes } from "react";
import { cn } from "../lib/utils";

type Elements = {
    root?: HTMLAttributes<HTMLDivElement>;
    progress?: HTMLAttributes<HTMLSpanElement>;
};

export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
    value: number;
    min: number;
    max: number;
    step?: number;
    elements?: Elements;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({ name, value, min, max, step, elements, className, ...props }, ref) => {
    return (
        <div {...elements?.root}
            className={cn("relative h-1.5 bg-neutral-200 rounded-lg", elements?.root?.className)}
        >
            <input
                ref={ref}
                type="range"
                name={name}
                value={value}
                min={min}
                max={max}
                step={step}
                className={cn("absolute appearance-none h-full w-full z-50", className)}
                {...props}
            />

            <span
                {...elements?.progress}
                className={cn(
                    "absolute h-full left-0 z-0 pointer-events-none rounded-lg",
                    elements?.progress?.className
                )}
                style={{
                    ...elements?.progress?.style,
                    width: `${((value - min) / (max - min)) * 100}%`,
                }}
            />
        </div>
    );
});