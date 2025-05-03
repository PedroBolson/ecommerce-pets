import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../../components/Form/FormInput';
import { LoginButton } from '../../components/LoginButton/LoginButton';
import { authService } from '../../services/auth.service';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [confirmEmail, setConfirmEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (!isForgotPassword) {
                // Login mode
                const response = await authService.login({ email, password });

                localStorage.setItem('token', response.access_token);
                localStorage.setItem('user', JSON.stringify(response.user));

                navigate('/dashboard');
            } else {
                // Password reset mode
                if (newPassword !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                if (email !== confirmEmail) {
                    throw new Error('Email confirmation does not match');
                }

                await authService.resetPassword(
                    email,
                    confirmEmail,
                    newPassword,
                    confirmPassword
                );

                alert('Password has been reset. Please login with your new password.');
                setIsForgotPassword(false);
                setPassword('');
                setNewPassword('');
                setConfirmEmail('');
                setConfirmPassword('');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(!isForgotPassword);
        setError('');
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <h1>{isForgotPassword ? 'Reset Password' : 'Login to Monito Store'}</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    {isForgotPassword ? (
                        <>
                            <FormInput
                                id="email"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                            <FormInput
                                id="confirmEmail"
                                label="Confirm Email"
                                type="email"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                placeholder="Confirm your email"
                                required
                            />
                            <FormInput
                                id="newPassword"
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                            <FormInput
                                id="confirmPassword"
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </>
                    ) : (
                        <>
                            <FormInput
                                id="email"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                            <FormInput
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </>
                    )}

                    <LoginButton
                        type="submit"
                        disabled={isLoading}
                        className="login-button"
                    >
                        {isLoading
                            ? (isForgotPassword ? 'Resetting...' : 'Logging in...')
                            : (isForgotPassword ? 'Reset Password' : 'Login')}
                    </LoginButton>
                </form>

                <div className="additional-actions">
                    <button
                        onClick={toggleForgotPassword}
                        className="forgot-password-button"
                    >
                        {isForgotPassword ? 'Return to Login' : 'Forgot password?'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;