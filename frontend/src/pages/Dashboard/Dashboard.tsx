import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import logo from "/Monito-logo.svg";
import "../../index.css";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import ManageBreeds from "../../components/ManageBreeds/ManageBreeds";
import ManageDogs from "../../components/ManageDogs/ManageDogs";
import ManageItemCategories from "../../components/ManageItemCategories/ManageItemCategories";
import ManageItems from "../../components/ManageItems/ManageItems";
import ManagePetKnowledge from "../../components/ManagePetKnowledge/ManagePetKnowledge";
import ManageContacts from "../../components/ManageContacts/ManageContacts";
import ManageAdoptionPhotos from "../../components/ManageAdoptionPhotos/ManageAdoptionPhotos";
import ManageUsers from "../../components/ManageUsers/ManageUsers";
import { API_CONFIG } from '../../config/api.config';

interface UserData {
    id: string;
    email: string;
    role: string;
}

// Function to decode JWT token
const decodeToken = (token: string): UserData | null => {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        const parsedPayload = JSON.parse(payload);

        return {
            id: parsedPayload.sub,
            email: parsedPayload.email,
            role: parsedPayload.role
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

const Dashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'loading'>('loading');
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = decodeToken(token);
            setUserData(user);
        }

        handleStatus();
        const intervalId = setInterval(handleStatus, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const handleStatus = async () => {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}/api/health`);
            if (response.ok) {
                setServerStatus('online');
            } else {
                setServerStatus('offline');
            }
        } catch (error) {
            setServerStatus('offline');
            console.error('Server status check failed:', error);
        }
    };

    const renderActiveSection = () => {
        if (userData?.role !== 'admin' && ['users'].includes(activeSection || '')) {
            return (
                <div className="db-access-denied">
                    <h2>Restrict Acess</h2>
                    <p>You don't have permission to acees this, sorry.</p>
                </div>
            );
        }

        switch (activeSection) {
            case "breeds":
                return <ManageBreeds />;
            case "dogs":
                return <ManageDogs />;
            case "item-categories":
                return <ManageItemCategories />;
            case "items":
                return <ManageItems />;
            case "pet-knowledge":
                return <ManagePetKnowledge />;
            case "contacts":
                return <ManageContacts />;
            case "adoption-photos":
                return <ManageAdoptionPhotos />;
            case "users":
                return <ManageUsers />;
            default:
                return (
                    <div className="db-dashboard-welcome">
                        {userData?.role === 'admin' ? (
                            <>
                                <h2>Welcome back to the admin panel!</h2>
                                <p>You have full access to manage all website resources.</p>
                            </>
                        ) : (
                            <>
                                <h2>Welcome back! Good to see you again!</h2>
                                <p>You can manage content you have permission to edit.</p>
                            </>
                        )}
                        <div className="db-user-info-card">
                            <div className="db-user-avatar">
                                {userData?.email?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="db-user-details">
                                <h3>{userData?.email || 'User'}</h3>
                                <span className={`db-user-role ${userData?.role}`}>
                                    {userData?.role === 'admin' ? 'Administrator' : 'Content Manager'}
                                </span>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const renderMenu = () => {
        const commonMenuItems = (
            <>
                <button
                    className={`db-menu-button ${activeSection === "breeds" ? "active" : ""}`}
                    onClick={() => setActiveSection("breeds")}
                >
                    Breeds
                </button>

                <button
                    className={`db-menu-button ${activeSection === "dogs" ? "active" : ""}`}
                    onClick={() => setActiveSection("dogs")}
                >
                    Dogs
                </button>

                <button
                    className={`db-menu-button ${activeSection === "item-categories" ? "active" : ""}`}
                    onClick={() => setActiveSection("item-categories")}
                >
                    Item Categories
                </button>

                <button
                    className={`db-menu-button ${activeSection === "items" ? "active" : ""}`}
                    onClick={() => setActiveSection("items")}
                >
                    Items
                </button>

                <button
                    className={`db-menu-button ${activeSection === "pet-knowledge" ? "active" : ""}`}
                    onClick={() => setActiveSection("pet-knowledge")}
                >
                    Pet Knowledge
                </button>

                <button
                    className={`db-menu-button ${activeSection === "contacts" ? "active" : ""}`}
                    onClick={() => setActiveSection("contacts")}
                >
                    Contacts
                </button>

                <button
                    className={`db-menu-button ${activeSection === "adoption-photos" ? "active" : ""}`}
                    onClick={() => setActiveSection("adoption-photos")}
                >
                    Adoption Photos
                </button>
            </>
        );

        const adminMenuItems = (
            <>
                <button
                    className={`db-menu-button admin-only ${activeSection === "users" ? "active" : ""}`}
                    onClick={() => setActiveSection("users")}
                >
                    Users
                </button>
            </>
        );

        return (
            <div className="db-dashboard-menu">
                {commonMenuItems}
                {userData?.role === 'admin' && adminMenuItems}
            </div>
        );
    };

    return (
        <div className="db-dashboard-wrapper">
            <div className="db-dashboard-container">
                <div className="db-dashboard-header">
                    <div className="db-server-status-container">
                        <div className={`db-server-status ${serverStatus}`}>
                            <span className="db-status-indicator"></span>
                            Server
                        </div>
                    </div>
                    <h1 className="db-dashboard-title">
                        <img
                            src={logo}
                            alt="Logo"
                            className="db-dashboard-logo"
                        />
                        dashboard
                        {userData?.role === 'admin' && <span className="db-admin-badge">Admin</span>}
                    </h1>
                    <div className="db-dashboard-logout">
                        <div className="db-user-email">{userData?.email}</div>
                        <LogoutButton />
                    </div>
                </div>

                {renderMenu()}

                <div className="db-dashboard-content">
                    {renderActiveSection()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;