import { useLocation } from "react-router-dom";
import { BASE_PRICE } from "../lib/Constant";
import { formatPrice } from "../lib/utils";
import { useCanvas } from "../store/useCanvas";
import { useAuth } from "../store/auth.store";

export default function Checkout() {
    const { State, option } = useCanvas();
    const { user } = useAuth();
    const { state } = useLocation();


    return (
        <div className="max-w-3xl mx-auto mt-10">
            <p className="text-green-600 text-base font-medium">Thank you!</p>

            <h1 className="title font-bold text-neutral-900 mt-6">Your case is on the way</h1>
            <p className="text-neutral-600 mt-2">
                We've recieved your order and are now processing it.
            </p>

            <div className="flex flex-col gap-y-10 mt-10">
                <div className="flex flex-col">
                    <p className="font-medium  text-xl">Order number</p>
                    <p className="text-neutral-600">{state?.orderId}</p>
                </div>

                <hr className="text-neutral-200" />

                <div>
                    <p className="font-medium text-xl">You made a great choice</p>
                    <p className="text-neutral-600 mt-2">
                        We at <span className="font-bold text-neutral-900">Case<span className="text-brand">Craft</span>
                        </span> {""}
                        believe that a phone case doesn't only need to look good, but also last you for the years to come. We offer a 5-year print guarantee: If your case isn't of the highest quality, we'll replace it for free.

                    </p>
                </div>

                <div className="flex justify-center items-center h-max w-full py-10 bg-neutral-100 border border-neutral-200 rounded-2xl">
                    <img
                        src={State || undefined}
                        alt="preview.png"
                        className="max-w-80 h-auto object-cover"
                    />
                </div>

                <div className="max-w-3xl flex items-center justify-between">
                    <div>
                        <p className="font-medium mb-2">Shipping address</p>
                        <p className="flex flex-col gap-1 text-sm">
                            <span>{user.name} </span>
                            <span>{user.address.address_line_1}</span>
                            <span>{user.address.address_line_2}</span>
                            <span>{user.address.landmark}</span>
                            <span>{user.address.city},{user.address.state} - {user.address.pincode}</span>
                            <span>{user.address.country}</span>
                        </p>
                    </div>
                    <div>
                        <p className="font-medium mb-2">Billing address</p>
                        <p className="flex flex-col gap-1 text-sm">
                            <span>{user.name} </span>
                            <span>{user.address.address_line_1}</span>
                            <span>{user.address.address_line_2}</span>
                            <span>{user.address.landmark}</span>
                            <span>{user.address.city},{user.address.state} - {user.address.pincode}</span>
                            <span>{user.address.country}</span>
                        </p>
                    </div>
                </div>

                <hr className="text-neutral-200" />

                <div className="max-w-3xl flex items-center justify-between">
                    <div>
                        <p className="font-medium">Payment status</p>
                        <p className="text-sm mt-2 text-green-700">Paid</p>
                    </div>
                    <div>
                        <p className="font-medium mb-2">Shipping method</p>
                        <p className="text-sm">
                            DHL <br />
                            Takes up to 3 working day <br />
                        </p>
                    </div>
                </div>

                <hr className="text-neutral-200" />

                <div className="flex flex-col gap-4 text-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-900 font-medium">Subtotal</p>
                        <p className="font-medium text-neutral-600">
                            {formatPrice(BASE_PRICE + option.material.price + option.finish.price)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-gray-900 font-medium">Shipping charges</p>
                        <p className="font-medium text-neutral-600">
                            {formatPrice(0)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-gray-900">
                        <p className="font-medium">Total</p>
                        <p className="font-medium">
                            {formatPrice(BASE_PRICE + option.material.price + option.finish.price)}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}