import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchModal.css';
import { API_CONFIG } from '../../config/api.config';
import { useCurrency } from '../../context/CurrencyContext';

interface SearchResult {
    id: string;
    name: string;
    type: 'dog' | 'product' | 'article';
    image?: string;
    price?: number;
    breed?: string;
    category?: string;
    summary?: string;
    color?: string;
    gender?: string;
    size?: string;
    url: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
    anchorRef: React.RefObject<HTMLDivElement | null>;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, searchTerm, anchorRef }) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const resultsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    // Update position based on anchor element
    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isOpen, anchorRef]);

    // Search when searchTerm changes
    useEffect(() => {
        if (!isOpen || !searchTerm || searchTerm.trim().length < 2) {
            setResults([]);
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const query = encodeURIComponent(searchTerm.trim());
                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {} as HeadersInit;

                const dogsFetch = async () => {
                    try {
                        const originalQuery = searchTerm.trim();
                        const queryNoHyphen = originalQuery.replace(/-/g, ' ');
                        const queryNoSpaces = originalQuery.replace(/\s+/g, '-');

                        let params = new URLSearchParams();
                        params.append('query', originalQuery);
                        params.append('limit', '10');

                        let response = await fetch(`${API_CONFIG.baseUrl}/dog?${params.toString()}`, { headers });
                        let data = await response.json();
                        let dogData = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);

                        if (dogData.length === 0 && originalQuery.includes('-')) {
                            params = new URLSearchParams();
                            params.append('query', queryNoHyphen);
                            params.append('limit', '10');

                            response = await fetch(`${API_CONFIG.baseUrl}/dog?${params.toString()}`, { headers });
                            data = await response.json();
                            dogData = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
                        }

                        if (dogData.length === 0 && originalQuery.includes(' ')) {
                            params = new URLSearchParams();
                            params.append('query', queryNoSpaces);
                            params.append('limit', '10');

                            response = await fetch(`${API_CONFIG.baseUrl}/dog?${params.toString()}`, { headers });
                            data = await response.json();
                            dogData = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
                        }

                        return dogData.map((dog: any) => ({
                            id: dog.id,
                            name: dog.breed?.name || (typeof dog.breed === 'string' ? dog.breed : 'Unknown Breed'),
                            type: 'dog',
                            image: dog.images?.[0]?.url || '',
                            breed: dog.breed?.name || (typeof dog.breed === 'string' ? dog.breed : 'Unknown Breed'),
                            price: dog.price,
                            color: dog.color,
                            gender: dog.gender,
                            size: dog.size,
                            url: `/dogs/${dog.id}`
                        }));
                    } catch (err) {
                        console.error('Error fetching dogs:', err);
                        return [];
                    }
                };

                const productsFetch = async () => {
                    try {
                        let params = new URLSearchParams();
                        params.append('query', query);
                        params.append('limit', '5');

                        const response = await fetch(`${API_CONFIG.baseUrl}/store-item?${params.toString()}`, {
                            headers
                        });

                        if (!response.ok) return [];

                        const data = await response.json();
                        let productsData = [];
                        if (Array.isArray(data)) {
                            productsData = data;
                        } else if (data.data && Array.isArray(data.data)) {
                            productsData = data.data;
                        } else if (data.items && Array.isArray(data.items)) {
                            productsData = data.items;
                        }

                        return productsData.map((product: any) => ({
                            id: product.id,
                            name: product.name,
                            type: 'product',
                            image: product.images?.[0]?.url,
                            category: product.category?.name || 'Product',
                            price: product.price,
                            url: `/products/${product.id}`
                        }));
                    } catch (err) {
                        console.error('Error fetching products:', err);
                        return [];
                    }
                };

                const articlesFetch = async () => {
                    try {
                        let params = new URLSearchParams();
                        params.append('query', query);
                        params.append('limit', '5');

                        const response = await fetch(`${API_CONFIG.baseUrl}/pet-knowledge?${params.toString()}`, {
                            headers
                        });

                        if (!response.ok) return [];

                        const data = await response.json();
                        const articlesData = data.data && Array.isArray(data.data)
                            ? data.data
                            : (Array.isArray(data) ? data : []);

                        return articlesData.map((article: any) => ({
                            id: article.id,
                            name: article.title,
                            type: 'article',
                            image: article.imageUrl,
                            category: article.category,
                            summary: article.summary,
                            url: `/articles/${article.id}`
                        }));
                    } catch (err) {
                        console.error('Error fetching articles:', err);
                        return [];
                    }
                };

                const [dogs, products, articles] = await Promise.all([
                    dogsFetch(),
                    productsFetch(),
                    articlesFetch()
                ]);

                const dogsFiltered = dogs.filter((dog: any) =>
                    dog.name.toLowerCase().includes(query.toLowerCase()) ||
                    (dog.breed && dog.breed.toLowerCase().includes(query.toLowerCase()))
                );

                const productsFiltered = products.filter((product: any) =>
                    product.name.toLowerCase().includes(query.toLowerCase())
                );

                const articlesFiltered = articles.filter((article: any) =>
                    article.name.toLowerCase().includes(query.toLowerCase()) ||
                    (article.summary && article.summary.toLowerCase().includes(query.toLowerCase()))
                );

                const combinedResults = [...dogsFiltered, ...productsFiltered, ...articlesFiltered].slice(0, 10);
                setResults(combinedResults);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchSearchResults();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev < results.length - 1 ? prev + 1 : prev
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && results[selectedIndex]) {
                        navigate(results[selectedIndex].url);
                        onClose();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, navigate, onClose]);

    useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [selectedIndex]);

    if (!isOpen) return null;

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'dog':
                return '🐕';
            case 'product':
                return '📦';
            case 'article':
                return '📄';
            default:
                return '🔍';
        }
    };

    const getResultTypeLabel = (result: SearchResult) => {
        switch (result.type) {
            case 'dog':
                return `Dog: ${result.breed || 'Unknown'}`;
            case 'product':
                return `Product: ${result.category || 'Miscellaneous'}`;
            case 'article':
                return `Article: ${result.category || 'Pet Knowledge'}`;
            default:
                return 'Result';
        }
    };

    return (
        <div
            className="search-results-dropdown"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
                display: isOpen ? 'block' : 'none'
            }}
        >
            <div className="search-results-content" onClick={e => e.stopPropagation()} ref={resultsRef}>
                {loading ? (
                    <div className="search-loading">
                        <div className="search-spinner"></div>
                        <span>Searching...</span>
                    </div>
                ) : results.length > 0 ? (
                    <ul className="search-results-list">
                        {results.map((result, index) => (
                            <li
                                key={`${result.type}-${result.id}`}
                                className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                                data-index={index}
                                onClick={() => {
                                    navigate(result.url);
                                    onClose();
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className="search-result-image">
                                    {result.image ? (
                                        <img src={result.image} alt={result.name} />
                                    ) : (
                                        <span className="search-result-icon">{getResultIcon(result.type)}</span>
                                    )}
                                </div>
                                <div className="search-result-info">
                                    <h4>{result.name}</h4>
                                    <div className="search-result-meta">
                                        <span className="search-result-type">
                                            {getResultTypeLabel(result)}
                                        </span>
                                        {result.price && (
                                            <span className="search-result-price">{formatPrice(result.price)}</span>
                                        )}
                                        {result.summary && (
                                            <p className="search-result-summary">{result.summary}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="search-result-arrow">→</div>
                            </li>
                        ))}
                    </ul>
                ) : searchTerm.trim().length >= 2 ? (
                    <div className="search-no-results">
                        <span className="search-no-results-icon">🔍</span>
                        <p>No results found for "{searchTerm}"</p>
                        <p className="search-suggestion">Try adjusting your search or browse our categories</p>
                    </div>
                ) : (
                    <div className="search-instructions">
                        <p>Type at least 2 characters to search</p>
                        <div className="search-popular">
                            <h4>Popular searches:</h4>
                            <div className="search-tags">
                                <button onClick={() => navigate('/dogs?size=small')}>Small dogs</button>
                                <button onClick={() => navigate('/products?category=food')}>Dog food</button>
                                <button onClick={() => navigate('/pet-knowledge')}>Pet articles</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="search-footer">
                    <div className="search-keyboard-shortcuts">
                        <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
                        <span><kbd>Enter</kbd> to select</span>
                        <span><kbd>Esc</kbd> to close</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;