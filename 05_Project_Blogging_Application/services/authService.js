import jwt from "jsonwebtoken"
import envVariables from "../envVariables.js";

const secret = envVariables.JWT_SECRET;
class AuthService {
    generateToken(user) {

        if(!user)
        {
            return null;
        }
        
        const payload = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profileImageURL: user.profileImageURL,
            role: user.role
        };

        const token = jwt.sign(payload, secret)
        return token;
    }

    validateToken(token)
    {
        if(!token)
        {
            return null;
        }

        const payload = jwt.verify(token, secret);
        return payload;
    }
}

export default new AuthService();
