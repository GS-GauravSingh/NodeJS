import mongoose, { model, Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: false,
    },

    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {timestamps: true});

const CommentModel = model("Comment", commentSchema);
export default CommentModel;