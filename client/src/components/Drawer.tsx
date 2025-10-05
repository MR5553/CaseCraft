import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDialogElement> {
    children: ReactNode;
}

const Drawer = forwardRef<HTMLDialogElement, Props>(({ children, ...props }, ref) => {
    return (
        <dialog
            ref={ref}
            className="transform transition-transform duration-300 ease-in-out translate-x-full open:translate-x-0"
            {...props}
        >
            {children}
        </dialog>
    );
}
);

export default Drawer;