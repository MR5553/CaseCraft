import { useRef, useState, type DragEvent, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { Image } from "./Icons";

interface inputProps extends HTMLAttributes<HTMLInputElement> {
    accept: string[];
    size: number;
    onUploadFile: (file: File) => void;
}

export default function Uplaoder({ onUploadFile, accept, size, className, ...props }: inputProps) {
    const [drag, setDrag] = useState<boolean>(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const supports = accept.map(type => type.split("/")[1]).join(", ").toUpperCase();

    const handleFile = (file: File) => {
        if (!file) return;

        if (!accept.includes(file.type)) {
            toast.error(`Invalid file type. Only ${supports} files are allowed.`);
            return;
        }

        if (file.size > (size * 1024 * 1024)) {
            toast.error(`File size should not exceed ${size} MB.`);
            return;
        }

        return onUploadFile(file);
    }

    const handleEvent = (e: DragEvent<HTMLDivElement>) => {
        if (e.type === "dragenter" || e.type === "dragover") {
            e.preventDefault()
            e.stopPropagation()
            setDrag(true)
        } else if (e.type === "dragleave") {
            e.preventDefault()
            e.stopPropagation()
            setDrag(false)
        }

        if (e.type === "drop") {
            e.preventDefault()
            e.stopPropagation()
            setDrag(false)

            const file = e.dataTransfer.files[0];

            if (file) { handleFile(file) }
        }

    };

    return (
        <div className={cn("w-full py-10 bg-neutral-50 hover:bg-neutral-100 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer", drag && "bg-brand/40 border-brand", className)}
            role="button"
            aria-label="File upload area"
            tabIndex={0}
            onDragEnter={(e) => handleEvent(e)}
            onDragOver={(e) => handleEvent(e)}
            onDragLeave={(e) => handleEvent(e)}
            onDrop={(e) => handleEvent(e)}
            onKeyDown={(e) => { if (e.key === "Enter") fileRef.current?.click() }}
            onClick={() => fileRef.current?.click()}
        >
            <input
                type="file"
                accept={accept.join(",")}
                id="upload-file"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { handleFile(file) }
                }}
                ref={fileRef}
                hidden
                {...props}
            />
            <div className="w-full h-full flex flex-col gap-1 items-center justify-center">
                <Image className={cn("w-10 h-10 fill-neutral-300 stroke-neutral-900", { "fill-brand/20 stroke-brand": drag })}
                />
                <label htmlFor="upload-file" className={cn("text-zinc-800 font-medium text-sm", { "text-brand": drag })}>
                    Drag & drop a file here, or click to select
                </label>
                <span className={cn("text-xs text-neutral-400")}>Supports: {supports} [max: {size}MB]</span>
            </div>
        </div>
    )
}