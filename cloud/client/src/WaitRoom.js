import React, { useEffect, useState } from "react";
import Chat from "./Chat";

function WaitRoom({ socket, username, room, dictionary, yourLanguage, learnLanguage }) {
  const [showChat, setShowChat] = useState(false);
  var roomCount = Object.keys(dictionary).length;
  console.log(roomCount);
  console.log(yourLanguage);
  console.log(learnLanguage);


  useEffect(() => {
    checkCount();
  });

  const checkCount = () => {
    if ((roomCount%2)===0) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };


  return (
    <div className="App">
      {showChat ? (
        <Chat socket={socket} username={username} room={room} dictionary={dictionary} yourLanguage={yourLanguage} learnLanguage={learnLanguage} />
      ) : (
         (
            <div className="wait-message">
            <p>Waiting for another user to join...</p>
          </div>
        )
      )}
    </div>
  );

}

export default WaitRoom;
