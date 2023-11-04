import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import App from "./App";

function WaitRoom({ socket, username, room, dictionary, yourLanguage, learnLanguage }) {
  const [showChat, setShowChat] = useState(false);
  const [landingPage, setLandingPage] = useState(false);
  var roomCount = Object.keys(dictionary).length;
  console.log(roomCount);
  console.log(yourLanguage);
  console.log(learnLanguage);


  useEffect(() => {
    checkCount();
  });

  const checkCount = () => {
    if ((roomCount % 2) === 0 && roomCount != 0) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  function handleLeaveWaitRoom() {
    socket.emit("removeKeyValuePair", socket.id);
    setLandingPage(true);
  }

  return (
    <div className="App">
      {showChat ? (
        <Chat socket={socket} username={username} room={room} dictionary={dictionary} yourLanguage={yourLanguage} learnLanguage={learnLanguage} />
      ) : (!landingPage ? (
        (
          <div className="wait-display">
            <div className="wait-message">
              <p>Waiting for another user to join...</p>
              <div className="wait-backbtn" style={{ padding: "10px", paddingLeft: "70px" }}>
                <button onClick={handleLeaveWaitRoom} style={{ color: "black", backgroundColor: "lightblue", border: "white", padding: "8px", fontWeight: "bold" }}>Leave Room</button>
              </div>
            </div>
          </div>
        )
      ) : (<App />)
      )}
    </div>
  );

}

export default WaitRoom;
