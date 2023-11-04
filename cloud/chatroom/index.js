const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { setTimeout } = require("timers/promises");
app.use(cors());

// DeepL API configuration
// NOTE: Limited to 500,000 characters per month
const deepl = require('deepl-node');
const authKey = 'a436cf8d-3c06-560d-b5fc-8ed1256b5d96:fx';
const translator = new deepl.Translator(authKey);

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
    var receiveData = {};
    // Check if user wants to translate their message
    if (data.toTranslateMsg) {
      const message = data.message;
      const yourLanguage = data.yourLanguage;
      const learnLanguage = data.learnLanguage === "en" ? "en-US" : data.learnLanguage; // Using US English in this case
      translator.translateText(message, yourLanguage, learnLanguage)
      .then(results => {
        // console.log(results);
        receiveData = {
          room: data.room,
          author: data.author,
          message: results.text,
          time: data.time
        }
        socket.to(data.room).emit("receive_message", receiveData);
      })
    } else {
      receiveData = data;
      socket.to(data.room).emit("receive_message", receiveData);
    }
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

  socket.on("removeKeyValuePair", (username) => {    
    delete dictionary[username];

    // Emit the updated dictionary to all connected clients
    io.emit("updateDictionary", dictionary);
  })

  // socket.on("translate_message", (data) => {
  //   const messageData = data.messageData;
  //   const message = messageData.message;
  //   const yourLanguage = data.yourLanguage;
  //   const learnLanguage = data.learnLanguage === "en" ? "en-US" : data.learnLanguage;

  //   translator.translateText(message, yourLanguage, learnLanguage)
  //   .then((results) => {
  //     console.log(results)
  //     const receiveMsg = {
  //       room: messageData.room,
  //       author: messageData.author,
  //       message: results.text,
  //       time: messageData.time
  //     }
  //     socket.to(messageData.room).emit("receive_message", receiveMsg);
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })
  // })
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
