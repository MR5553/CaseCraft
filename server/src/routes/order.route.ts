import { Router } from "express";
import { createOrder, verifyPayment } from "../controller/order.controller";
import { verifyJwtToken } from "../middleware/auth.middleware";


const router = Router();

router.post("/order", verifyJwtToken, createOrder);
router.post("/verify-payment", verifyJwtToken, verifyPayment);


export default router;