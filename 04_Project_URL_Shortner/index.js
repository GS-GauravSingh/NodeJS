// Import Statement - In this project I am going to use Module JS Syntax for importing and exporting packages.
import express from 'express'
import dotenv from 'dotenv'
import urlRouter from './routes/urlRoutes.js'
import connectMongoDB from './database/databaseConnection.js'
import URL from './models/urlModel.js'
import path from 'path'
import staticRouter from './routes/staticRouter.js'
import userRouter from './routes/userRoutes.js'
import cookieParser from 'cookie-parser' // use this package to parse cookies
import { restrictToLoggedInUsersOnly } from './middlewares/auth.js'

// For loading Environment Variables - no need to hold this in a variable.
dotenv.config({ path: './.env' });

// Initializing `app`.
const app = express();

// Telling Express that I am going to use `EJS` Templating Engine for Server-Side Rendering.
app.set('view engine', 'ejs');

// Telling Express that all my `.ejs` files are present in `views` folder.
// path.resolve('./views'): This generates an absolute path to the views folder. Using path.resolve helps ensure that your application can correctly find the folder regardless of where it is run from.
// path is a built-in module in node.js.
app.set('views', path.resolve('./views'))

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // cookie parser middleware, used to parse cookies.


// PORT and HOSTNAME
const PORT = process.env.PORT || 8000; // PORT on which server will run.
const HOSTNAME = process.env.HOSTNAME || "127.0.0.1"; // localhost address.

// Database Connection
const mongoDbUrl = process.env.MONGO_DB_URL;
connectMongoDB(mongoDbUrl)
    .then((res) => {
        console.log("Mongo DB Connected!!");
    })
    .catch((err) => {
        console.log("Mongo DB Connection Error!!");
    })

// Routes
// app.get('/', async (req, res) => {
//     // return res.send("Hello from Server, You are at the Homepage.");

//     // Let's render Home Page.
//     // res.render("homePage"): This method tells Express to render the template named homePage.ejs
//     // return res.render("homePage"); // Render the 'homePage.ejs' template

//     // You can pass dynamic data or variables to your EJS template file when rendering it. 
//     return res.render("homePage", {
//         urls: await URL.find({}), // fetching all documents from MongoDB.
//     });
// });

// Whenever there is a request start with `/`, that request will be handled by `urlRouter`.
app.use("/", staticRouter);

// Handling Redirection.
app.get('/:shortID', async (req, res) => {

    const shortID = req.params.shortID;
    const date = new Date().toLocaleString('en-IN');


    try {

        const results = await URL.findOneAndUpdate(
            {
                shortID: shortID
            },
            {
                // The $push operator is used in MongoDB to add an element to an array field in a document. If the array does not exist, $push will create it.
                $push: {
                    visitHistory: {
                        timestamp: date
                    },
                },
            }
        );

        return res.redirect(results.redirectURL);

    } catch (error) {
        console.log("GET Request ERROR: Error while handling Redirections");
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        });

    }
});

// Whenever there is a request start with `/url`, that request will be handled by `urlRouter`.
// app.use() is also use to mount/attack a route handler (in this case urlRouter) to specific url.
// This route will generate a short id.

// `restrictToLoggedInUsersOnly` is an inline middleware here, it means
// Whenever there is a request start with `/user`, that request will be handled by `userRouter`.
/*
When a request is made to a route that starts with `/url`, Express will first execute the `restrictToLoggedInUsersOnly` middleware.
1. If restrictToLoggedInUsersOnly allows the request to continue (e.g., if the user is authenticated), the request will then be passed to urlRouter.
2. If restrictToLoggedInUsersOnly blocks the request (e.g., if the user is not authenticated), the request will not reach urlRouter, and an error response will be sent.
*/
app.use('/url', restrictToLoggedInUsersOnly, urlRouter);
app.use("/user", userRouter);



// Start the Server and listen for incomming http requests.
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`)
});
