import mongoose from "mongoose";

// Schema
const urlSchema = new mongoose.Schema({

    shortID: {
        type: String,
        required: true,
        unique: true
    },

    redirectURL: {
        type: String,
        required: true
    },

    visitHistory: [
        {
            // Time at which someone visit this URL.
            timestamp: {
                type: String
            }
        }
    ],

}, { timestamps: true });

// Model
const URL = mongoose.model("URL", urlSchema);

// Exporting URL model.
export default URL;