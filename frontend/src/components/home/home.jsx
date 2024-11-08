import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase';
import { doSignOut } from '../../firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import './home.css';

function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Listen to authentication state changes only once
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log('User logged in:', currentUser.email);
      } else {
        setRedirectToLogin(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Redirect to login if the user is not logged in
  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  // Logout function
  const handleLogout = async () => {
    try {
      await doSignOut();
      setRedirectToLogin(true);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { text: input, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const receiverMessage = { text: input, isUser: false };
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, receiverMessage]);
      }, 500);

      setInput('');
    }
  };

  const handleUploadClick = () => {
    setShowUpload(!showUpload);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      // Handle file upload logic here
    }
  };

  return (
    <div className="home-page">
      <header className="home-page__header">
        <div className="home-page__welcome-section">
          <span>Hi, {user?.email || 'User'}</span>
          <button className="home-page__upload-button" onClick={handleUploadClick}>
            +
          </button>
          {showUpload && (
            <input
              type="file"
              onChange={handleFileChange}
              className="home-page__file-input"
              style={{ display: 'none' }}
              id="fileUpload"
            />
          )}
          <label htmlFor="fileUpload" className="home-page__upload-label">
            Upload Document
          </label>
        </div>
        <button className="home-page__logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="home-page__chat-area">
        {messages.map((msg, index) => (
          <div key={index} className={`home-page__message ${msg.isUser ? 'home-page__user' : 'home-page__receiver'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="home-page__input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Home;
