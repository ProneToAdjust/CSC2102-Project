import React, { useEffect, useState, useRef } from "react";

function Class({ socket, username, room, userRole, learnSubject }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [drawingData, setDrawingData] = useState([]);
  const [whiteboardVisible, setWhiteboardVisible] = useState(false); // State for whiteboard visibility

  const chatBodyRef = useRef(null); // Reference to the chat body element

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
  
  const startDrawing = (event) => {
    setIsDrawing(true);
    setPrevPosition({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
  };

  const draw = (event) => {
    if (isDrawing) {
      const canvas = event.target;
      const currentPosition = {
        x: event.clientX - canvas.offsetLeft,
        y: event.clientY - canvas.offsetTop,
      };

      const newData = {
        room: room,
        prevPosition,
        currentPosition,
      };

      setDrawingData((prevData) => [...prevData, newData]);
      setPrevPosition(currentPosition);

      socket.emit("draw", newData);
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    socket.on("draw", (data) => {
      setDrawingData((prevData) => [...prevData, data]);
    });
  }, [socket]);

  useEffect(() => {
    const canvas = document.getElementById("whiteboard-canvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawingData.forEach(({ prevPosition, currentPosition }) => {
      context.beginPath();
      context.moveTo(prevPosition.x, prevPosition.y);
      context.lineTo(currentPosition.x, currentPosition.y);
      context.strokeStyle = "#000"; // color of the line
      context.lineWidth = 2; // width of the line
      context.stroke();
    });
  }, [drawingData]);

  const toggleWhiteboardVisibility = () => {
    setWhiteboardVisible((prevVisibility) => !prevVisibility);
  };

  const clearWhiteboard = () => {
    setDrawingData([]);
    const canvas = document.getElementById("whiteboard-canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  };


  return (
    <div className="class-window">
      <div className="class-header">
        <p>Classroom</p> {/* Update the text here */}
      </div>
      <div className="class-body" ref={chatBodyRef}>
        {messageList.map((messageContent, index) => {
          const isSystemMessage = messageContent.author === 'System';
          const messageClassName = isSystemMessage ? 'system-message' : '';
  
          return (
            <div
              key={index}
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
      <div className="whiteboard" style={{ display: whiteboardVisible ? "block" : "none" }}>
        <canvas
          id="whiteboard-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          width={800} // Set initial width
          style={{ border: "1px solid #000" }}
        ></canvas>
      </div>
      <div className="whiteboard-options">
        <button onClick={toggleWhiteboardVisibility} className="whiteboard-btn"style={{ color: "black", backgroundColor: "lightblue", border: "white", padding: "8px", fontWeight: "bold" }}>{whiteboardVisible ? "Hide Whiteboard" : "Show Whiteboard"}</button>
        <button onClick={clearWhiteboard} className="whiteboard-btn"style={{ color: "black", backgroundColor: "lightblue", border: "white", padding: "8px", fontWeight: "bold" }}>Clear Whiteboard</button>
      </div>
      <div className="class-backbtn" style={{ padding: "10px", paddingLeft: "360px" }}>
        <button onClick={handleLeaveRoom} style={{ color: "black", backgroundColor: "lightblue", border: "white", padding: "8px", fontWeight: "bold" }}>Leave Room</button>
      </div>
    </div>
  );
  
}

export default Class;
