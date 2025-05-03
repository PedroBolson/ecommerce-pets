import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css";

interface LogoutButtonProps {
    className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = "" }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login page
        navigate("/");
    };

    return (
        <button
            className={`logout-button ${className}`}
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default LogoutButton;