import mongoose from "mongoose";

export async function connectDB() {
    // Store the MongoDB URI in a variable
    const mongAPI = process.env.ATLAS_URI;

    if (!mongAPI) {
        throw new Error("MongoDB URI is missing in environment variables.");
    }

    // Check if the database is already connected
    if (mongoose.connection.readyState === 1) {
        return; // Already connected
    }

    try {
        // Connect to MongoDB without useNewUrlParser and useUnifiedTopology
        await mongoose.connect(mongAPI);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}