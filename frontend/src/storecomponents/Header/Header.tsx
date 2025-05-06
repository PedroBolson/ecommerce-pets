import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useCurrency, currencies } from '../../context/CurrencyContext';

const Header: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

    const { currency, setCurrency } = useCurrency();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleCurrencySelect = (newCurrency: typeof currency) => {
        setCurrency(newCurrency);
        setCurrencyDropdownOpen(false);
    };

    const toggleCurrencyDropdown = () => {
        setCurrencyDropdownOpen(!currencyDropdownOpen);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <img src="/Monito-logo-complete.svg" alt="Monito - Pets for Best" />
                    </Link>
                </div>

                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li className="dropdown">
                            <Link to="/">Category</Link>
                            <div className="dropdown-menu">
                                <Link to="/dogs">Dogs</Link>
                                <Link to="/category/products">Products</Link>
                            </div>
                        </li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>

                <div className="header-actions">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search something here!"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" aria-label="Search">
                            <i className="search-icon">🔍</i>
                        </button>
                    </form>

                    <button className="join-button">Join the community</button>

                    <div className="currency-selector">
                        <button
                            className="currency-button"
                            onClick={toggleCurrencyDropdown}
                            aria-expanded={currencyDropdownOpen}
                        >
                            <span className="currency-flag">{currency.flag}</span>
                            <span className="currency-code">{currency.code}</span>
                            <span className="currency-arrow">▼</span>
                        </button>

                        {currencyDropdownOpen && (
                            <div className="currency-dropdown-menu">
                                {currencies.map(c => (
                                    <button
                                        key={c.code}
                                        className="currency-option"
                                        onClick={() => handleCurrencySelect(c)}
                                    >
                                        <span className="currency-flag">{c.flag}</span>
                                        <span className="currency-code">{c.code}</span>
                                        <span className="currency-name">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;