import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import pregchatLogo from './assets/pregchat_logo.png'; 

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('password', password);

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user_id', data.user_id);
        if (data.user_name) {
          localStorage.setItem('user_name', data.user_name);
        }
        navigate('/landing');
      } else {
        const error = await response.json();
        alert(`Login failed: ${error.detail || 'Invalid credentials'}`);
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('Error connecting to the server. Please make sure the backend is running.');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <h1 className="site-title">PregChat</h1>
        <img src={pregchatLogo} alt="PregChat Logo" className="logo" />
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="user_id"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
