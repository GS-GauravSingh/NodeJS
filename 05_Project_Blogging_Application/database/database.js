import mongoose from "mongoose";

// Database Connection
async function connectMongoDB(mongoDbURL, databaseName) {
    try {
        const result = await mongoose.connect(`${mongoDbURL}${databaseName}`);
        if (result) {
            console.log("MongoDB Connected!!");
        }
    } catch (error) {
        console.log("ERROR: database.js: MongoDB connection error", error);
        throw error;
    }
}

export default connectMongoDB;
