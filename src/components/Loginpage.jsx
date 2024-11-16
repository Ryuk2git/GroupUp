import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for API requests
import '../styles/Login_page.css'; // Assuming you have a separate CSS for styling

const LoginPage = () => {
    const [isSignIn, setIsSignIn] = useState(true); // To toggle between sign-in and sign-up
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');
    const [signUpName, setSignUpName] = useState('');
    const [userName, setUserName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signInError, setSignInError] = useState('');
    const [signUpError, setSignUpError] = useState('');
    const navigate = useNavigate();

    // Set up API URL for authentication routes
    const API_URL = 'http://localhost:3000/api/auth'; // Adjust according to your backend's port and endpoint

    // Function to update the form styles for animation
    const updateFormStyles = () => {
        const signInElement = document.querySelector('.sign-in');
        const signUpElement = document.querySelector('.sign-up');

        if (isSignIn) {
            signInElement.style.width = '75%';
            signInElement.style.opacity = '1';
            signUpElement.style.width = '25%';
            signUpElement.style.opacity = '0.4';
        } else {
            signUpElement.style.width = '75%';
            signUpElement.style.opacity = '1';
            signInElement.style.width = '25%';
            signInElement.style.opacity = '0.4';
        }
    };

    // Use useEffect to call updateFormStyles when the form state changes
    useEffect(() => {
        updateFormStyles();
    }, [isSignIn]);

    // Function to toggle between sign-in and sign-up forms
    const handleSignInClick = (event) => {
        event.preventDefault();
        setIsSignIn(true);
        setSignUpError(''); // Clear sign-up error when switching to sign-in
    };

    const handleSignUpClick = (event) => {
        event.preventDefault();
        setIsSignIn(false);
        setSignInError(''); // Clear sign-in error when switching to sign-up
    };

    // Function to handle both sign-in and sign-up form submissions
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSignInError('');
        setSignUpError('');

        try {
            if (isSignIn) {
                const response = await axios.post(`${API_URL}/login`, {
                    emailID: signInEmail,
                    password: signInPassword,
                });
                const { token, userId } = response.data; // Destructure response data
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                navigate('/main'); // Navigate to the main page
            } else {
                const response = await axios.post(`${API_URL}/register`, {
                    name: signUpName,
                    username: userName,
                    email: signUpEmail,
                    password: signUpPassword,
                });
                const { token, userId } = response.data; // Destructure response data
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                navigate('/main'); // Navigate to the main page
            }
        } catch (err) {
            console.error('Error response:', err.response); // Log the entire error response
            if (isSignIn) {
                setSignInError(err.response?.data?.errors?.map(error => error.msg).join(', ') || err.message);
            } else {
                setSignUpError(err.response?.data?.errors?.map(error => error.msg).join(', ') || err.message);
            }
        }
    };

    return (
        <div className="container">
            <div className="main-container">
                {/* Sign-in form */}
                <div className={`form-container sign-in ${isSignIn ? 'active' : ''}`}>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign In</button>
                        {signInError && <p className="error-message">{signInError}</p>}
                        <p>Don't have an account? <a href="#" onClick={handleSignUpClick}>Sign Up</a></p>
                    </form>
                </div>

                {/* Sign-up form */}
                <div className={`form-container sign-up ${!isSignIn ? 'active' : ''}`}>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={signUpName}
                            onChange={(e) => setSignUpName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign Up</button>
                        {signUpError && <p className="error-message">{signUpError}</p>}
                        <p>Already have an account? <a href="#" onClick={handleSignInClick}>Sign In</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
