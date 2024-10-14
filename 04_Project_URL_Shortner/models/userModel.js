import mongoose from "mongoose";

// Schema
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

}, { timestamps: true });

// Model
const User = mongoose.model("User", userSchema);

// Exporting URL model.
export default User;