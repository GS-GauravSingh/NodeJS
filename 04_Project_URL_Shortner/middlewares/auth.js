import { getUser } from '../services/authService.js'

// Creating Middleware 

// Client Request -> Middleware (check's whether client is authenticated or not, using sessionId created during login and sent to client via cookis) -> if client is authenticated -> Redirects clients to home page

// Client Request -> Middleware (check's whether client is authenticated or not, using sessionId created during login and sent to client via cookis) -> if client is not authenticated -> Redirects clients to signup/login page but not at the home page.
async function restrictToLoggedInUsersOnly(req, res, next)
{
    const uid = req.cookies?.uid;

    if(!uid)
    {
        return res.redirect("http://127.0.0.1:8000/login");
    }

    const user = getUser(uid);
    if(!user)
    {
        return res.redirect("http://127.0.0.1:8000/login");
    }

    req.user = user;
    next();
}

export { restrictToLoggedInUsersOnly };