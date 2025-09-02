import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load voices and filter by desired accents/languages
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const filteredVoices = availableVoices.filter(v =>
        v.lang.includes("en-IN") || // English India
        v.lang.includes("en-US") || // English USA
        v.lang.includes("en-GB") || // English British
        v.lang.includes("hi-IN")    // Hindi India
      );
      setVoices(filteredVoices);

      if (filteredVoices.length > 0 && !selectedVoice) {
        // Default to English India if available
        const defaultVoice = filteredVoices.find(v => v.lang.includes("en-IN")) || filteredVoices[0];
        setSelectedVoice(defaultVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const handleSpeak = () => {
    if (text.trim() !== "" && selectedVoice && !isLoading) {
      setIsLoading(true);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = rate;

      utterance.onend = () => setIsLoading(false);
      utterance.onerror = () => setIsLoading(false);

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
        <h1 className="app-title">🎙️ Text to Speech</h1>

        <div className="form-group">
          <textarea
            className="text-input"
            rows="4"
            placeholder="Type something to speak..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

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
