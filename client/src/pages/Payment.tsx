/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AxiosError } from "axios";
import { api } from "../lib/axios";


function loadScript(src: string) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

export default function Payment() {

    const handlePayment = async () => {
        try {

            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const { data } = await api.post("/api/payment/create-order", {
                amount: 5000,
                currency: "INR",
            });
            const { order } = data;
            console.log(order)

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Test Store",
                description: "Test Transaction",
                order_id: order.id,
                handler: async function (response: unknown) {
                    const { data } = await api.post("/api/payment/verify-payment", response);
                    console.log(data)
                },
                prefill: {
                    name: "Soumya Dey",
                    email: "SoumyaDey@example.com",
                    contact: "9999999999",
                },
                notes: {
                    address: "Soumya Dey Corporate Office",
                },
                theme: { color: "#3399cc" },
            };

            // @ts-expect-error
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            if ((error as AxiosError).isAxiosError) {
                console.error("Payment error:", (error as AxiosError).response?.data);
            }
        }
    };


    return (
        <button onClick={handlePayment} className="cursor-pointer px-4 py-2 bg-brand/30 text-brand rounded">
            Pay ₹500
        </button>
    )
}
