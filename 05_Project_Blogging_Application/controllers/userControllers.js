import UserModel from "../models/userModel.js";

class UserControllers {
    // There is no need to user `function` keyword to declare a function in a class in JS.
    renderUserSignInPage(req, res) {
        return res.render("signin");
    }

    renderUserSignUpPage(req, res) {
        return res.render("signup");
    }

    handleUserSignOut(req, res) {
        return res.clearCookie("token").redirect("/user/signin");
    }

    async handleUserSignUp(req, res) {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({
                msg: "Some required fields are missing",
            });
        }

        try {
            await UserModel.create({
                fullname: fullname,
                email: email,
                password: password,
            });

            return res.redirect("/user/signin");
        } catch (error) {
            console.log("ERROR: userControllers.JS: handleUserSignUp: ", error);
            return res.status(500).json({
                msg: "An error occurred while signing up. Please try again later.",
            });
        }
    }

    async handleUserSignIn(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                msg: "Some required fields are missing",
            });
        }

        try {
            const token = await UserModel.matchPasswordAndGenerateToken(
                email,
                password
            );

            return res.cookie("token", token).redirect("/");
        } catch (error) {
            console.log("ERROR: userControllers.JS: handleUserSignIn: ", error);
            return res.render("signin", {
                error: "Invalid Credentials!!",
            });
        }
    }
}

export default new UserControllers(); // returning an instance of UserController class.
