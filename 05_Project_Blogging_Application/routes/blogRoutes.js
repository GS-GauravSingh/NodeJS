import { Router } from "express";
import BlogControllers from "../controllers/blogControllers.js";
import upload from "../services/fileUploadService.js";

const router = Router();
router.get("/add-new", BlogControllers.renderAddBlogPage);
router.post("/", upload.single("coverImage"), BlogControllers.handleAddNewBlog);
router.get("/:id", BlogControllers.handleViewBlog);
router.post("/comment/:blogId", BlogControllers.handleAddComment);

export default router;
