import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import "./register.css";

const Register = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setErrorMessage] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setIsSigningUp(true);
        try {
            await doCreateUserWithEmailAndPassword(email, password);
            setRedirectToLogin(true); // Set redirect flag after successful registration
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSigningUp(false);
        }
    };

    useEffect(() => {
        if (userLoggedIn) {
            setRedirectToLogin(true);
        }
    }, [userLoggedIn]);

    // Redirect to login if registration was successful
    if (redirectToLogin) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2 className="signup-title">Sign Up</h2>
                
                <form onSubmit={onSubmit}>
                    <div className="signup-input-group">
                        <label className="signup-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="signup-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="signup-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="signup-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="signup-error-message">{error}</div>}

                    <button type="submit" className="signup-btn" disabled={isSigningUp}>
                        {isSigningUp ? "Registering..." : "Sign Up"}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
