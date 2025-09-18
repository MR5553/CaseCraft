import { useCallback, useEffect, useState } from "react";
import Fabric from "../components/Fabric";
import { useCanvas } from "../store/useCanvas";
import { FabricImage, Path } from "fabric";
import FabricText from "../components/FabricText";
import { cn, formatPrice } from "../lib/utils";
import { BASE_PRICE, FINISHES, MATERIALS } from "../lib/Constant";
import { Arrow } from "../components/Icons";
import { ButtonVariants } from "../lib/ButtonVariant";
import { useNavigate } from "react-router-dom";
import Uplaoder from "../components/Uploader";


export default function Design() {
    const { canvas, option, setOption, setData, getAllModels, setModel, model, models } = useCanvas((state) => state);

    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>();

    const allModels = useCallback(() => { getAllModels() }, [getAllModels])

    useEffect(() => {
        if (models.length === 0) {
            allModels()
        }
    }, [allModels, models.length]);


    useEffect(() => {
        if (!canvas || !model || !image) return;

        const reader = new FileReader();

        reader.onload = async (e) => {
            const url = e.target?.result as string;

            const object = canvas.getObjects().find((obj) => obj.name === "model");

            if (object && url) {
                const img = await FabricImage.fromURL(url);

                const path = new Path(model.path, {
                    absolutePositioned: true,
                    evented: false,
                    hasBorders: false,
                    selectable: false,
                    hasControls: false,
                });
                path.scaleToWidth(object.getScaledWidth() - model.offsetX);
                path.scaleToHeight(object.getScaledHeight() - model.offsetY);


                img.scale(Math.min((canvas.height * 0.9) / img.height));
                img.set({
                    scaleX: Math.min((canvas.height * 0.9) / img.height),
                    clipPath: path,
                    evented: true,
                    hasBorders: true,
                    selectable: true,
                    hasControls: true,
                });

                canvas.getObjects().forEach((obj) => {
                    if (obj.name !== "model") {
                        if (obj.type === "image") canvas.remove(obj);
                    }
                });

                canvas.centerObject(path);
                canvas.centerObject(img);
                canvas.setActiveObject(img);

                canvas.add(img);
                canvas.requestRenderAll();
            }
        };

        reader.readAsDataURL(image);

    }, [canvas, image, model]);


    const save = () => {
        if (!canvas) return;

        const object = canvas.getObjects().find(obj => obj.name === "model");

        if (object) {
            object.shadow = null;

            const data = canvas.toDataURL({
                top: (canvas.getHeight() - object.getScaledHeight()) / 2,
                left: (canvas.getWidth() - object.getScaledWidth()) / 2,
                width: object.getScaledWidth(),
                height: object.getScaledHeight(),
                format: "png",
                multiplier: 2,
                enableRetinaScaling: true,
            })
            setData(data);
        };
        navigate("/configure/preview");
    }


    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
            <Fabric />

            <div className="relative max-w-90 max-h-[38rem] overflow-y-auto flex flex-col gap-y-6 px-3">

                <h1 className="text-3xl font-bold">Customize your case</h1>

                <Uplaoder
                    accept={["image/png", "image/jpeg", "image/jpg"]}
                    size={3}
                    onUploadFile={(image) => setImage(image)}
                />

                <select
                    name="phone models"
                    title="phone model"
                    id="phone model"
                    className="w-full flex-1 px-3 py-2"
                    onChange={(e) => setModel(e.target.value)}
                >
                    <option hidden>Choose model</option>
                    {models.map(({ _id, name }) => (
                        <option
                            key={_id}
                            value={_id}
                            className={cn({ "text-brand": _id === model?._id })}
                        >
                            {name}
                        </option>
                    ))}
                </select>

                <FabricText />

                <div className="flex flex-col gap-4 mt-4">
                    {
                        [MATERIALS, FINISHES].map(({ name, options: opts }) => (
                            <div key={name}>
                                <h2 className="text-sm font-medium mb-2 capitalize text-gray-600">
                                    {name}
                                </h2>

                                <div
                                    role="radiogroup"
                                    aria-label={name}
                                    className="flex flex-col gap-4"
                                >
                                    {opts.map((opt) => (
                                        <button
                                            key={opt.value}
                                            role="radio"
                                            aria-checked={option[name as keyof typeof option].value === opt.value}
                                            tabIndex={0}
                                            onClick={() => setOption(name, opt)}
                                            className={cn("inline-flex items-start justify-between bg-neutral-50 border border-neutral-300 px-4 py-3 rounded-lg cursor-pointer", { "text-brand bg-brand/20 border-brand": (option[name as keyof typeof option].value === opt.value) })}
                                        >
                                            <div className="flex flex-col gap-1 items-start">
                                                <p className="w-full font-medium text-sm text-start">
                                                    {opt.label}
                                                </p>
                                                <p className="text-gray-600 text-xs">{opt.description}</p>
                                            </div>
                                            <p className="font-medium text-sm">
                                                + {formatPrice(opt.price)}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="sticky bottom-0 h-20 w-full flex gap-4 items-center justify-between py-3  bg-white">
                    <p className="w-40 text-black text-base font-medium whitespace-nowrap">
                        {formatPrice((BASE_PRICE + option.finish.price + option.material.price))}
                    </p>

                    <button
                        className={ButtonVariants({ size: "sm", className: "bg-brand shadow" })}
                        onClick={save}
                    >
                        Continue
                        <Arrow className="text-black size-6" />
                    </button>
                </div>

            </div>
        </div>
    )
}