import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const emojiMap = {
  Curious: "🤔",
  Happy: "😊",
  Sad: "😢",
  Excited: "🤩",
  Tired: "🥱",
  Loved: "❤️",
  Calm: "😌",
  Active: "🤸‍♀️",
  Resting: "😴",
  Content: "😊",
  Playful: "🧸",
};

const TalkToBaby = () => {
  const [message, setMessage] = useState("");
  const [babyReplyText, setBabyReplyText] = useState("");
  const [detectedMood, setDetectedMood] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const [speechSynthesisReady, setSpeechSynthesisReady] = useState(false);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setSpeechSynthesisReady(true);
      console.log("Voices changed - speechSynthesisReady set to true");
    };

    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      console.log("Available voices on mount:", voices);
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      if (voices.length > 0) {
        setSpeechSynthesisReady(true);
        console.log("Initial check - speechSynthesisReady set to true");
      }
    } else {
      console.log("Speech synthesis not supported in this browser.");
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      }
    };
  }, []);

  const speakBabyMessage = (text) => {
    console.log("speakBabyMessage called with:", text);
    if (speechSynthesisReady && 'speechSynthesis' in window) {
      // Remove text within brackets and surrounding whitespace
      const textWithoutBrackets = text.replace(/\s?\*.*?\*\s?/g, '').trim();
      console.log("Text after removing brackets:", textWithoutBrackets);

      // Regular expression to remove emojis
      const textWithoutEmojis = textWithoutBrackets.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{23F8}-\u{23FA}\u{1F000}-\u{1F003}\u{1F0C0}-\u{1F0CF}\u{1F18E}\u{1F201}-\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}-\u{1F251}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/ug, '').trim();
      console.log("Text after removing emojis:", textWithoutEmojis);

      if (textWithoutEmojis !== "") {
        const utterance = new SpeechSynthesisUtterance(textWithoutEmojis);
        utterance.pitch = 1.8;
        utterance.rate = 1.1;
        const voices = window.speechSynthesis.getVoices();
        const babyVoice = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes('child')) ||
                          voices.find(v => v.lang === "en-US") || voices[0];
        utterance.voice = babyVoice;
        window.speechSynthesis.speak(utterance);
        console.log("Speech started (without brackets and emojis) for:", textWithoutEmojis);
      } else {
        console.log("No text to speak after removing brackets and emojis.");
      }
    } else {
      console.log("Speech synthesis not ready or not supported.");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      console.log("Sending message to backend:", { user_id, message });
      const params = new URLSearchParams();
      params.append('user_id', user_id);
      params.append('message', message);

      const response = await axios.post("http://127.0.0.1:8000/talk-to-baby", params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log("Backend response:", response.data);
      const babyResponse = response.data.baby_response;
      const mood = response.data.detected_mood;

      setBabyReplyText(babyResponse);
      console.log("babyReplyText updated to:", babyResponse);
      setDetectedMood(mood);
      console.log("detectedMood updated to:", mood);
      speakBabyMessage(babyResponse);

      if (mood) {
        setMoodHistory((prev) => [...prev, { mood, time: new Date().toLocaleTimeString() }]);
        console.log("moodHistory updated:", moodHistory);
      }
      setMessage("");
    } catch (error) {
      console.error("Error talking to baby:", error);
    }
  };

  const moodData = {
    labels: moodHistory.map((entry) => entry.time),
    datasets: [
      {
        label: "Mother's Mood Tracker",
        data: moodHistory.map((entry) => Object.keys(emojiMap).indexOf(entry.mood) + 1),
        fill: false,
        borderColor: "#f48fb1",
        tension: 0.4,
      },
    ],
  };

  const moodOptions = {
    scales: {
      y: {
        ticks: {
          callback: (value) => emojiMap[Object.keys(emojiMap)[value - 1]],
        },
        min: 0,
        max: Object.keys(emojiMap).length - 1,
        stepSize: 1,
      },
    },
  };

  return (
    <div className="p-6 bg-pink-50 min-h-screen font-[cursive]">
      <h2 className="text-3xl text-pink-600 font-bold mb-4">👶 Talk to Baby</h2>

      <div className="mb-4 bg-white p-3 rounded-xl shadow-md">
        <p><strong>You said:</strong> {message || <i>(Start typing to talk to your baby)</i>}</p>
      </div>

      {babyReplyText && (
        <div className="mb-4 bg-white p-3 rounded-xl shadow-md">
          <p>
            <strong>Baby's Response:</strong>
          </p>
          <div className="mb-2">
            <i className="block text-xl text-pink-500">{babyReplyText}</i>
          </div>
          {detectedMood && (
            <p>
              <strong>Mother's Mood:</strong> {emojiMap[detectedMood] || ""} {detectedMood}
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say something to your baby..."
          className="w-full p-2 border border-pink-300 rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
        >
          Send
        </button>
      </div>

      {moodHistory.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl mb-2">Mother's Mood Over Time</h3>
          <Line data={moodData} options={moodOptions} />
        </div>
      )}
    </div>
  );
};

export default TalkToBaby;