import React, { useState } from 'react';

function DictionaryComponent() {
  const [dictionary, setDictionary] = useState({});

  // Function to add a key-value pair to the dictionary
  const addKeyValuePair = (key, value) => {
    setDictionary((prevDictionary) => ({
      ...prevDictionary,
      [key]: value,
    }));
  };

  // Function to retrieve the value associated with a key
  const getValueByKey = (key) => {
    return dictionary[key];
  };

  return (
    <div>
      <button onClick={() => addKeyValuePair('name', 'John')}>Add Name</button>
      <button onClick={() => addKeyValuePair('age', 30)}>Add Age</button>
      <div>
        Name: {getValueByKey('name')}
      </div>
      <div>
        Age: {getValueByKey('age')}
      </div>
    </div>
  );
}

export default DictionaryComponent;
