import { cva } from "class-variance-authority";

export const ButtonVariants = cva(
    "inline-flex items-center w-full justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-colors cursor-pointer disabled:cursor-not-allowed select-none",
    {
        variants: {
            variant: {
                black: "text-white bg-gradient-to-b from-neutral-700 to-neutral-950 shadow",
                destructive: "bg-red-600 text-white hover:bg-red-500 shadow-md shadow",
                outlined: "bg-neutral-100 text-neutral-600 border border-neutral-200",
                ghost: "bg-transparent hover:bg-neutral-100 hover:shadow",
                link: "underline-offset-4 hover:underline text-neutral-800 hover:text-neutral-900",
            },
            size: {
                default: "h-10 px-4 py-2 rounded-xl",
                sm: "h-9 rounded-xl px-3",
                lg: "h-11 rounded-xl px-8",
                icon: "w-fit! p-2 rounded-full!",
            },
            defaultVariant: {
                variant: "defualt",
                size: "default"
            }
        },
    }
);