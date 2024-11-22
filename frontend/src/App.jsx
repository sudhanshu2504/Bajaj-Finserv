import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Select from 'react-select';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    setError('');
    setResponse(null);
    setSelectedOptions([]);

    try {
      const parsedInput = JSON.parse(jsonInput); // Parse JSON input
      const res = await axios.post('https://bfhl-task1-1.onrender.com/bfhl', { data: parsedInput.data });
      setResponse(res.data);
    } catch (error) {
      setError('Invalid JSON input or Error fetching data');
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected.map(option => option.value));
  };

  const renderFilteredResponse = () => {
    if (!response) return null;
    return (
      <div className="filtered-response">
        {selectedOptions.includes('numbers') && (
          <div>
            <h3>Numbers:</h3>
            <p>{response.numbers.join(', ')}</p>
          </div>
        )}
        {selectedOptions.includes('alphabets') && (
          <div>
            <h3>Alphabets:</h3>
            <p>{response.alphabets.join(', ')}</p>
          </div>
        )}
        {selectedOptions.includes('highest_lowercase_alphabet') && (
          <div>
            <h3>Highest Lowercase Alphabet:</h3>
            <p>{response.highest_lowercase_alphabet}</p>
          </div>
        )}
      </div>
    );
  };

  // Options for react-select
  const filterOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  return (
    <div className="App">
      <h1>{'0101CS211118'}</h1>
      <h3>API Input</h3>
      <input 
        type="text" 
        value={jsonInput} 
        onChange={handleInputChange} 
        placeholder="Enter JSON input" 
        className="json-input" 
      />
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
      {error && <p className="error">{error}</p>}
      {response && (
        <div className="response-container">
          <h3>Filters</h3>
          <Select
            isMulti
            options={filterOptions}
            onChange={handleSelectChange}
            value={filterOptions.filter(option => selectedOptions.includes(option.value))}
            className="multi-select"
          />
          {renderFilteredResponse()}
        </div>
      )}
      <div>Backend might take 40-50 second to start, due to unactivity for long time</div>
    </div>
  );
}

export default App;
