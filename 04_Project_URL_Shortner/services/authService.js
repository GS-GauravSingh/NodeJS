// Mapping: sessionID - User 
// Problem: When server restarts this map becomes empty and you have to login again
const sessionIdToUserMap = new Map();

function setUser(id, user)
{
    sessionIdToUserMap.set(id, user);
}

function getUser(id)
{
    return sessionIdToUserMap.get(id);
}

export { setUser, getUser };