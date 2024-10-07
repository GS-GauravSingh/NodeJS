// Import the Express.js framework, used for creating web servers.
const express = require("express");

// Now this `app` variable contains all the functionalities provided by express, it like we are creating an object of express.
const app = express();

// Define the PORT Number of whhich will run.
const port = 8000;
const hostname = "127.0.0.1"; // localhost IP address.


// Handling Routes
// Root ("/") Route
app.get("/", (req, res) => {

    // Sends back the response to the client
    res.send("Hello from Server! You are at the Homepage.")
});
/*
Explanation of above Route:
So, GET request is used when we (user/client) wants to get or retrieve some data from the server. Here, when client's browser make an `http` request (we always create http servers in Node.js either using http module or express framework) on path (first argument of get()), then the handler function (second argument of get()) gets executed and this handle function is specific to this path only. 

1. GET request: GET request is used when the client (typically a browser) wants to retrieve or fetch some data from the server.

2. app.get(): In Express, this method is used to define a route that listens for incomming GET requests at a specific path. In this case, it’s listening for incomming GET requests to the root URL ("/").

3. First argument (path) of app.get(): "/" is the path that the client’s browser will request. So, if the browser requests the root URL (like http://localhost:3000/), this route will handle the request.

4. Second argument (handler function) of app.get(): The second argument is the handler function that will execute when the route is hit. It takes two parameters:
    4.1 req (request object): This represents the request object that contains details about the incoming HTTP request (like query parameters, headers, etc.).
    4.2 res (response object): This represents the response object, which is used to send back a response to the client (e.g., HTML, JSON, or a simple message).

When a client sends a GET request to the "/" path, the handler function inside app.get() will run. This function handles only this specific route.
*/

// About Page ("/about") Route
app.get("/about", (req, res) => {
    res.send("You are at the About page.")
});

// Listen for the incomming http request
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

/*
As we know that Express.js is just a framework and Internally, it used Node.js `http` module for creating web servers.

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

Explanation of above code:
When you call app.listen() in Express.js, it internally uses Node.js's http.createServer() to create a web server. Express simplifies this by handling routing (like app.get() or app.post()) and passing these routes to the server. The server listens on a specified port and executes the handler functions based on the incoming request type (GET, POST, etc.).

So, Express is just a layer on top of Node.js http module to make building web servers easier.
*/