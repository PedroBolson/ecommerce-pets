import React from 'react';
import './LoginButton.css';
interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}

export const LoginButton: React.FC<ButtonProps> = ({
    type = 'button',
    onClick,
    disabled = false,
    className = '',
    children
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`button ${className}`}
        >
            {children}
        </button>
    );
};