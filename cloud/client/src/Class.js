import React, { useEffect, useState } from "react";

function Class({ socket, username, room, userRole, learnSubject }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        userRole,
        learnSubject
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const sendSystemMessage = (message) => {
    const systemMessage = {
      room: room,
      author: 'System',
      message: message,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      userRole,
      learnSubject
    };
    socket.emit("send_message", systemMessage);
    setMessageList((list) => [...list, systemMessage]);
  }

  useEffect(() => {
    socket.on("receive_message", (receiveData) => {
      setMessageList((list) => [...list, receiveData]);
    });
  }, [socket]);

  const handleLeaveRoom = () => {
    sendSystemMessage(`System Generated Message: ${username} has left the classroom.`);
    window.location.reload(false);
    socket.emit("removeKeyValuePair", socket.id);
  }

  return (
    <div className="class-window">
      <div className="class-header">
        <p>Classroom</p> {/* Update the text here */}
      </div>
      <div className="class-body">
        {messageList.map((messageContent) => {
          const isSystemMessage = messageContent.author === 'System';
          const messageClassName = isSystemMessage ? 'system-message' : '';

          return (
            <div
              className={`message ${messageClassName}`}
              id={username === messageContent.author ? 'you' : 'other'}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="class-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type Messages Here..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <div className="class-backbtn" style={{ padding: "10px", paddingLeft: "360px" }}>
        <button onClick={handleLeaveRoom} style={{ color: "black", backgroundColor: "lightblue", border: "white", padding: "8px", fontWeight: "bold" }}>Leave Room</button>
      </div>
    </div>
  );
}

export default Class;
