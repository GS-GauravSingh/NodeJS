import BlogModel from "../models/blogModel.js";
import CommentModel from "../models/commentModel.js";

class BlogControllers {
    renderAddBlogPage(req, res) {
        return res.render("addBlog", {
            user: req.user,
        });
    }

    async handleAddNewBlog(req, res) {
        const { title, body } = req.body;
        if (!title || !body) {
            return res.status(400).json({
                msg: "Some required fields are missing",
            });
        }

        try {
            const blog = await BlogModel.create({
                title: title,
                body: body,
                coverImageURL: `/uploads/${req.file.filename}`,
                createdBy: req.user._id,
            });

            return res.redirect(`/blog/${blog._id}`);
        } catch (error) {
            console.log("ERROR: BlogControllers.js: handleAddNewBlog ", error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    async handleViewBlog(req, res) {
        const id = req.params.id;
        const blog = await BlogModel.findById(id).populate("createdBy");
        const comments = await CommentModel.find({
            blogId: req.params.id,
        }).populate("createdBy");
        return res.render("blog", {
            user: req.user,
            blog: blog,
            comments: comments
        });
    }

    async handleAddComment(req, res) {
        await CommentModel.create({
            content: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });

        return res.redirect(`/blog/${req.params.blogId}`);
    }
}

export default new BlogControllers(); // returning an instance of UserController class.
