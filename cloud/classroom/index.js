const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

// DeepL API configuration
// NOTE: Limited to 500,000 characters per month
const deepl = require('deepl-node');
const authKey = 'a436cf8d-3c06-560d-b5fc-8ed1256b5d96:fx';
const translator = new deepl.Translator(authKey);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:30000",
    methods: ["GET", "POST"],
  },
});
const dictionary = {};
let listOfAvailPorts = [];
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
      const yourSubject = data.yourSubject;
      const learnSubject = data.learnSubject === "en" ? "en-US" : data.learnSubject; // Using US English in this case
      translator.translateText(message, yourSubject, learnSubject)
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
    const subject = data.subject;
    const combinedSubj = username + subject;
    
    // Handle the dictionary update, add the new key-value pair
    dictionary[username] = combinedSubj;

    // Emit the updated dictionary to all connected clients
    io.emit("updateDictionary", dictionary);
  });

  socket.on("removeKeyValuePair", (username) => {    
    delete dictionary[username];

    // Emit the updated dictionary to all connected clients
    io.emit("updateDictionary", dictionary);
    socket.disconnect();

  })

  socket.on("addAndCheckPort", (portnum, callback) => {
    listOfAvailPorts.push(portnum);

    //loop through array and find duplicate
    res = firstDuplicate(listOfAvailPorts);

    //if no duplicate, return false
    if(res == false){
      callback(false);
    }
    else{
      callback(true);
    }
  })

  socket.on("removePort", (portnum) => {
    //remove portnum from array
    removedArr = listOfAvailPorts.filter((ports) => {
      return ports != portnum;
    })
    listOfAvailPorts = removedArr;

  })

  // socket.on("translate_message", (data) => {
  //   const messageData = data.messageData;
  //   const message = messageData.message;
  //   const yourSubject = data.yourSubject;
  //   const learnSubject = data.learnSubject === "en" ? "en-US" : data.learnSubject;

  //   translator.translateText(message, yourSubject, learnSubject)
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

//Find duplicates in array
function firstDuplicate(arr){
  let elementSet = new Set();

  for (let i=0; i<arr.length; i++){
    if (elementSet.has(arr[i])) return arr[i];
    elementSet.add(arr[i]);
  }

  return false;
}

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
    intervalSeconds = 0;
  }
}, 1000);
