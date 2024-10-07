const express = require('express');
const { getAllUsersFromDatabase, getUserById, createNewUser, editUserById, deleteUserByID } = require('../controllers/userControllers');

// creates a new router object.
// userRoutes.js file contains all the routes related to users only.
// The router is used to handle client requests on specific routes, and it helps in separating your routes for better organization.
const router = express.Router();


// // GET Routes - to retrieve user(s) data.
// // Now, this file contains all the roites related to user. So, you can remove `/users` from path.
// router.get("/", getAllUsersFromDatabase);

// // Dynamic Path Parameter - to retrieve data of individual user by their id.
// router.get("/:id", getUserById);

// // POST Route
// router.post("/", createNewUser);

// // PATCH Route
// router.patch("/:id", editUserById);

// // DELETE Route
// router.delete("/:id", deleteUserByID);

// Shortcut
router
    .route("/")
    .get(getAllUsersFromDatabase)
    .post(createNewUser);

router
    .route("/:id")
    .get(getUserById)
    .patch(editUserById)
    .delete(deleteUserByID);


module.exports = router;