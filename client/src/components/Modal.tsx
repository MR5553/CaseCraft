import { type HTMLAttributes, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";

interface Modal extends HTMLAttributes<HTMLDialogElement> {
    children: ReactNode;
    ref: RefObject<HTMLDialogElement | null>;
};


export default function Modal({ children, ref, className, ...props }: Modal) {
    const portal = document.getElementById("portal");

    if (!portal) return null;

    return createPortal(
        <dialog
            ref={ref}
            className={cn("outline-none m-auto inset-0", className)}
            {...props}
        >
            {children}
        </dialog>,
        portal
    );
}