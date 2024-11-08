import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Home from './components/home/home';


function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to BobBank!</h1>
        <p className="landing-subtitle">Enjoy your first banking assistent</p>
        <div className="landing-buttons">
          <Link to="/login" className="landing-btn landing-login-btn">Log In</Link>
          <Link to="/signup" className="landing-btn landing-signup-btn">Sign Up</Link>
        </div>
      </div>
      <div className="landing-background">
        <div className="landing-chat-bubble landing-chat-bubble1"></div>
        <div className="landing-chat-bubble landing-chat-bubble2"></div>
        <div className="landing-chat-bubble landing-chat-bubble3"></div>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;