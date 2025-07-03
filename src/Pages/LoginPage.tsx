import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "../Styles/LoginPage.css";

function LoginPage() {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [signInData, setSignInData] = useState({ emailID: "", password: "" });
    const [signUpData, setSignUpData] = useState({ name: "", userName: "", emailID: "", password: "" });
    const [signInError, setSignInError] = useState("");
    const [signUpError, setSignUpError] = useState("");

    useEffect(() => {
        const updateFormStyles = (form: HTMLElement, isActive: boolean) => {
            form.style.opacity = isActive ? "1" : "0.4";
            form.style.width = isActive ? "75%" : "25%";
            form.querySelectorAll("input").forEach(input => (input.disabled = !isActive));
        };
    
        const signInForm = document.querySelector(".login-sign-in") as HTMLElement;
        const signUpForm = document.querySelector(".login-sign-up") as HTMLElement;
    
        if (signInForm && signUpForm) {
            updateFormStyles(signInForm, isSignIn);
            updateFormStyles(signUpForm, !isSignIn);
        }
    }, [isSignIn]);

    const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignInData({ ...signInData, [e.target.name]: e.target.value });
    };

    const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    };

    const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSignInError("");

        try {
            await login(signInData.emailID, signInData.password);
            navigate("/main");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSignInError(error.message || "An error occurred");
            } else {
                setSignInError("An unknown error occurred");
            }
        }
    };

    const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSignUpError("");

        try {
            await register(signUpData);
            navigate("/main");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSignUpError(error.message || "An error occurred");
            } else {
                setSignUpError("An unknown error occurred");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-main-container">
                <div className={`login-form-container login-sign-in ${isSignIn ? "login-active" : ""}`}>
                    <h2>Sign In</h2>
                    <form className="login-form" onSubmit={handleSignInSubmit}>
                        <input className="login-input" type="emailID" name="emailID" placeholder="Email" value={signInData.emailID} onChange={handleSignInChange} required />
                        <input className="login-input" type="password" name="password" placeholder="Password" value={signInData.password} onChange={handleSignInChange} required />
                        <button className="login-button" type="submit">Sign In</button>
                        {signInError && <p className="login-error-message">{signInError}</p>}
                        <p>Don't have an account? <a href="#" onClick={() => setIsSignIn(false)}>Sign Up</a></p>
                    </form>
                </div>

                <div className={`login-form-container login-sign-up ${!isSignIn ? "login-active" : ""}`}>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignUpSubmit}>
                        <input className="login-input" type="text" name="name" placeholder="Name" value={signUpData.name} onChange={handleSignUpChange} required />
                        <input className="login-input" type="text" name="userName" placeholder="Username" value={signUpData.userName} onChange={handleSignUpChange} required />
                        <input className="login-input" type="email" name="emailID" placeholder="Email" value={signUpData.emailID} onChange={handleSignUpChange} required />
                        <input className="login-input" type="password" name="password" placeholder="Password" value={signUpData.password} onChange={handleSignUpChange} required />
                        <button className="login-button" type="submit">Sign Up</button>
                        {signUpError && <p className="login-error-message">{signUpError}</p>}
                        <p>Already have an account? <a href="#" onClick={() => setIsSignIn(true)}>Sign In</a></p>
                    </form>
                </div>
            </div>
            <div className="login-social-login">
                <p>Or sign in with</p>
                <button className="login-button login-oauth-btn google" type="button" onClick={() => window.location.href='http://localhost:5000/api/auth/google'}>Sign In with Google</button>
                <button className="login-button login-oauth-btn github" type="button" onClick={() => window.location.href='http://localhost:5000/api/auth/github'}>Sign In with GitHub</button>
            </div>
        </div>
    );
}

export default LoginPage;