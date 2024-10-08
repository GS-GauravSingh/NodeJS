// Import Statement - In this project I am going to use Module JS Syntax for importing and exporting packages.
import express from 'express'
import dotenv from 'dotenv'
import urlRouter from './routes/urlRoutes.js'
import connectMongoDB from './database/databaseConnection.js'
import URL from './models/urlModel.js'

// For loading Environment Variables - no need to hold this in a variable.
dotenv.config({ path: './.env' });

// Initializing `app`.
const app = express();

// Middleware - For parsing JSON Data - client can sent URL in JSON format.
app.use(express.json());


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
app.get('/', (req, res) => {
    return res.send("Hello from Server, You are at the Homepage.");
});

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
app.use('/url', urlRouter);



// Start the Server and listen for incomming http requests.
app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`)
});
