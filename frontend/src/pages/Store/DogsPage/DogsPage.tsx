import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DogCardGrid from '../../../storecomponents/DogCardGrid/DogCardGrid';
import { Dog } from '../../../storecomponents/DogCard/DogCard';
import './DogsPage.css';
import Header from '../../../storecomponents/Header/Header';
import { useCurrency } from '../../../context/CurrencyContext';
import Footer from '../../../storecomponents/Footer/Footer';

interface ApiDog {
    id: string;
    sku: string;
    breed: { id: string; name: string };
    gender: 'Male' | 'Female';
    ageInMonths: number;
    size: 'Small' | 'Medium' | 'Large';
    color: string;
    price: number;
    vaccinated: boolean;
    dewormed: boolean;
    microchip: boolean;
}

interface ApiResponse {
    data: ApiDog[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

interface BreedImage {
    id: string;
    url: string;
    altText: string;
    displayOrder: number;
    breed: { id: string; name: string };
}

interface Breed {
    id: string;
    name: string;
}

const DogsPage: React.FC = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [breedImages, setBreedImages] = useState<Map<string, string[]>>(new Map());
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const { currency, convertPrice, formatPrice } = useCurrency();
    const navigate = useNavigate();

    const dogColors = [
        'Red', 'Apricot', 'Black', 'White', 'Cream', 'Fawn', 'Brown',
        'Chocolate', 'Tan', 'Golden', 'Gray', 'Silver', 'Blue', 'Brindle',
        'Black & White', 'Black & Tan', 'Brown & White', 'Tricolor', 'Merle'
    ];
    const dogSizes = ['Small', 'Medium', 'Large'];

    const colorHexMap: Record<string, string> = {
        Red: '#FF5252',
        Apricot: '#FFDAB9',
        Black: '#000000',
        White: '#FFFFFF',
        Cream: '#FFFDD0',
        Fawn: '#E5AA70',
        Brown: '#964B00',
        Chocolate: '#D2691E',
        Tan: '#D2B48C',
        Golden: '#FFD700',
        Gray: '#808080',
        Silver: '#C0C0C0',
        Blue: '#0000FF',
        Brindle: '#8B4513',
        'Black & White': '#000000',
        'Black & Tan': '#000000',
        'Brown & White': '#964B00',
        Tricolor: '#000000',
        Merle: '#888888'
    };

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const currentBreed = searchParams.get('breedId') || '';
    const currentGender = searchParams.get('gender') || '';
    const currentMin = searchParams.get('minPrice') || '';
    const currentMax = searchParams.get('maxPrice') || '';
    const currentColor = searchParams.get('color') || '';
    const currentSize = searchParams.get('size') || '';

    const [showAllColors, setShowAllColors] = useState(false);
    const VISIBLE_COLOR_COUNT = 8;
    const visibleColors = showAllColors
        ? dogColors
        : dogColors.slice(0, VISIBLE_COLOR_COUNT);

    const [showAllSizes, setShowAllSizes] = useState(false);
    const VISIBLE_SIZE_COUNT = 3;
    const visibleSizes = showAllSizes
        ? dogSizes
        : dogSizes.slice(0, VISIBLE_SIZE_COUNT);

    const updateFilters = (name: string, value: string) => {
        const p = new URLSearchParams(searchParams);
        if (value) p.set(name, value);
        else p.delete(name);
        if (name !== 'page') p.set('page', '1');
        setSearchParams(p);
    };

    const handleColorSelect = (col: string) => {
        const p = new URLSearchParams(searchParams);
        if (currentColor === col) p.delete('color');
        else p.set('color', col);
        p.set('page', '1');
        setSearchParams(p);
    };

    const handleSizeSelect = (sz: string) => {
        const p = new URLSearchParams(searchParams);
        if (currentSize === sz) p.delete('size');
        else p.set('size', sz);
        p.set('page', '1');
        setSearchParams(p);
    };

    const resetFilters = () => navigate('/dogs');
    const changePage = (pg: number) => { updateFilters('page', pg.toString()); window.scrollTo(0, 0); };

    const getDotStyle = (col: string) => {
        if (col.includes(' & ')) {
            const [c1, c2] = col.split(' & ');
            const hex1 = colorHexMap[c1.trim()] || '#ccc';
            const hex2 = colorHexMap[c2.trim()] || '#ccc';
            return { background: `linear-gradient(to right, ${hex1} 50%, ${hex2} 50%)` };
        }
        return { backgroundColor: colorHexMap[col] || '#ccc' };
    };

    useEffect(() => {
        (async () => {
            const res = await fetch('http://localhost:3000/breed-image');
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const imgs: BreedImage[] = await res.json();
            const map = new Map<string, string[]>();
            imgs.forEach(i => {
                if (!map.has(i.breed.id)) map.set(i.breed.id, []);
                map.get(i.breed.id)!.push(i.url);
            });
            setBreedImages(map);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const res = await fetch('http://localhost:3000/breed');
            if (!res.ok) throw new Error(`Error ${res.status}`);
            setBreeds(await res.json());
        })();
    }, []);

    useEffect(() => {
        if (!breedImages.size) return;
        (async () => {
            setLoading(true);
            const p = new URLSearchParams();
            p.append('page', currentPage.toString());
            p.append('limit', '15');
            if (currentColor) p.set('color', currentColor);
            if (currentSize) p.set('size', currentSize);
            if (currentBreed) p.set('breedId', currentBreed);
            if (currentGender) p.set('gender', currentGender);
            if (currentMin) p.set('minPrice', currentMin);
            if (currentMax) p.set('maxPrice', currentMax);

            const res = await fetch(`http://localhost:3000/dog?${p.toString()}`);
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const api: ApiResponse = await res.json();
            setTotalPages(api.pagination.totalPages);

            setDogs(api.data.map(dog => {
                const m = dog.sku.match(/^([A-Z]{2})-(\d{4})$/);
                const sku = m ? `${m[1]}${parseInt(m[2], 10)}` : dog.sku.replace('-', '');
                const imgs = breedImages.get(dog.breed.id) || ['https://placehold.co/400x400?text=No+Image'];
                return {
                    id: dog.id, sku, breed: dog.breed.name,
                    color: dog.color, price: dog.price,
                    images: imgs, age: dog.ageInMonths, gender: dog.gender
                };
            }));
            setError(null);
            setLoading(false);
        })();
    }, [breedImages, searchParams.toString()]);

    return (
        <div className="dogs-page">
            <div className="page-header">
                <Header />
            </div>
            <div className="dogs-container">
                <aside className="dogs-filters">
                    <h2>Filter</h2>

                    <div className="filter-group">
                        <h3>Gender</h3>
                        <div className="radio-group">
                            {['', 'Male', 'Female'].map(g => (
                                <label key={g || 'all'}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={currentGender === g}
                                        onChange={() => updateFilters('gender', g)}
                                    />
                                    {g || 'All'}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Color</h3>
                        <div className="dogspage-color-options">
                            {visibleColors.map(col => (
                                <label key={col}
                                    className={
                                        'dogspage-color-label' +
                                        (currentColor === col ? ' dogspage-color-label--selected' : '')
                                    }
                                    onClick={() => handleColorSelect(col)}
                                >
                                    <span
                                        className="dogspage-color-dot"
                                        style={getDotStyle(col)}
                                    />
                                    {col}
                                </label>
                            ))}
                            {dogColors.length > VISIBLE_COLOR_COUNT && (
                                <button
                                    type="button"
                                    className="dogspage-show-more-btn"
                                    onClick={() => setShowAllColors(v => !v)}
                                >
                                    {showAllColors ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Price</h3>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder={`Min ${currency.symbol}`}
                                value={currentMin ? Math.round(convertPrice(currentMin)) : ''}
                                onChange={e => updateFilters(
                                    'minPrice',
                                    e.target.value
                                        ? Math.round(parseInt(e.target.value) / currency.rate).toString()
                                        : ''
                                )}
                            />
                            <input
                                type="number"
                                placeholder={`Max ${currency.symbol}`}
                                value={currentMax ? Math.round(convertPrice(currentMax)) : ''}
                                onChange={e => updateFilters(
                                    'maxPrice',
                                    e.target.value
                                        ? Math.round(parseInt(e.target.value) / currency.rate).toString()
                                        : ''
                                )}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Breed</h3>
                        <select
                            className='dogspage-breed-select'
                            value={currentBreed}
                            onChange={e => updateFilters('breedId', e.target.value)}
                        >
                            <option value="">All Breeds</option>
                            {breeds.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <h3>Size</h3>
                        <div className="dogspage-size-options">
                            {visibleSizes.map(sz => (
                                <label key={sz}
                                    className={
                                        'dogspage-size-label' +
                                        (currentSize === sz ? ' dogspage-size-label--selected' : '')
                                    }
                                    onClick={() => handleSizeSelect(sz)}
                                >
                                    {sz}
                                </label>
                            ))}
                            {dogSizes.length > VISIBLE_SIZE_COUNT && (
                                <button
                                    type="button"
                                    className="dogspage-show-more-size-btn"
                                    onClick={() => setShowAllSizes(v => !v)}
                                >
                                    {showAllSizes ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </div>
                    </div>

                    <button className="reset-filters-btn" onClick={resetFilters}>
                        Reset All Filters
                    </button>
                </aside>

                <section className="dogs-content">
                    <header className="dogs-header">
                        <h1>{currentSize || 'All'} Dogs</h1>
                        <div className="dogs-count">
                            {loading ? '...' : `${dogs.length} puppies found`}
                        </div>
                    </header>

                    {(currentMin || currentMax) && (
                        <div className="current-price-range">
                            Price range:&nbsp;
                            {currentMin && formatPrice(currentMin)}
                            {currentMin && currentMax && ' – '}
                            {currentMax && formatPrice(currentMax)}
                        </div>
                    )}

                    {loading ? (
                        <div className="dogs-loading">Loading puppies…</div>
                    ) : error ? (
                        <div className="dogs-error">{error}</div>
                    ) : dogs.length === 0 ? (
                        <div className="dogs-empty">No dogs found matching your filters</div>
                    ) : (
                        <DogCardGrid dogs={dogs} columns={3} />
                    )}

                    {totalPages > 1 && (
                        <div className="dogs-pagination">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-arrow"
                            >←</button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let p: number;
                                if (totalPages <= 5) p = i + 1;
                                else if (currentPage <= 3) p = i + 1;
                                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                                else p = currentPage - 2 + i;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => changePage(p)}
                                        className={p === currentPage ? 'active' : ''}
                                    >{p}</button>
                                );
                            })}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <>
                                    <span className="pagination-ellipsis">…</span>
                                    <button onClick={() => changePage(totalPages)}>
                                        {totalPages}
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-arrow"
                            >→</button>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default DogsPage;