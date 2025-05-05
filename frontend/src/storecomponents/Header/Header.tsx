import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

type Currency = {
    code: string;
    name: string;
    flag: string;
};

const currencies: Currency[] = [
    { code: 'VND', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'BRL', name: 'Brasil', flag: '🇧🇷' },
    { code: 'USD', name: 'USA', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' }
];

const Header: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
    };

    const handleCurrencySelect = (currency: Currency) => {
        setSelectedCurrency(currency);
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
                                <Link to="/category/dogs">Dogs</Link>
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
                            <span className="currency-flag">{selectedCurrency.flag}</span>
                            <span className="currency-code">{selectedCurrency.code}</span>
                            <span className="currency-arrow">▼</span>
                        </button>

                        {currencyDropdownOpen && (
                            <div className="currency-dropdown-menu">
                                {currencies.map(currency => (
                                    <button
                                        key={currency.code}
                                        className="currency-option"
                                        onClick={() => handleCurrencySelect(currency)}
                                    >
                                        <span className="currency-flag">{currency.flag}</span>
                                        <span className="currency-code">{currency.code}</span>
                                        <span className="currency-name">{currency.name}</span>
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