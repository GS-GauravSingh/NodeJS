import User from "../models/userModel.js"
import { v4 as uuidv4 } from 'uuid' // `uuid` package helps us to generate unique id's.
import { setUser, getUser } from '../services/authService.js'

async function handleUserSignup(req, res) {

    const { name, email, password } = req.body;
    try {

        await User.create({
            name: name,
            email: email,
            password: password
        });

        return res.render("homePage");

    } catch (error) {
        console.error("Error - userController.js - handleUserSignup");
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error.message,
        });
    }
}

async function handleUserLogin(req, res) {

    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email: email, password: password });

        if(!user)
        {
            // no user found.
            return res.render("login", {
                error: "Invalid Username or Password"
            });
        }

        // Session Id for user.
        const sessionId = uuidv4();
        setUser(sessionId, user); // storing user details associated with session id.
        res.cookie("uid", sessionId); // this is how we can send cookeies to client.
        return res.redirect("http://127.0.0.1:8000/");
        

    } catch (error) {
        console.error("Error - userController.js - handleUserLogin");
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error.message,
        });
    }
}

export { handleUserSignup, handleUserLogin };