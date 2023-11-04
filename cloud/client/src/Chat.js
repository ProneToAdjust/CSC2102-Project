import React, { useEffect, useState } from "react";

function Chat({ socket, username, room, yourLanguage, learnLanguage }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [toTranslateMsg, setToTranslateMsg] = useState(false);
  const [btnStyle, setBtnStyle] = useState({ color: 'lightgray' })

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
        toTranslateMsg,
        yourLanguage,
        learnLanguage
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const translateMessage = () => {
    setToTranslateMsg(!toTranslateMsg);
  }

  useEffect(() => {
    socket.on("receive_message", (receiveData) => {
      setMessageList((list) => [...list, receiveData]);
    });
  }, [socket]);

  const handleLeaveRoom = () => {
    window.location.reload(false);
    socket.emit("removeKeyValuePair", socket.id);
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chat Room {room}</p> {/* Update the text here */}
      </div>
      <div className="chat-body">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
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
      <div className="chat-footer">
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
        <button style={toTranslateMsg ? { color: '#43a047' } : {color: 'lightgray'}} onClick={translateMessage}>Translate?</button>
      </div>
      <div className="chat-backbtn" style={{ padding: "10px", paddingLeft: "360px" }}>
        <button onClick={handleLeaveRoom} style={{ color: "black", backgroundColor: "lightblue", border: "white", padding: "8px", fontWeight: "bold" }}>Leave Room</button>
      </div>
    </div>
  );
}

export default Chat;
