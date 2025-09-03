import { useEffect, useRef } from "react";
import { Canvas, FabricImage, InteractiveFabricObject } from "fabric";
import "../hook/useHistory";
import { useCanvas } from "../store/useCanvas";


export default function Fabric() {
    const ref = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<Canvas | null>(null);
    const { canvas, setCanvas, setTemplateImage, model } = useCanvas();



    useEffect(() => {
        let canvas: Canvas | null = null;

        const initCanvas = async () => {
            if (!ref.current || !model) return;

            InteractiveFabricObject.ownDefaults = {
                ...InteractiveFabricObject.ownDefaults,
                cornerStyle: "circle",
                cornerColor: "#2563eb",
                borderColor: "#2563eb",
                borderScaleFactor: 2,
                cornerSize: 10,
                touchCornerSize: 40,
                transparentCorners: false,
            };

            canvas = new Canvas(ref.current, {
                width: 1200,
                height: 1000,
                selection: true,
                skipOffscreen: true,
                stopContextMenu: true,
                uniScaleKey: "shiftKey",
                allowTouchScrolling: true,
                enableRetinaScaling: true,
                imageSmoothingEnabled: true,
                preserveObjectStacking: true,
            });
            canvas.setDimensions({ width: "auto", height: "40rem" }, { cssOnly: true });


            const Image = await FabricImage.fromURL(model.url);

            const scale = Math.min(canvas.height * 0.9 / Image.height);

            Image.scale(scale);
            Image.set({
                selectable: false,
                evented: false,
                hasControls: false,
                hasBorders: false,
                shadow: {
                    color: "rgba(0, 0, 0, 0.2)",
                    blur: 30,
                    offsetX: 15,
                    offsetY: 15
                },
                name: "template",
            });

            canvas.centerObject(Image);
            canvas.sendObjectToBack(Image);
            canvas.add(Image);

            setTemplateImage(Image.name || "template");
            containerRef.current = canvas;
            setCanvas(canvas);
            canvas.requestRenderAll();
        };

        initCanvas();

        return () => { if (canvas) canvas.dispose() };

    }, [model, setCanvas, setTemplateImage]);


    useEffect(() => {
        if (!canvas) return;

        canvas._initialize();

        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "z") {
                e.preventDefault();
                canvas._undo();
            }
            if (e.ctrlKey && e.key === "y") {
                e.preventDefault();
                canvas._redo();
            }

            if ((e.key === "Delete")) {
                canvas._deleteObject(canvas.getActiveObjects());
            }
        };

        window.addEventListener("keydown", handler);

        return () => {
            window.removeEventListener("keydown", handler);
        }

    }, [canvas]);


    return (
        <div className="bg-neutral-100 border border-neutral-300 rounded-xl">
            <canvas ref={ref} />
        </div>
    );
}
