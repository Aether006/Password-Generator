import React, { useState } from 'react';
import { FaClipboard, FaMoon, FaSun, FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';

const App = () => {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [autoCopy, setAutoCopy] = useState(false);
  const [passphraseMode, setPassphraseMode] = useState(false);
  const [separator, setSeparator] = useState('-');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [entropy, setEntropy] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [monospace, setMonospace] = useState(true);

  const ambiguousChars = '0OIl';
  const words = ['solar', 'monkey', 'glass', 'orange', 'cat', 'dog', 'tree', 'house', 'car', 'book'];

  const generatePassword = () => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols && !passphraseMode) {
      alert('Please select at least one character type!');
      return;
    }

    let generatedPassword = '';

    if (passphraseMode) {
      const wordCount = Math.floor(Math.random() * 3) + 4; // 4 to 6 words
      for (let i = 0; i < wordCount; i++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        generatedPassword += randomWord + (i < wordCount - 1 ? separator : '');
      }
    } else {
      const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lower = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

      let charset = '';
      if (includeUppercase) charset += upper;
      if (includeLowercase) charset += lower;
      if (includeNumbers) charset += numbers;
      if (includeSymbols) charset += symbols;
      if (excludeAmbiguous) charset = charset.split('').filter(c => !ambiguousChars.includes(c)).join('');

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        generatedPassword += charset[randomIndex];
      }
    }

    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
    updateHistory(generatedPassword);
    if (autoCopy) copyToClipboard(generatedPassword);
  };

  const calculateStrength = (password) => {
    let entropy = 0;
    if (includeUppercase) entropy += 26;
    if (includeLowercase) entropy += 26;
    if (includeNumbers) entropy += 10;
    if (includeSymbols) entropy += 32;
    if (excludeAmbiguous) entropy -= ambiguousChars.length;

    const strengthValue = Math.log2(Math.pow(entropy, password.length));
    setEntropy(strengthValue.toFixed(2));

    if (strengthValue < 50) setStrength('Weak');
    else if (strengthValue < 70) setStrength('Moderate');
    else if (strengthValue < 90) setStrength('Good');
    else setStrength('Strong');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Password copied to clipboard!');
  };

  const updateHistory = (newPassword) => {
    setHistory((prevHistory) => {
      const updatedHistory = [newPassword, ...prevHistory];
      return updatedHistory.slice(0, 5);
    });
  };

  const downloadHistory = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + history.map((item, index) => `Password ${index + 1},${item}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'password_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <>
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-bg {
          background: linear-gradient(270deg, #ff6ec4, #7873f5, #4ade80);
          background-size: 600% 600%;
          animation: gradient 15s ease infinite;
        }
        .neon-text {
          text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff6ec4, 0 0 20px #ff6ec4, 0 0 25px #ff6ec4, 0 0 30px #ff6ec4, 0 0 35px #ff6ec4;
        }
      `}</style>

      <div className={`flex items-center justify-center min-h-screen gradient-bg transition-colors duration-500 ${darkMode ? 'text-white' : 'text-black'}`}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md transition-all duration-500 border-4 border-purple-500">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold neon-text">Password Generator</h1>
            <button onClick={() => setDarkMode(!darkMode)} className="text-2xl text-pink-500 dark:text-pink-300">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-pink-500 dark:text-pink-300">Password Length: {length}</label>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full accent-pink-500"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center text-pink-500 dark:text-pink-300">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="mr-2 accent-pink-500"
              />
              Include Uppercase Letters
            </label>
            <label className="flex items-center text-pink-500 dark:text-pink-300">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="mr-2 accent-pink-500"
              />
              Include Lowercase Letters
            </label>
            <label className="flex items-center text-pink-500 dark:text-pink-300">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="mr-2 accent-pink-500"
              />
              Include Numbers
            </label>
            <label className="flex items-center text-pink-500 dark:text-pink-300">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="mr-2 accent-pink-500"
              />
              Include Symbols
            </label>
            <label className="flex items-center text-pink-500 dark:text-pink-300">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="mr-2 accent-pink-500"
              />
              Exclude Ambiguous Characters
            </label>
            <label className="flex items-center text-pink-500 dark:text-pink-300">
              <input
                type="checkbox"
                checked={autoCopy}
                onChange={(e) => setAutoCopy(e.target.checked)}
                className="mr-2 accent-pink-500"
              />
              Auto-copy to clipboard on generate
            </label>
            <label className="flex items-center text-pink-500 dark:text-pink-300">
              <input
                type="checkbox"
                checked={passphraseMode}
                onChange={(e) => setPassphraseMode(e.target.checked)}
                className="mr-2 accent-pink-500"
              />
              Passphrase Mode
            </label>
            {passphraseMode && (
              <div className="mt-2">
                <label className="block mb-2 text-pink-500 dark:text-pink-300">Separator:</label>
                <input
                  type="text"
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full p-2 border border-pink-500 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                />
              </div>
            )}
          </div>
          <button
            onClick={generatePassword}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors duration-300"
          >
            Generate Password
          </button>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className={`font-mono text-lg text-pink-500 dark:text-pink-300 ${monospace ? 'font-mono' : ''}`}>{showPassword ? password : '*'.repeat(password.length)}</span>
              <button onClick={() => setShowPassword(!showPassword)} className="text-pink-500 hover:text-pink-600">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button onClick={() => copyToClipboard(password)} className="text-pink-500 hover:text-pink-600">
                <FaClipboard />
              </button>
            </div>
            <div className="mt-2">
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    strength === 'Weak' ? 'bg-red-500 w-1/4' :
                    strength === 'Moderate' ? 'bg-orange-500 w-1/2' :
                    strength === 'Good' ? 'bg-yellow-500 w-3/4' :
                    'bg-green-500 w-full'
                  }`}
                ></div>
              </div>
              <p className="text-center mt-1 text-pink-500 dark:text-pink-300">Strength: {strength} <FaInfoCircle title="Entropy is a measure of randomness. Higher entropy means a stronger password." /></p>
              <p className="text-center mt-1 text-pink-500 dark:text-pink-300">Entropy: {entropy} bits</p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-bold text-pink-500 dark:text-pink-300">History</h2>
            <div className="flex flex-wrap mt-2 overflow-y-auto" style={{ maxHeight: '100px' }}>
              {history.map((item, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-600 p-2 m-1 rounded cursor-pointer" onClick={() => copyToClipboard(item)}>
                  {item}
                </div>
              ))}
            </div>
            <button onClick={downloadHistory} className="mt-2 bg-pink-500 text-white py-1 px-3 rounded-lg hover:bg-pink-600 transition-colors duration-300">
              Download History
            </button>
            <button onClick={clearHistory} className="mt-2 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors duration-300 ml-2">
              Clear History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App; 