import { useState, useEffect } from "react";
import './App.css'; // Import the CSS file

function App() {
  const [text, setText] = useState("");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        const indianVoice = availableVoices.find((v) =>
          v.name.toLowerCase().includes("india")
        );
        setSelectedVoice(indianVoice || availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const handleSpeak = () => {
    if (text.trim() !== "" && selectedVoice && !isLoading) {
      setIsLoading(true);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = rate;
      
      utterance.onend = () => {
        setIsLoading(false);
      };
      
      utterance.onerror = () => {
        setIsLoading(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <div className="tts-card">
        <h1 className="app-title">
          🎙️ Text to Speech
        </h1>

        {/* Textarea */}
        <div className="form-group">
          <textarea
            className="text-input"
            rows="4"
            placeholder="Type something to speak..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Speed control */}
        <div className="form-group">
          <label className="form-label">
            Speed: <span className="speed-value">{rate}</span>
          </label>
          <input
            className="speed-slider"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>

        {/* Voice dropdown */}
        <div className="form-group">
          <label className="form-label">Voice:</label>
          <select
            className="voice-select"
            value={selectedVoice?.name || ""}
            onChange={(e) =>
              setSelectedVoice(voices.find((v) => v.name === e.target.value))
            }
          >
            {voices.map((voice, i) => (
              <option key={i} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Control buttons */}
        <div className="form-group">
          {!isLoading ? (
            <button
              className="speak-button"
              onClick={handleSpeak}
              disabled={!text.trim() || !selectedVoice}
            >
              🔊 Speak
            </button>
          ) : (
            <button
              className="speak-button"
              onClick={handleStop}
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              ⏹️ Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;