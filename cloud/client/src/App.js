// App.js
import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import { getCookie, setCookie } from "./cookieUtils";

const socket = io.connect("http://localhost:3001");

function generateRandomRoomID() {
  // Generate a random room ID, for example, a combination of letters and numbers.
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const roomID = Array.from({ length: 6 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  return roomID;
}

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [yourLanguage, setYourLanguage] = useState(getCookie("userLanguage") || "");
  const [learnLanguage, setLearnLanguage] = useState(getCookie("newLang") || "");
  const [room, setRoom] = useState(""); // Define the 'room' variable

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "kr", label: "Korean" },
    { value: "jp", label: "Japanese" },
  ];

  const joinRoom = () => {
    if (username !== "") {
      const newRoom = generateRandomRoomID(); // Generate a random room ID.
      setRoom(newRoom); // Set the 'room' variable
      // Store the language preferences in cookies when joining the room.
      if (yourLanguage !== "") {
        setCookie("userLanguage", yourLanguage, 365);
      }
      if (learnLanguage !== "") {
        setCookie("newLang", learnLanguage, 365);
      }

      socket.emit("join_room", newRoom); // Use the generated room ID.
      setShowChat(true);
    }
  }

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <div>
            <select
              value={yourLanguage}
              onChange={(event) => {
                setYourLanguage(event.target.value);
              }}
            >
              <option value="">Select Your Language</option>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={learnLanguage}
              onChange={(event) => {
                setLearnLanguage(event.target.value);
              }}
            >
              <option value="">Select Language to Learn</option>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />

      )}
    </div>
  );
}

export default App;