import { useCanvas } from "../store/useCanvas";


export default function Preview() {
    const { data } = useCanvas();

    const download = () => {
        if (data) {
            const link = document.createElement("a");
            link.href = data;
            link.download = "phone-case.png";
            link.click();
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
            <img
                src={data || ""}
                alt="preview.png"
                className="w-90 h-auto object-cover mx-auto"
            />

            <div className="flex flex-col justify-between my-5 gap-y-10">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight leading-snug text-gray-900 text-wrap">
                            Your Iphone 15 case
                        </h1>

                        <div className="mt-2 flex items-center gap-1.5 text-base">
                            <i className="ri-check-fill text-xl shrink-0 text-green-700" />
                            In stock and ready to ship
                        </div>
                    </div>

                    <div>
                        <div className="mt-4">
                            <p className="font-medium text-zinc-950">Highlights</p>
                            <ol className="mt-2 text-neutral-500 list-disc list-inside">
                                <li>Wireless charging compatible</li>
                                <li>Thermoplastic Polyurethane shock absorption</li>
                                <li>5 year print warranty</li>
                                <li>Packaging made from recycled materials</li>
                            </ol>
                        </div>

                        <div className="mt-4">
                            <p className="font-medium text-zinc-950">Materials</p>
                            <ol className="mt-2 text-neutral-500 list-disc list-inside">
                                <li>High-quality, durable material</li>
                                <li>Scratch- and fingerprint resistant coating</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600">Base price</p>
                        <p className="font-medium text-gray-900">
                            ₹ 100
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-gray-600">Textured finish</p>
                        <p className="font-medium text-gray-900">
                            ₹ 100
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-gray-600">Soft polycarbonate material</p>
                        <p className="font-medium text-gray-900">
                            ₹ 100
                        </p>
                    </div>
                </div>

            </div>

            <button onClick={download}>Download</button>
        </div>
    )
}