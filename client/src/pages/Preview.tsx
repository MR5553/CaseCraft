import { ButtonVariants } from "../lib/ButtonVariant";
import { BASE_PRICE } from "../lib/Constant";
import { formatPrice } from "../lib/utils";
import { useCanvas } from "../store/useCanvas";
import { Arrow } from "../components/Icons";
import { Link } from "react-router-dom";


export default function Preview() {
    const { data, model, option } = useCanvas();

    const download = () => {
        if (data) {
            const link = document.createElement("a");
            link.href = data;
            link.download = "phone-case.png";
            link.click();
        }
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(25rem, 1fr))", gap: "2rem", justifyItems: "center" }}>

            <div className="w-full flex justify-center items-center bg-neutral-100 border border-neutral-200 rounded-2xl p-5">
                <img
                    src={data || undefined}
                    alt="preview.png"
                    className="max-w-70 h-auto object-cover"
                />
            </div>

            <div className="w-full flex flex-col gap-6">

                <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight leading-snug text-gray-900 text-wrap">
                    Your
                    <span className="text-brand px-4">{model?.name}</span> case
                </h1>

                <div className="text-base">
                    <p className="font-medium text-zinc-950 mb-4">Highlights</p>
                    <ol className="flex flex-col gap-1 font-medium text-neutral-500 list-disc list-inside text-sm">
                        <li>Wireless charging compatible</li>
                        <li>Thermoplastic Polyurethane shock absorption</li>
                        <li>5 year print warranty</li>
                        <li>Packaging made from recycled materials</li>
                    </ol>
                </div>

                <div className="text-base">
                    <p className="font-medium text-zinc-950 mb-4">Materials</p>
                    <ol className="flex flex-col gap-1 font-medium text-neutral-500 list-disc list-inside text-sm">
                        <li>{option.material.label} : {option.material.description}</li>
                        <li>{option.finish.label} : {option.finish.description}</li>
                    </ol>
                </div>


                <div className="flex flex-col gap-4 text-sm mt-2">
                    <div className="flex items-center justify-between">
                        <p className="text-neutral-500 font-medium">Base price</p>
                        <p className="font-medium text-gray-900">
                            {formatPrice(BASE_PRICE)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-neutral-500 font-medium">Soft polycarbonate material</p>
                        <p className="font-medium text-gray-900">
                            {formatPrice(option.material.price)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-neutral-500 font-medium">Textured finish</p>
                        <p className="font-medium text-gray-900">
                            {formatPrice(option.finish.price)}
                        </p>
                    </div>


                    <div className="border border-dashed border-neutral-300 my-2" />

                    <div className="flex items-center justify-between">
                        <p className="text-gray-900 font-medium">Order total</p>
                        <p className="font-medium text-gray-900">
                            {formatPrice(BASE_PRICE + option.material.price + option.finish.price)}
                        </p>
                    </div>
                </div>


                <div className="flex justify-between items-center mt-10 gap-8">
                    <button
                        className={ButtonVariants({ size: "sm", className: "bg-brand" })}
                        title="download image"
                        onClick={download}
                    >
                        Download
                        <i className="ri-download-2-line" />
                    </button>

                    <Link to="/configure/check-out"
                        className={ButtonVariants({ variant: "outlined", size: "sm" })}
                    >
                        Check out
                        <Arrow className="size-6" />
                    </Link>
                </div>
            </div>
        </div>
    )
}