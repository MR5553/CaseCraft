import { model, Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    currency: { type: String, default: "INR" },
    receipt: { type: String },
    paymentDetails: {
        razorpaySignature: { type: String },
        contact: { type: String },
        email: { type: String }
    },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Models" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
}, { timestamps: true });


export const Orders = model("Orders", orderSchema);