
import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req, res) => {
    const order = req.body;
    try {
        const orderInfo = await Order.create(order);
        console.log(orderInfo);
        
        // FIX: Use req.userId from middleware instead of orderInfo.userId
        const userId = req.userId; // This comes from your userMiddleware
        const courseId = orderInfo?.courseId;
        
        console.log("Creating purchase with userId from token:", userId);
        console.log("Course ID:", courseId);
        
        // Create Purchase BEFORE sending response
        if (orderInfo && userId && courseId) {
            const newPurchase = await Purchase.create({ userId, courseId });
            console.log("Purchase created:", newPurchase);
        }
        
        // Send response AFTER creating Purchase
        res.status(201).json({ message: "Order Details: ", orderInfo });
        
    } catch (error) {
        console.log("Error in order:", error);
        res.status(500).json({ errors: "Error in order creation" });
    }
};