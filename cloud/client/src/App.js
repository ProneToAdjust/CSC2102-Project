import "./App.css";
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "./cookieUtils"; // Import your cookie utility functions.
import WaitRoom from "./WaitRoom";
import io from "socket.io-client";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [yourLanguage, setYourLanguage] = useState(getCookie("userLanguage") || ""); // Initialize with the value from the cookie, if available.
  const [learnLanguage, setLearnLanguage] = useState(getCookie("newLang") || ""); // Initialize with the value from the cookie, if available.
  const [waitRoom, setWaitRoom] = useState(false);
  const [generatedFirstName, setGeneratedFirstName] = useState('');
  const [generatedLastName, setGeneratedLastName] = useState('');


  // All supported by DeepL
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "ko", label: "Korean" },
    { value: "ja", label: "Japanese" },
    { value: 'bg', label: 'Bulgarian' },
    { value: 'cs', label: 'Czech' },
    { value: 'da', label: 'Danish' },
    { value: 'de', label: 'German' },
    { value: 'el', label: 'Greek' },
    { value: 'et', label: 'Estonian' },
    { value: 'fi', label: 'Finnish' },
    { value: 'fr', label: 'French' },
    { value: 'hu', label: 'Hungarian' },
    { value: 'id', label: 'Indonesian' },
    { value: 'it', label: 'Italian' },
    { value: 'lt', label: 'Lithuanian' },
    { value: 'lv', label: 'Latvian' },
    { value: 'nb', label: 'Norwegian (Bokmål)' },
    { value: 'nl', label: 'Dutch' },
    { value: 'pl', label: 'Polish' },
    { value: 'ro', label: 'Romanian' },
    { value: 'ru', label: 'Russian' },
    { value: 'sk', label: 'Slovak' },
    { value: 'sl', label: 'Slovenian' },
    { value: 'sv', label: 'Swedish' },
    { value: 'tr', label: 'Turkish' },
    { value: 'uk', label: 'Ukrainian' },
    { value: 'zh', label: 'Chinese' }
  ];

  // Lists of colors and animals 
  const firstNames = [
    'Stupid', 'Smart', 'Dumb', 'Crazy', 'Insane',
    'Silly', 'Funny', 'Weird', 'Strange', 'Normal',
    'Desperate', 'Gay', 'Racist', 'Sad', 'Angry'
  ];
  const lastNames = [
    'YaoTeck', 'Ryan', 'Keagan', 'Mirza', 'JW',
    'KuangYi', 'Phileo', 'Rayray', 'Gabby', 'Fred',
    'Please', 'Send', 'HELP', 'Duck', 'Horse'
  ];

  //  Generate random name. 
  useEffect(() => {

    const randomFirstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];
    setGeneratedFirstName(randomFirstName);
    setGeneratedLastName(randomLastName);
    setUsername(randomFirstName + randomLastName);
    console.log(username);
  }, []);


  const joinRoom = () => {

    if (username !== "" && room !== "") {
      // Store the language preferences in cookies when joining the room.
      if (yourLanguage !== "") {
        setCookie("userLanguage", yourLanguage, 365); // You can adjust the expiration time as needed.
      }
      if (learnLanguage !== "") {
        setCookie("newLang", learnLanguage, 365); // You can adjust the expiration time as needed.
      }
      setWaitRoom(true);

    }
  };



  return (
    <div className="App">
      {(
        waitRoom ? (
          <WaitRoom username={username} room={room} yourLanguage={yourLanguage} learnLanguage={learnLanguage} />
        ) : (
          <div className="joinChatContainer">
            <h3>Join A Chat</h3>
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
                  setUsername(generatedFirstName + generatedLastName)
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
