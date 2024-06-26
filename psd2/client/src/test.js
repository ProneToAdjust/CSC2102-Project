import React, { useEffect, useState } from "react";
import Class from "./Class";
import App from "./App";
import io from "socket.io-client";

function WaitRoom({ username, room, userRole, learnSubject }) {
  const [socket, setSocket] = useState(null);
  const [showClass, setShowClass] = useState(false);
  const [landingPage, setLandingPage] = useState(false);
  const [dictionary, setDictionary] = useState({});
  const combinedSubj = userRole + learnSubject;
  const roomCount = Object.keys(dictionary).length;

  useEffect(() => {
    // Create and connect the socket only once
    if (!socket) {
      const newSocket = io("http://localhost:3001");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("addKeyValuePair", { username, subject: combinedSubj });
      });

      newSocket.on("updateDictionary", (updatedDictionary) => {
        setDictionary(updatedDictionary);
      });
    }

    if (roomCount > 0 && roomCount % 2 === 0) {
      socket.emit("join_room", room);
      setShowClass(true);
    }

    // Clean up event listeners when the component unmounts
    return () => {
      if (socket) {
        socket.off("updateDictionary");
        socket.disconnect();
      }
    };
  }, [username, combinedSubj, roomCount, room, socket]);

  const handleLeaveWaitRoom = () => {
    if (socket) {
      socket.emit("removeKeyValuePair", socket.id);
      socket.disconnect();
    }
    setLandingPage(true);
  }

  return (
    <div className="App">
      {showClass ? (
        <Class socket={socket} username={username} room={room} dictionary={dictionary} userRole={userRole} learnSubject={learnSubject} />
      ) : (!landingPage ? (
        (
          <div className="wait-display">
            <div className="wait-message">
              <p>Waiting for another user to join...</p>
              <div className="wait-backbtn" style={{ padding: "10px", paddingLeft: "70px" }}>
                <button onClick={handleLeaveWaitRoom} style={{ color: "black", backgroundColor: "lightblue", border: "white", padding: "8px", fontWeight: "bold" }}>Leave Class</button>
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
