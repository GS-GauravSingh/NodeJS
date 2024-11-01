import { Router } from "express";
import userControllers from "../controllers/userControllers.js";

const router = Router();
router.get("/signin", userControllers.renderUserSignInPage);
router.get("/signup", userControllers.renderUserSignUpPage);
router.get("/signout", userControllers.handleUserSignOut);

router.post("/signin", userControllers.handleUserSignIn);
router.post("/signup", userControllers.handleUserSignUp);

export default router;
