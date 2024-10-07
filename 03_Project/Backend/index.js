// Import Statements - Importing using Common JS syntax (require())
const express = require('express');
const fs = require('fs')
const mongoose = require('mongoose');


// For loading Environment Variables - no need to hold this in a variable.
// {path:'../.env'} -> path to my .env file, in case when .env file in not present in the root director. If .env file is present in the root directory then it gets automatically loaded.
require('dotenv').config({ path: '../.env' });

// -------------- Database Code Starts Here -----------------------------

// Creating a User Schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String
    },


    email: {
        type: String,
        required: true,
        unique: true
    },

    gender: {
        type: String,
        required: true
    },

    job_title: {
        type: String,
    },
},
    {
        timestamps: true
    });

// Creating a model.
const User = mongoose.model('User', userSchema);

// MongoDb Connection
mongoose.connect('mongodb://127.0.0.1:27017/users')
    .then((res) => {
        console.log(`MongoDB Connected`)
    })
    .catch((err) => {
        console.log(`MongoDb connection error`)
    })

// -------------- Database Code Ends Here -------------------------------

// Initializing `app`.
const app = express();

// Middleware - URLEncoded
// This decodes the urlencoded data and convert it into json format and make this data availabe to req.body.
app.use(express.urlencoded({ extended: false }));


// PORT and Hostname
const PORT = process.env.PORT || 8000; // PORT where server will run
const hostname = "127.0.0.1"; // localhost

// Home/Root Route
app.get("/", (req, res) => {
    res.send("Hello from server, You are at the Homepage.");
});

// GET Routes - to retrieve user(s) data.
app.get("/api/users", async (req, res) => {

    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
});

// Dynamic Path Parameter - to retrieve data of individual user by their id.
app.get("/api/users/:id", async (req, res) => {

    const userData = await User.findById(req.params.id);
    if (!userData) {
        // Status Code (404): meaning requested resource not found.
        return res.status(404).send(`User Not Found.`);
    }

    return res.json(userData);
});

// POST Route
app.post("/api/users", async (req, res) => {

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
});

// PATCH Route
app.patch("/api/users/:id", async (req, res) => {

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
});

// DELETE Route
app.delete("/api/users/:id", async (req, res) => {

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
});

// Listen for the incomming http request
app.listen(PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}`);
});
