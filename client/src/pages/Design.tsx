import { useEffect } from "react";
import Fabric from "../components/Fabric";
import { useCanvas } from "../store/useCanvas";
import { FabricImage, Path } from "fabric";
import FabricText from "../components/FabricText";
import { cn, formatPrice } from "../lib/utils";
import { BASE_PRICE, FINISHES, MATERIALS } from "../lib/Constant";
import { Arrow } from "../components/Icons";
import { ButtonVariants } from "../lib/ButtonVariant";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";


export default function Design() {
    const { canvas, option, setOption, setData, models, getModels, setModels, model } = useCanvas();
    const navigate = useNavigate();

    useEffect(() => {
        getModels();

        if (canvas && model) {
            const object = canvas.getObjects().find(obj => obj.name === "template");
            if (!object) return;


            FabricImage.fromURL("https://res.cloudinary.com/dvcp8dyvt/image/upload/v1755552197/caseCraft/n3oxymgsqk4i2dklyf2y.jpg", { crossOrigin: "anonymous" }).then((Image) => {
                const scale = Math.min(canvas.height * 0.9 / Image.height);

                const path = new Path(model.path, { absolutePositioned: true });
                path.scaleToWidth(object.getScaledWidth() - model.offsetX);
                path.scaleToHeight(object.getScaledHeight() - model.offsetY);

                Image.scale(scale)
                Image.set({
                    clipPath: path,
                    evented: true,
                    hasBorders: true,
                    selectable: true,
                    hasControls: true,
                    preserveAspectRatio: true,
                });
                canvas.centerObject(path);
                canvas.centerObject(Image);
                canvas.setActiveObject(Image);

                canvas.add(Image);
                canvas.requestRenderAll();
            });
        }


    }, [canvas, getModels, model]);


    const save = () => {
        if (!canvas) return;

        const data = canvas.toDataURL({
            format: "png",
            multiplier: 2,
            quality: 1
        })
        setData(data);

        navigate("/configure/preview");
    }

    return (
        <div className="flex flex-wrap justify-center items-center gap-4 mx-auto">
            <Fabric />

            <div className="relative overflow-y-auto flex-1 min-w-90 max-h-[40rem] flex flex-col gap-y-4 px-3">

                <h1 className="text-3xl font-bold mb-6">Customize your case</h1>

                <select
                    name="phone models"
                    title="phone model"
                    id="phone model"
                    className="w-full flex-1 px-3 py-2"
                    onChange={(e) => setModels(e.target.value)}
                >
                    <option hidden>Choose model</option>
                    {models.map(({ name, url }) => (
                        <option
                            key={url}
                            value={name}
                            className={cn({ "text-blue-600 bg-blue-200": model?.name === name })}
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
                                            className={cn("inline-flex items-start justify-between bg-neutral-50 border border-neutral-300 px-4 py-3 rounded-lg cursor-pointer", { "text-blue-600 bg-blue-100 border-blue-600": (option[name as keyof typeof option].value === opt.value) })}
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

                    <Button
                        className={ButtonVariants({ size: "sm", className: "bg-green-700 text-white shadow-green-600" })}
                        endIcon={<Arrow className="text-white size-6" />}
                        onClick={save}
                    >
                        Continue
                    </Button>
                </div>

            </div>
        </div>
    )
}