import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import "./login.css";

const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setErrorMessage] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [redirectToHome, setRedirectToHome] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        try {
            await doSignInWithEmailAndPassword(email, password);
            setRedirectToHome(true); // Set redirect flag after successful login
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSigningIn(false);
        }
    };

    useEffect(() => {
        if (userLoggedIn) {
            setRedirectToHome(true);
        }
    }, [userLoggedIn]);

    // Redirect if user is logged in or if login was successful
    if (redirectToHome) {
        return <Navigate to="/home" />;
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <form onSubmit={onSubmit}>
                    <div className="login-input-group">
                        <label className="login-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="login-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-input-group">
                        <label className="login-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="login-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-options">
                        <button
                            type="submit"
                            className="login-btn"
                            disabled={isSigningIn}
                        >
                            {isSigningIn ? "Logging in..." : "Login"}
                        </button>
                    </div>
                    {error && <div className="login-error-message">{error}</div>}
                </form>

                <div className="signup-link">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
