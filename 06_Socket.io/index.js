import http from "http";
import express from "express";
import path from "path";
import { Server } from "socket.io";
import { moveMessagePortToContext } from "worker_threads";

// `app` is an instance of Express.
const app = express();

// Creating an HTTP Server using `http` module. SInce, Express is just a framework that build on the top of the `http` module and creating a server like this `http.createServer(app)` will give you more power meaning it allows you to socket.io library.
// Socket.IO, as well as other WebSocket libraries, require a direct reference to an HTTP server instance to attach WebSocket functionality. This setup lets you establish WebSocket connections alongside standard HTTP requests.
const server = http.createServer(app);

// Initializing a new Socket.IO server using the HTTP server instance.
// Server is the Socket.IO class that manages WebSocket connections and real-time communication.
// By passing the server (the HTTP server you created with http.createServer(app)) to the Server constructor, you’re effectively associating the Socket.IO server with that HTTP server. This means the Socket.IO server can handle both WebSocket connections and regular HTTP requests on the same server. 
const io = new Server(server);
// `app` to handle http request.
// `io` to handle web sockets connections.

// Socket.io
io.on("connection", (socket) => {
    console.log("A new user has connected with socket id: ", socket.id);

    socket.on("user-message", (message) => {
        console.log("A new message received: ", message);
        io.emit("broadcast-message", message);
    });
});

// Serving static file for public folder
app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
	return res.sendFile("./public/index.html");
});

server.listen(9000, () => {
	console.log(`Server is running http://127.0.0.1:9000`);
});
