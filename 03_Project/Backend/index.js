// Import Statements - Importing using Common JS syntax (require())
const express = require('express');
const fs = require('fs')

// Temporary User Data
let users = require("./MOCK_DATA.json");

// For loading Environment Variables - no need to hold this in a variable.
// {path:'../.env'} -> path to my .env file, in case when .env file in not present in the root director. If .env file is present in the root directory then it gets automatically loaded.
require('dotenv').config({ path: '../.env' });

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
app.get("/api/users", (req, res) => {
    return res.json(users);
});

// Dynamic Path Parameter - to retrieve data of individual user by their id.
app.get("/api/users/:id", (req, res) => {

    const id = Number(req.params.id);
    const userData = users.find((user) => user.id === id);
    if (!userData) {
        // Status Code (404): meaning requested resource not found.
        return res.status(404).send(`User Not Found.`);
    }

    return res.json(userData);
});

// POST Route
app.post("/api/users", (req, res) => {

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

    users.push({ id: users.length + 1, ...userData })
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({
                msg: "Internal Server Error",
                error: err
            });
        }

        res.status(201).json({
            msg: "Operation Successfull"
        });
    });
});

// PATCH Route
app.patch("/api/users/:id", (req, res) => {

    const id = Number(req.params.id);
    const newData = req.body;
    if (!newData) {
        return res.status(400).json({
            msg: "Bad Request: No data provided for update."
        });
    }

    let isUserFound = false;
    let userData = {};
    let newUsers = users.map((user) => {
        if (user.id === id) {
            isUserFound = true;
            userData = {...user, ...newData};
            return userData;
        }
        return user;
    });

    // If user with id not found.
    if (!isUserFound) {
        // Status Code (404): meaning requested resource not found.
        return res.status(404).send(`User Not Found.`);
    }

    users = newUsers;
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({
                msg: "Internal Server Error",
                error: err
            });
        }

        return res.json({
            msg: "User updated successfully",
            user: userData, // Return the updated user data
        });
    });
});

// DELETE Route
app.delete("/api/users/:id", (req, res) => {

    const id = Number(req.params.id);
    let isUserFound = false;
    let newUsers = users.filter((user) => {
        if (user.id === id) {
            isUserFound = true;
            return false;
        }
        return true;
    });

    // If user with id not found.
    if (!isUserFound) {
        return res.status(400).send(`Not Found, No user present with ID:${id}.`);
    }

    users = newUsers;
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({
                msg: "Internal Server Error",
                error: err
            });
        }

        return res.json({
            msg: "User deleted successfully",
        });
    });
});

// Listen for the incomming http request
app.listen(PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}`);
});
