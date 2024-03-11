import "./App.css";
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "./cookieUtils"; // Import your cookie utility functions.
import WaitRoom from "./WaitRoom";

function App() {
  const [username, setUsername] = useState("");
  const [yourLanguage, setYourLanguage] = useState(getCookie("userLanguage") || ""); // Initialize with the value from the cookie, if available.
  const [learnLanguage, setLearnLanguage] = useState(getCookie("newLang") || ""); // Initialize with the value from the cookie, if available.
  const [waitRoom, setWaitRoom] = useState(false);
  const [generatedFirstName, setGeneratedFirstName] = useState('');
  const [generatedLastName, setGeneratedLastName] = useState('');
  const [portNumber, setPortNumber] = useState('');


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
    'blue', 'red', 'green', 'yellow', 'orange',
    'purple', 'pink', 'black', 'white', 'brown',
  ];
  const lastNames = [
    'Horse', 'Dog', 'Cat', 'Bird', 'Fish',
    'Tiger', 'Lion', 'Bear', 'Monkey', 'Snake',
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
  }, []);


  const joinRoom = () => {

    if (username !== "") {
      // Store the language preferences in cookies when joining the room.
      if (yourLanguage !== "") {
        setCookie("userLanguage", yourLanguage, 365); // You can adjust the expiration time as needed.
      }
      if (learnLanguage !== "") {
        setCookie("newLang", learnLanguage, 365); // You can adjust the expiration time as needed.
      }

      let params = "user_language=" + yourLanguage + "&desired_language=" + learnLanguage
      const request = new Request("http://localhost:30001/chatroom?" + params, {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })

      fetch(request).then(res => {
        return res.json()
      }).then(data => {
        setPortNumber(data.chatroom_port);
        setWaitRoom(true);
      })     
    }
  };

  return (
    <div className="App">
      {(
        waitRoom ? (
          <WaitRoom username={username} yourLanguage={yourLanguage} learnLanguage={learnLanguage} portNumber={portNumber}/>
        ) : (
          <div className="joinChatContainer">
            <h3>Join A Chat</h3>
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
