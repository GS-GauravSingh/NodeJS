import authService from "../services/authService.js";

function checkAuthStatusMiddleware(cookieName) {
    return (req, res, next) => {
        const token = req?.cookies[cookieName];
        if (!token) {
            return next();
        }

        try {
            const userPayload = authService.validateToken(token);
            req.user = userPayload;
        } catch (error) {}
        return next();
    };
}

export default checkAuthStatusMiddleware;
