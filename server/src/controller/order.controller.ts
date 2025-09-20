import { Request, Response } from "express";
import { razorpay } from "../utils/razorpay";
import { randomUUID, createHmac } from "node:crypto";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount, currency = "INR" } = req.body;

        if (!amount) {
            res.status(400).json({ success: false, message: "Amount is required" });
            return
        }

        const receiptId = randomUUID().slice(0, 12);;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt: `receipt-${receiptId}`,
            notes: { productId: receiptId },
        });

        console.log("✅ Order created:", order);

        res.status(200).json({ success: true, order });

    } catch (error) {
        throw new error;
    }
};


export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generatedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature === razorpay_signature) {
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

    } catch (error) {
        throw new error;
    }
};