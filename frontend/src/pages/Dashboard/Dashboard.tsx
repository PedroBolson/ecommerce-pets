import React from "react";
import "./Dashboard.css";
import LogoutButton from "../../components/LogoutButton/LogoutButton";

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <LogoutButton />
            </div>
            <p>Welcome to the dashboard!</p>
        </div>
    );
}

export default Dashboard;