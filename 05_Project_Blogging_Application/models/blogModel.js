import mongoose from "mongoose";

// Blog Schema
const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        body: {
            type: String,
            required: true,
        },

        coverImageURL: {
            type: String,
            required: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Blog Model
const BlogModel = mongoose.model("Blog", blogSchema);

// Export Blog Model.
export default BlogModel;
