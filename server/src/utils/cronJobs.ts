import cron from "node-cron";
import { Users } from "../model/Users.model";


export const Cron = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const result = await Users.deleteMany({
                verified: false,
                verificationCodeExpiry: { $lt: Date.now() - 24 * 60 * 60 * 1000 }
            });

            console.log(`🧹 Cleaned up ${result.deletedCount} unverified users`);
        } catch (err) {
            console.error("Error running cleanup cron job:", err);
        }
    });

    console.log("✅ Cleanup cron job started");
};
