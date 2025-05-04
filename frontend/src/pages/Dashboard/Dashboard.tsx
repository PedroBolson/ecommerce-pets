import React, { useState } from "react";
import "./Dashboard.css";
import logo from "/Monito-logo.svg";
import "../../index.css";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import ManageBreeds from "../../components/ManageBreeds/ManageBreeds";
import ManageDogs from "../../components/ManageDogs/ManageDogs";
import ManageItemCategories from "../../components/ManageItemCategories/ManageItemCategories";
import ManageItems from "../../components/ManageItems/ManageItems";
import ManagePetKnowledge from "../../components/ManagePetKnowledge/ManagePetKnowledge";
// import ManageContacts from "../../components/ManageContacts/ManageContacts";
// import ManageAdoptionPhotos from "../../components/ManageAdoptionPhotos/ManageAdoptionPhotos";
// import ManageUsers from "../../components/ManageUsers/ManageUsers";

const Dashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const renderActiveSection = () => {
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
            // case "contacts":
            //     return <ManageContacts />;
            // case "adoption-photos":
            //     return <ManageAdoptionPhotos />;
            // case "users":
            //     return <ManageUsers />;
            default:
                return (
                    <div className="dashboard-welcome">
                        <h2>Welcome to the Admin Panel</h2>
                        <p>Select an option above to manage website resources.</p>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    <img
                        src={logo}
                        alt="Logo"
                        className="dashboard-logo"
                    />
                    dashboard
                </h1>
                <div className="dashboard-logout">
                    <LogoutButton />
                </div>
            </div>

            <div className="dashboard-menu">
                <button
                    className={`menu-button ${activeSection === "breeds" ? "active" : ""}`}
                    onClick={() => setActiveSection("breeds")}
                >
                    Breeds
                </button>
                <button
                    className={`menu-button ${activeSection === "dogs" ? "active" : ""}`}
                    onClick={() => setActiveSection("dogs")}
                >
                    Dogs
                </button>
                <button
                    className={`menu-button ${activeSection === "item-categories" ? "active" : ""}`}
                    onClick={() => setActiveSection("item-categories")}
                >
                    Item Categories
                </button>
                <button
                    className={`menu-button ${activeSection === "items" ? "active" : ""}`}
                    onClick={() => setActiveSection("items")}
                >
                    Items
                </button>
                <button
                    className={`menu-button ${activeSection === "pet-knowledge" ? "active" : ""}`}
                    onClick={() => setActiveSection("pet-knowledge")}
                >
                    Pet Knowledge
                </button>
                <button
                    className={`menu-button ${activeSection === "contacts" ? "active" : ""}`}
                    onClick={() => setActiveSection("contacts")}
                >
                    Contacts
                </button>
                <button
                    className={`menu-button ${activeSection === "adoption-photos" ? "active" : ""}`}
                    onClick={() => setActiveSection("adoption-photos")}
                >
                    Adoption Photos
                </button>
                <button
                    className={`menu-button ${activeSection === "users" ? "active" : ""}`}
                    onClick={() => setActiveSection("users")}
                >
                    Users
                </button>
            </div>

            <div className="dashboard-content">
                {renderActiveSection()}
            </div>
        </div>
    );
}

export default Dashboard;