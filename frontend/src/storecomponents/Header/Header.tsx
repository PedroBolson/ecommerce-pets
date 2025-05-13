import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import ContactModal from '../ContactModal/ContactModal';
import SearchModal from '../SearchModal/SearchModal';
import { useCurrency, currencies } from '../../context/CurrencyContext';

const Header: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const searchFormRef = useRef<HTMLDivElement>(null);

    const { currency, setCurrency } = useCurrency();

    // Close modals when route changes
    useEffect(() => {
        return () => {
            setIsSearchModalOpen(false);
            setContactModalOpen(false);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim().length > 0) {
            setIsSearchModalOpen(true);
        }
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Automatically open the search modal when typing
        if (value.trim().length >= 2) {
            setIsSearchModalOpen(true);
        } else if (value.trim().length === 0) {
            setIsSearchModalOpen(false);
        }
    };

    const closeSearchModal = () => {
        setIsSearchModalOpen(false);
    };

    const handleSearchFocus = () => {
        if (searchTerm.trim().length >= 2) {
            setIsSearchModalOpen(true);
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (
            searchFormRef.current &&
            !searchFormRef.current.contains(e.target as Node) &&
            isSearchModalOpen
        ) {
            setIsSearchModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchModalOpen]);

    const handleCurrencySelect = (newCurrency: typeof currency) => {
        setCurrency(newCurrency);
        setCurrencyDropdownOpen(false);
    };

    const toggleCurrencyDropdown = () => {
        setCurrencyDropdownOpen(!currencyDropdownOpen);
    };

    const openContactModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setContactModalOpen(true);
    };

    const closeContactModal = () => {
        setContactModalOpen(false);
    };

    const scrollToNewsletter = () => {
        const newsletterInput = document.querySelector('.footer-subscribe-input');

        if (newsletterInput) {
            newsletterInput.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            setTimeout(() => {
                (newsletterInput as HTMLElement).focus();
            }, 1000);
        }
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
                            <Link to="">Category</Link>
                            <div className="dropdown-menu">
                                <Link to="/dogs">Dogs</Link>
                                <Link to="/products">Products</Link>
                            </div>
                        </li>
                        <li><Link to="">About</Link></li>
                        <li><a className='link-to-modals' onClick={openContactModal}>Contact</a></li>
                    </ul>
                </nav>

                <div className="header-actions">
                    <div className="search-container" ref={searchFormRef}>
                        <form className="search-form" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search something here!"
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                                onFocus={handleSearchFocus}
                            />
                            <button type="submit" aria-label="Search">
                                <i className="search-icon">🔍</i>
                            </button>
                        </form>
                        <SearchModal
                            isOpen={isSearchModalOpen}
                            onClose={closeSearchModal}
                            searchTerm={searchTerm}
                            anchorRef={searchFormRef}
                        />
                    </div>

                    <button
                        className="join-button"
                        onClick={scrollToNewsletter}
                    >
                        Join the community
                    </button>

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

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={closeContactModal}
            />
        </header>
    );
};

export default Header;