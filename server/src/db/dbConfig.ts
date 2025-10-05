import mongoose from "mongoose";

export default async function db() {
    try {
        const connection = await mongoose.connection;
        connection.on("connected", () => {
            console.log("✅ MongoDB connected successfully");
        });
        connection.on("error", (error: Error) => {
            console.error("❌ MongoDB connection error:", error);
            process.exit(1);
        });
        connection.on("disconnected", () => {
            console.log("⚠️ MongoDB disconnected!");
        });

        await mongoose.connect(process.env.MONGODB_URI as string, { dbName: "CaseCraft" });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
}