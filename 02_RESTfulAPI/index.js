// Importing Express
const express = require('express');

// Importing File System (fs) Module
const fs = require('fs');

// Importing JSON Data generated using mockaroo.com.
const usersData = require('./MOCK_DATA.json');

// creating an instance of express.
const app = express();

// urlencoded Middleware
app.use(express.urlencoded({ extended: false }));

// PORT Number on which the server will run.
const PORT = 8000;

// localhost IP address.
const hostname = "127.0.0.1";

// Routes
app.get("/", (req, res) => {
    res.send("Hello from server, You are at the Homepage.");
});

/*
I am going to create Routes like this:

GET Routes:
1. GET request at route "/users" -> this will return all the user's data in JSON format.
2. GET request at route "/users/1" -> this will return the user data having id 1.
3. GET request at route "/users/2" -> this will return the user data having id 2 and so on...

POST Routes:
POST request on route "/users" -> this will create a new user.

PATCH Request:
PATCH requests on route "/users/1" -> this will edit the user with id 1
PATCH requests on route "/users/2" -> this will edit the user with id 2 and so on...

DELETE Request:
DELETE request on route "/users/1" -> this will delete the user with id 1.
*/


// GET Routes
/*
1. /users: This route serves HTML content for browsers or any client that can render HTML. This is typically used by web browsers where the user expects a full webpage.

2. /api/users: This route serves JSON data for API consumers, like mobile apps or other services that need raw data to display or process.
*/
app.get("/users", (req, res) => {

    // Creating HTML file.
    const htmlFile =
        `
        <dl>
            ${usersData.map((user) => {
            return (
                `<dt>Name: ${user.first_name} ${user.last_name}</dt> 
                    <dd>Gender: ${user.gender}<br>Email: ${user.email}<br>Job: ${user.job_title}</dd><br>`

            );
        }).join("")}
        </dl>
    `;

    // It's a good practice to use return statement `return res.send() (or similar methods like `return res.json()`) to ensure the function exits after sending the response, preventing further code execution and avoiding potential errors.
    return res.send(htmlFile);
});

app.get("/api/users", (req, res) => {
    return res.json(usersData);
});

/*
Dynamic Path Parameters: Dynamic path parameters are used in Express.js to capture values from the URL and pass them to the route handler. These parameters are typically part of the URL and are prefixed with a colon (:).

Example: Suppose you want to create an API where the client can request a specific user by their id. You can achieve this by defining a dynamic path parameter like /users/:id.
*/
app.get("/api/users/:id", (req, res) => {

    const id = Number(req.params.id); // req.params.id -> this will return a string. So, we have to convert this in integer format.
    const user = usersData.find((user) => user.id === id); // find the user with specified id.
    return res.json(user);
});


/*
By default, browsers only do GET requests. When you type a URL into the address bar or click a link, browsers perform GET requests. Similarly, when you submit a form without specifying the method, it defaults to a GET request. Forms in HTML can also handle POST requests (if you specify method="POST"), but browsers cannot natively handle PATCH or DELETE requests through forms. 

Since browsers don’t natively handle POST, PATCH, and DELETE requests, Postman is often used during API development to manually test these HTTP requests. So, we are going to use a tool called POSTMAN for performing http request.
*/
app.post("/api/users", (req, res) => {
    // Create a new user
    const body = req.body;
    usersData.push({ ...body, id: usersData.length + 1 })
    // console.log(body);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(usersData), (err) => {
        return res.json({
            status: "success"
        });
    })
});

// PATCH Request
app.patch("/api/users/:id", (req, res) => {
    // Edit an existing user.
    const id = Number(req.params.id); // req.params.id -> this will return a string. So, we have to convert this in integer format.
    const data = req.body;
    let users = usersData.map((user) => {
        if(user.id === id)
        {
            const obj = {
                ...user,
                ...data
            };

            return obj;
        }
        else
        {
            return user;
        }
    });

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        return res.json({
            status: "success"
        });
    })

});

// DELETE Request
app.delete("/api/users/:id", (req, res) => {
    // Delete a user with specified id.
    const id = Number(req.params.id); // req.params.id -> this will return a string. So, we have to convert this in integer format.
    let users = usersData.filter((user) => user.id !== id);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        return res.json({
            status: "success"
        });
    })
})

/*
In case where the routes are same then you can group multiple http request. The app.route() method is a convenient way to chain together different HTTP methods for the same route. 

app
    .route("/api/users/:id")
    .get((req, res) => {
        // Handle GET request (e.g., fetch user by id)
    })
    .post((req, res) => {
        // Handle POST request (e.g., create new user)
    })
    .put((req, res) => {
        // Handle PUT request (e.g., update user by id)
    })
    .patch((req, res) => {
        // Handle PATCH request (e.g., partially update user by id)
    })
    .delete((req, res) => {
        // Handle DELETE request (e.g., delete user by id)
    });
*/


// Start the server and listen to incomming requests.
app.listen(PORT, hostname, () => {
    console.log(`Server is running at http://${hostname}:${PORT}`);
});