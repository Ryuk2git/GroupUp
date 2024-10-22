import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/auth'; // Import real API functions

export const useAuth = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const signIn = async (email, password) => {
        try {
            const { token, user } = await loginUser({ email, password });
            if (token) {
                localStorage.setItem('token', token);
                navigate('/main');
            } else {
                throw new Error('Incorrect username or password');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const signUp = async (name, email, password) => {
        try {
            const { token, user } = await registerUser({ name, email, password });
            if (token) {
                localStorage.setItem('token', token);
                navigate('/main');
            } else {
                throw new Error('Failed to sign up. Please try again.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return { signIn, signUp, error };
};
