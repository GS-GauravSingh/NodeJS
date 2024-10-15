import jwt from 'jsonwebtoken'

const secretKey = "g@ur@v$ingh@1234%$"; // this has to be super safe because anyone has access to this `secretKey` can make changes to this token or even generate new tokens and we don't won't that.
function setUser(user)
{
    const payload = {
        ...user,     
    };

    return jwt.sign(payload, secretKey); // creating a jwt token, `secretKey` is used to verify the jwt token.
}

function getUser(token)
{
    if(!token) return null;
    try {
        return jwt.verify(token, secretKey); // verifying token.
    } catch (error) {
        console.log("ERROR: authService: Invalid Token");
        return null;
    }
}

export { setUser, getUser };