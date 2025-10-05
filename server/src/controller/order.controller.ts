import { Request, Response } from "express";
import { razorpay } from "../utils/razorpay";
import { randomUUID, createHmac } from "node:crypto";
import { calculatePrice, CaseConfig } from "../utils/calculation";
import { Orders } from "../model/Orders.model";

interface OrderRequest extends CaseConfig {
    modelId: string;
}


export const createOrder = async (req: Request, res: Response) => {
    try {
        const config: OrderRequest = req.body.config;

        if (!config.material || !config.finish || !config.modelId) {
            return res.status(400).json({ success: false, message: "Phone case detail is missing" });
        }

        const price = calculatePrice({ material: config.material, finish: config.finish });
        const receiptId = randomUUID().slice(0, 12);

        const payment = await razorpay.orders.create({
            amount: price * 100,
            currency: "INR",
            receipt: `receipt-${receiptId}`,
            notes: { productId: config.modelId },
        });

        await Orders.create({
            user: req.auth.id,
            amount: price,
            currency: "INR",
            razorpayOrderId: payment.id,
            status: "pending",
            items: [
                {
                    product: config.modelId,
                    quantity: 1,
                    price: price,
                },
            ],
            receipt: `receipt-${receiptId}`,
            notes: JSON.stringify(config),
        });

        return res.status(200).json({ success: true, order: payment });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error })
    }
};


export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        const generatedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        const updatedOrder = await Orders.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                $set: {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: "completed",
                },
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found in database",
            });
        }

        return res.status(200).json({
            success: true, message: "Payment verified successfully", order: updatedOrder
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error });
    }
};