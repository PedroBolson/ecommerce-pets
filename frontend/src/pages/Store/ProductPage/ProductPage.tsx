import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCardGrid from '../../../storecomponents/ProductCardGrid/ProductCardGrid';
import { Product } from '../../../storecomponents/ProductCard/ProductCard';
import './ProductPage.css';
import Header from '../../../storecomponents/Header/Header';
import { useCurrency } from '../../../context/CurrencyContext';
import Footer from '../../../storecomponents/Footer/Footer';
import { API_CONFIG } from '../../../config/api.config';

interface ApiProduct {
    id: string;
    sku: string;
    name: string;
    description?: string;
    price: string;
    stock: number;
    size: number;
    category: {
        id: string;
        name: string;
        description?: string;
    };
    images?: {
        id: string;
        url: string;
        altText?: string;
        displayOrder?: number;
    }[];
}

interface ApiResponse {
    data: ApiProduct[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

interface Category {
    id: string;
    name: string;
    description?: string;
}

const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const { currency, convertPrice, formatPrice } = useCurrency();
    const navigate = useNavigate();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const currentCategory = searchParams.get('categoryId') || '';
    const currentMin = searchParams.get('minPrice') || '';
    const currentMax = searchParams.get('maxPrice') || '';
    const currentInStock = searchParams.get('inStock') || '';

    const updateFilters = (name: string, value: string) => {
        const p = new URLSearchParams(searchParams);
        if (value) p.set(name, value);
        else p.delete(name);
        if (name !== 'page') p.set('page', '1');
        setSearchParams(p);
    };

    const handleInStockSelect = (value: string) => {
        const p = new URLSearchParams(searchParams);
        if (currentInStock === value) p.delete('inStock');
        else p.set('inStock', value);
        p.set('page', '1');
        setSearchParams(p);
    };

    const resetFilters = () => navigate('/products');
    const changePage = (pg: number) => { updateFilters('page', pg.toString()); window.scrollTo(0, 0); };

    const getFilterHeading = () => {
        let heading = '';

        if (currentCategory) {
            const categoryName = categories.find(c => c.id === currentCategory)?.name || '';
            if (categoryName) {
                heading += `${categoryName} `;
            }
        }

        if (currentInStock === 'true') {
            heading += 'In Stock ';
        }

        if (!heading) {
            heading = 'All ';
        }

        heading += 'Products';

        return heading;
    };

    // Fetch categories
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_CONFIG.baseUrl}/store-category`);
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        })();
    }, []);

    // Fetch products with filters
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const p = new URLSearchParams();
                p.append('page', currentPage.toString());
                p.append('limit', '12');

                if (currentCategory) p.set('categoryId', currentCategory);
                if (currentInStock === 'true') p.set('inStock', 'true');
                if (currentMin) p.set('minPrice', currentMin);
                if (currentMax) p.set('maxPrice', currentMax);

                const res = await fetch(`${API_CONFIG.baseUrl}/store-item?${p.toString()}`);
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const api: ApiResponse = await res.json();

                setTotalPages(api.pagination.totalPages);

                const adaptedProducts: Product[] = api.data.map(item => ({
                    id: item.id,
                    sku: item.sku,
                    name: item.name,
                    price: parseFloat(item.price),
                    inStock: item.stock > 0,
                    size: item.size || 0,
                    images: item.images || [],
                    category: {
                        id: item.category.id,
                        name: item.category.name
                    }
                }));

                setProducts(adaptedProducts);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        })();
    }, [searchParams.toString()]);

    return (
        <div className="product-page">
            <div className="product-page-header">
                <Header />
            </div>
            <div className="product-container">
                <aside className="product-filters">
                    <h2>Filter</h2>

                    <div className="product-filter-group">
                        <h3>Category</h3>
                        <select
                            className='product-category-select'
                            value={currentCategory}
                            onChange={e => updateFilters('categoryId', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="product-filter-group">
                        <h3>Price</h3>
                        <div className="product-price-inputs">
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

                    <div className="product-filter-group">
                        <h3>Availability</h3>
                        <div className="product-radio-group">
                            {[
                                { value: '', label: 'All' },
                                { value: 'true', label: 'In Stock Only' }
                            ].map(option => (
                                <label key={option.value || 'all'} className="product-radio-label">
                                    <input
                                        type="radio"
                                        name="inStock"
                                        value={option.value}
                                        checked={currentInStock === option.value}
                                        onChange={() => handleInStockSelect(option.value)}
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button className="product-reset-filters-btn" onClick={resetFilters}>
                        Reset All Filters
                    </button>
                </aside>

                <section className="product-content">
                    <header className="product-header">
                        <h1>{getFilterHeading()}</h1>
                        <div className="product-info-bar">
                            <div className="product-count">
                                {loading ? '...' : `${products.length} products found`}
                            </div>
                            {(currentMin || currentMax) && (
                                <div className="product-current-price-range">
                                    Price range:&nbsp;
                                    {currentMin && formatPrice(currentMin)}
                                    {currentMin && currentMax && ' – '}
                                    {currentMax && formatPrice(currentMax)}
                                </div>
                            )}
                        </div>
                    </header>

                    {loading ? (
                        <div className="product-loading">Loading products…</div>
                    ) : error ? (
                        <div className="product-error">{error}</div>
                    ) : products.length === 0 ? (
                        <div className="product-empty">No products found matching your filters</div>
                    ) : (
                        <ProductCardGrid products={products} columns={3} />
                    )}

                    {totalPages > 1 && (
                        <div className="product-pagination">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="product-pagination-arrow"
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
                                    <span className="product-pagination-ellipsis">…</span>
                                    <button onClick={() => changePage(totalPages)}>
                                        {totalPages}
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="product-pagination-arrow"
                            >→</button>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;