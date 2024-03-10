import "./App.css";
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "./cookieUtils"; // Import your cookie utility functions.
import WaitRoom from "./WaitRoom";

function App() {
  const [username, setUsername] = useState("");
  const [yourSubject, setYourSubject] = useState(getCookie("userSubject") || ""); // Initialize with the value from the cookie, if available.
  const [learnSubject, setLearnSubject] = useState(getCookie("newSubj") || ""); // Initialize with the value from the cookie, if available.
  const [waitRoom, setWaitRoom] = useState(false);
  const [generatedFirstName, setGeneratedFirstName] = useState('');
  const [generatedLastName, setGeneratedLastName] = useState('');
  const [portNumber, setPortNumber] = useState('');


  // All supported by DeepL
  const subjectOptions = [
    { value: "en", label: "English" },
    { value: "ch", label: "Chemistry" },
    { value: "ma", label: "Mathematics" },
    { value: "cn", label: "Chinese" },
    { value: 'my', label: 'Malay' },
    { value: 'tm', label: 'Tamil' },
    { value: 'bi', label: 'Biology' },
    { value: 'ph', label: 'Physics' },
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
      if (yourSubject !== "") {
        setCookie("userSubject", yourSubject, 365); // You can adjust the expiration time as needed.
      }
      if (learnSubject !== "") {
        setCookie("newSubj", learnSubject, 365); // You can adjust the expiration time as needed.
      }

      let params = "user_subject=" + yourSubject + "&desired_subject=" + learnSubject
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
          <WaitRoom username={username} yourSubject={yourSubject} learnSubject={learnSubject} portNumber={portNumber}/>
        ) : (
          <div className="joinChatContainer">
            <h3>Join A Chat</h3>
            <div>
              <select
                value={yourSubject}
                onChange={(event) => {
                  setUsername(generatedFirstName + generatedLastName)
                  setYourSubject(event.target.value);
                }}
              >
                <option value="">Select Your Subject</option>
                {subjectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={learnSubject}
                onChange={(event) => {
                  setLearnSubject(event.target.value);
                }}
              >
                <option value="">Select Subject to Learn</option>
                {subjectOptions.map((option) => (
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
