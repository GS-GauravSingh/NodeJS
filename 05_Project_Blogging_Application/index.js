import express from "express";
import envVariables from "./envVariables.js";
import connectMongoDB from "./database/database.js";
import path from "path";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import checkAuthStatusMiddleware from "./middlewares/checkAuthStatusMiddleware.js";
import blogRouter from "./routes/blogRoutes.js";
import BlogModel from "./models/blogModel.js";

// Initializing `app`
const app = express();

// Environment Variables
const PORT = envVariables.PORT || "8000";
const HOSTNAME = envVariables.HOSTNAME || "127.0.0.1";
const MONGO_DB_URL = envVariables.MONGO_DB_URL;
const MONGO_DB_DATABASE_NAME = envVariables.MONGO_DB_DATABASE_NAME;

// Database Connection
connectMongoDB(MONGO_DB_URL, MONGO_DB_DATABASE_NAME);

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkAuthStatusMiddleware("token"));
app.use(express.static(path.resolve("./public")));

// Routes
app.get("/", async (req, res) => {
    const allBlogs = await BlogModel.find({});

    return res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

// Start the server and listen for incomming request.
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
});
