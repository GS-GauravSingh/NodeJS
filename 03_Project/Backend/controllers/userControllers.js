const User = require('../models/userModel');

// GET: Get all users
async function getAllUsersFromDatabase(req, res) {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
}


// GET: Get user by Id
async function getUserById(req, res) {

    const userData = await User.findById(req.params.id);
    if (!userData) {
        // Status Code (404): meaning requested resource not found.
        return res.status(404).send(`User Not Found.`);
    }

    return res.json(userData);
}

// POST: Create new users
async function createNewUser(req, res) {

    const userData = req.body;

    // Check for details
    if (
        !userData.first_name ||
        !userData.last_name ||
        !userData.email ||
        !userData.gender ||
        !userData.job_title
    ) {
        return res.status(400).json({
            msg: "Bad Request: All fields are required."
        });
    }

    const newUser = new User({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        gender: userData.gender,
        job_title: userData.job_title
    });

    const result = await User.create(newUser);
    return res.status(201).json({
        msg: "Operation Successfull",
        user: result
    });
}

// PATCH: Edit user by ID.
async function editUserById(req, res) {

    if (!req.body) {
        return res.status(400).json({
            msg: "Bad Request: No data provided for update."
        });
    }

    try {
        const updatedUserDetails = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Check if the user was found and updated
        if (updatedUserDetails) {
            return res.json(
                {
                    msg: "Details Updated Successfully",
                    user: updatedUserDetails
                }
            );
        }
        else {
            res.status(404).json(
                {
                    msg: "Not Found: User Not Found."
                }
            );
        }
    } catch (error) {
        console.error(`PATCH ERROR: An error occurred while updating user details: ${error}`);
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error.message // Include error message for clarity
        });
    }
}

// DELETE: Delete a user with specified ID.
async function deleteUserByID(req, res) {

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        // Check if a user was found and deleted
        if (deletedUser) {
            return res.status(200).json({
                msg: "User deleted successfully.",
                user: deletedUser // Optionally return the deleted user data
            });
        }
        else {
            return res.status(404).json({
                msg: "Not Found: User Not Found."
            });
        }

    } catch (error) {
        console.error(`DELETE ERROR: An error occurred while deleting a user: ${error}`);
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error.message // Include error message for clarity
        });
    }
}

module.exports = {
    getAllUsersFromDatabase,
    getUserById,
    createNewUser,
    editUserById,
    deleteUserByID
};