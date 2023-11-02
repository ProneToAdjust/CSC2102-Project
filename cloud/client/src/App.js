import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "./cookieUtils"; // Import your cookie utility functions.
import WaitRoom from "./WaitRoom";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [yourLanguage, setYourLanguage] = useState(getCookie("userLanguage") || ""); // Initialize with the value from the cookie, if available.
  const [learnLanguage, setLearnLanguage] = useState(getCookie("newLang") || ""); // Initialize with the value from the cookie, if available.
  const [dictionary, setDictionary] = useState({});
  const [waitRoom, setWaitRoom] = useState(false);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "kr", label: "Korean" },
    { value: "jp", label: "Japanese" },
    // Add more language options as needed
  ];

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      // Store the language preferences in cookies when joining the room.
      if (yourLanguage !== "") {
        setCookie("userLanguage", yourLanguage, 365); // You can adjust the expiration time as needed.
      }
      if (learnLanguage !== "") {
        setCookie("newLang", learnLanguage, 365); // You can adjust the expiration time as needed.
      }
      const combinedName = yourLanguage + learnLanguage;
      addKeyValuePair(socket.id, combinedName);
      console.log(username);
      console.log(combinedName);
      console.log(socket.id);
      socket.emit("join_room", room);
      socket.emit("addKeyValuePair", { username: socket.id, language: combinedName });
      setWaitRoom(true);
    }
  };

  // Function to add a key-value pair to the dictionary
  const addKeyValuePair = (username, language) => {
    console.log('Adding key-value pair:', username, language);
    setDictionary((prevDictionary) => ({
      ...prevDictionary,
      [username]: language,
    }));
  };
  useEffect(() => {
    console.log('Dictionary:', dictionary);
  }, [dictionary]);

  useEffect(() => {
    socket.on("updateDictionary", (updatedDictionary) => {
      setDictionary(updatedDictionary);
    });
    return () => {
      // Clean up event listeners when the component unmounts
      socket.off("updateDictionary");
    };
  }, []);

  return (
    <div className="App">
      { (
        waitRoom ? (
          <WaitRoom socket={socket} username={username} room={room} dictionary={dictionary} yourLanguage={yourLanguage} learnLanguage={learnLanguage} />
          ) : (
          <div className="joinChatContainer">
            <h3>Join A Chat</h3>
            <input
              type="text"
              placeholder="John..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => {
                setRoom(event.target.value);
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
        )
      )}
    </div>
  );
}

export default App;
