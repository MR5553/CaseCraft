import { ButtonVariants } from "../lib/ButtonVariant";
import { BASE_PRICE } from "../lib/Constant";
import { formatPrice } from "../lib/utils";
import { useCanvas } from "../store/useCanvas";
import { useAuth } from "../store/auth.store";
import { Arrow } from "../components/Icons";
import { toast } from "sonner";
import { api } from "../lib/axios";
import { useNavigate } from "react-router-dom";


export default function Preview() {
    const { user, isAuthenticated } = useAuth();
    const { State, model, option } = useCanvas();
    const navigate = useNavigate()


    const download = () => {
        if (State) {
            const link = document.createElement("a");
            link.href = State;
            link.download = "phone-case.png";
            link.click();
        }
    }

    const handleCheckout = async () => {
        try {
            if (!isAuthenticated) {
                toast.info("Please sign-in to make payment");
                return;
            }

            const { address_line_1, address_line_2, city, country, landmark, pincode, state } = user.address;
            if (!address_line_1 || !address_line_2 || !city || !country || !landmark || !pincode || !state) {
                toast.info("Please provide your address.");
                return;
            }


            const { data } = await api.post("/api/payment/order", {
                config: {
                    material: option.material.value,
                    finish: option.finish.value,
                    modelId: model?._id,
                }
            });

            if (!data.success) return toast.error("Failed to create order");
            console.log(data)

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "CaseCraft",
                ddescription: `Purchase of ${option.material.label} case with ${option.finish.label} finish`,
                order_id: data.order.id,
                handler: async function (response: unknown) {
                    try {
                        const { data: payload } = await api.post("/api/payment/verify-payment", response);

                        toast.success("Payment successful!");
                        console.log("Payment verified:", payload);
                        navigate("/configure/check-out", { state: { orderId: data.order.id } });
                    } catch (err) {
                        console.error("Payment verification failed:", err);
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name || "Munna kumar",
                    email: user.email || "shauryakumar42040er@gamil.com",
                    contact: user.phone || 9560615174,
                },
                notes: {
                    productId: model?._id,
                    material: option.material.value,
                    finish: option.finish.value,
                    receipt: data.order.receipt,
                },
                theme: { color: "#FFB441" },
            };

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const razorpay = new window.Razorpay(options);
            razorpay.open();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Checkout failed");
        }
    };


    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(25rem, 1fr))", gap: "2rem", justifyItems: "center" }}>

            <div className="w-full flex justify-center items-center bg-neutral-100 border border-neutral-200 rounded-2xl p-5">
                <img
                    src={State || undefined}
                    alt="preview.png"
                    className="max-w-70 h-auto object-cover"
                />
            </div>

            <div className="w-full flex flex-col gap-6">

                <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight leading-snug text-gray-900 text-wrap">
                    Your <span className="text-brand">{model?.name}</span> case
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

                    <button className={ButtonVariants({ variant: "outlined", size: "sm" })}
                        onClick={handleCheckout}
                    >
                        Check out
                        <Arrow className="size-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}