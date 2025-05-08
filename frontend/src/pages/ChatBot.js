import React, { useState, useEffect, useRef } from 'react';

function ChatBot() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const qaRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedChat = localStorage.getItem('chat_history');

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      window.location.href = '/';
    }

    if (storedChat) {
      setChatHistory(JSON.parse(storedChat));
    }

    const fetchSessions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/sessions/${storedUserId}`);
        const data = await response.json();
        if (data && data.sessions) {
          setSessions(data.sessions);
        }
      } catch (err) {
        console.error('Error fetching past sessions:', err);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    if (qaRef.current) qaRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const formatBotResponse = (text) => {
    const cleanedText = text.replace(/\*\*/g, '').trim();
    const lines = cleanedText.split(/\n|\*/).filter(line => line.trim() !== '');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.endsWith(':') || trimmed.match(/^(Recommendations|Important|What to do next)/i)) {
        return <p key={index} style={styles.botStepTitle}><strong>{trimmed}</strong></p>;
      }
      return <p key={index} style={styles.botStepText}>{trimmed}</p>;
    });
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const userMessage = { sender: 'user', text: message, time: new Date().toLocaleString() };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('message', message);

      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      const botReply = {
        sender: 'bot',
        text: data.response,
        time: new Date().toLocaleString(),
      };
      setChatHistory(prev => [...prev, botReply]);
    } catch (err) {
      console.error('Chat request failed:', err);
    } finally {
      setMessage('');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleSessionClick = async (sessionKey) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/session/${encodeURIComponent(sessionKey)}`);
      const data = await response.json();

      if (data && data.question && data.answer && data.timestamp) {
        const botMessages = data.answer.split('\n').map((line, index) => ({
          sender: 'bot',
          text: line,
          time: new Date(data.timestamp.replace(/-/g, '/')).toLocaleString(),
        }));

        const userMessage = {
          sender: 'user',
          text: data.question,
          time: new Date(data.timestamp.replace(/-/g, '/')).toLocaleString(),
        };

        setChatHistory([userMessage, ...botMessages.filter(msg => msg.text.trim() !== '')]);
      } else {
        console.warn('Session details incomplete:', data);
        setChatHistory([]);
      }
    } catch (err) {
      console.error('Error fetching session details:', err);
      setChatHistory([]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPane}>
        <h3 style={styles.historyTitle}>Chat History</h3>
        <div>
          {sessions.map((session, index) => (
            <div key={index} style={styles.sessionItem} onClick={() => handleSessionClick(session)}>
              <p style={styles.sessionText}>Session Key:</p>
              <p style={styles.sessionKey}>{session}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.chatPane}>
        <div style={styles.headerBar}>
          <div style={styles.userInfo}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/12867/12867845.png"
              alt="User Icon"
              style={styles.userIcon}
            />
            <div style={styles.userIdText}>User ID: {userId}</div>
          </div>
          <h2 style={styles.title}>Pregnancy Care Chatbot</h2>
          <div style={styles.timestamp}>{new Date().toLocaleString()}</div>
        </div>

        <div style={styles.qaSection}>
          {chatHistory.map((msg, index) => (
            <div key={index} style={msg.sender === 'user' ? styles.userBubble : styles.botBubble}>
              <div style={styles.chatText}>{msg.sender === 'user' ? 'You:' : 'Bot:'}</div>
              <div>{msg.sender === 'bot' ? formatBotResponse(msg.text) : msg.text}</div>
              <div style={styles.chatTime}>{msg.time}</div>
            </div>
          ))}
          {loading && <div style={styles.botBubble}><em>Typing...</em></div>}
          <div ref={qaRef}></div>
        </div>

        <div style={styles.inputWrapper}>
          <div style={styles.inputArea}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.sendButton}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#ffe6f0',
  },
  leftPane: {
    width: '25%',
    backgroundColor: '#fff',
    borderRight: '1px solid #f8bbd0',
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  historyTitle: {
    padding: '20px 0',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottom: '1px solid #f8bbd0',
    marginBottom: '15px',
  },
  sessionItem: {
    padding: '12px 15px',
    backgroundColor: '#fce4ec',
    borderRadius: '20px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f8bbd0',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  sessionText: {
    color: '#666',
    fontSize: '0.95rem',
    margin: 0,
  },
  sessionKey: {
    color: '#333',
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: '5px 0 0 0',
    wordBreak: 'break-all',
  },
  chatPane: {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f8bbd0',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  },
  userIdText: {
    fontSize: '1rem',
    color: '#777',
  },
  timestamp: {
    fontSize: '0.9rem',
    color: '#888',
  },
  title: {
    fontSize: '1.8rem',
    color: 'black',
    fontWeight: 'bold',
    margin: '0 20px',
  },
  qaSection: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px 25px',
    marginBottom: '20px',
  },
  userBubble: {
    backgroundColor: '#ffe0e5',
    borderRadius: '20px',
    padding: '15px',
    marginBottom: '12px',
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#f0f4c3',
    borderRadius: '20px',
    padding: '15px',
    border: '1px solid rgb(131, 131, 125)',
    marginBottom: '12px',
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  chatText: {
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#333',
  },
  chatTime: {
    fontSize: '0.85rem',
    textAlign: 'right',
    color: '#999',
    marginTop: '8px',
  },
  inputWrapper: {
    padding: '0 20px 20px 20px',
    backgroundColor: '#fff',
    borderTop: '1px solid rgb(6, 5, 5)',
    paddingTop: '20px',
  },
  inputArea: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: '15px 20px',
    fontSize: '1.1rem',
    borderRadius: '25px',
    border: '1px solid #f8bbd0',
    opacity: 0.7,
    '&::placeholder': {
      color: '#aaa',
      fontSize: '1.1rem',
    },
  },
  sendButton: {
    padding: '12px 25px',
    fontSize: '1rem',
    backgroundColor: '#ff6ec4',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    width: 'auto',
    minWidth: '80px',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: '#ff4081',
    },
  },
  botStepTitle: {
    fontWeight: 'bold',
    marginTop: '14px',
    marginBottom: '6px',
    fontSize: '1.05rem',
    color: '#ff6ec4',
  },
  sessionTimestamp: {
    color: '#999',
    fontSize: '0.8rem',
    marginTop: '4px',
  },
  botStepText: {
    marginBottom: '10px',
    fontSize: '1rem',
    color: '#444',
  },
  sessionKey: {
    color: '#333',
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: '5px 0 0 0',
    wordBreak: 'break-all',
  },
};

export default ChatBot;