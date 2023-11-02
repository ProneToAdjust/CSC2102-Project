const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { setTimeout } = require("timers/promises");
app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const dictionary = {};
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  socket.on("addKeyValuePair", (data) => {
    const username = data.username;
    const language = data.language;
    const combinedLang = username + language;
    
    // Handle the dictionary update, add the new key-value pair
    dictionary[username] = combinedLang;

    // Emit the updated dictionary to all connected clients
    io.emit("updateDictionary", dictionary);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});


var intervalSeconds = 0;
const timeoutSeconds = 15;
setInterval(() => {
  if (io.engine.clientsCount < 1) {
    console.log("Server inactive, waiting %d seconds to shut down: ", timeoutSeconds - intervalSeconds);
    intervalSeconds++;
    if (intervalSeconds === timeoutSeconds) {
      console.log("Shutting down server...");
      process.exit(0);
    }
  }
  else {
    interval = 0;
  }
}, 1000);
