import { Router } from "express";
import { createOrder, verifyPayment } from "../controller/Order.controller";


const router = Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);


export default router;