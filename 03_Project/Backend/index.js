// Import Statements - Importing using Common JS syntax (require())
const express = require('express');
const { connectMongoDB } = require('./database/databaseConnection');
const userRouter = require('./routes/userRoutes')

// For loading Environment Variables - no need to hold this in a variable.
// {path:'../.env'} -> path to my .env file, in case when .env file in not present in the root director. If .env file is present in the root directory then it gets automatically loaded.
require('dotenv').config({ path: '../.env' });

// -------------- Database Connection Code Starts Here -----------------------------
// MongoDb Connection
connectMongoDB('mongodb://127.0.0.1:27017/users')
    .then((res) => {
        console.log(`MongoDB Connected`)
    })
    .catch((err) => {
        console.log(`MongoDb connection error`)
    })
// -------------- Database Connection Code Ends Here -------------------------------

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

// User Route
// Whenever there is a request on `/api/users`, it is handled by the routes defined in userRouter.js.
// You can attach multiple routers to different specific routes. Each router will handle requests for its designated path. This is a great way to organize routes.
app.use("/api/users", userRouter);


// Listen for the incomming http request
app.listen(PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}`);
});
