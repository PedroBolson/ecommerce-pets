import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ArticlesPage.css';
import Header from '../../../storecomponents/Header/Header';
import Footer from '../../../storecomponents/Footer/Footer';
import ArticleCardGrid from '../../../storecomponents/ArticleCardGrid/ArticleCardGrid';
import BannerShop from '../../../storecomponents/BannerShop/BannerShop';
import { API_CONFIG } from '../../../config/api.config';

interface Article {
    id: string;
    title: string;
    summary: string;
    imageUrl?: string;
    category?: string;
    createdAt?: string;
    tags?: string[];
    readTime?: number;
}

interface ApiResponse {
    data: Article[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

const ArticlesPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<string[]>(['General', 'Health', 'Training', 'Nutrition', 'Behavior', 'Grooming']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get current filter values from URL
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const currentCategory = searchParams.get('category') || '';

    const getBannerPaths = () => {
        const paths = [
            { name: 'Home', url: '/' },
            { name: 'Articles', url: '/articles' }
        ];

        if (currentCategory) {
            paths.push({
                name: currentCategory,
                url: `/articles?category=${encodeURIComponent(currentCategory)}`
            });
        }

        return paths;
    };

    // Update category filter
    const handleCategoryChange = (category: string) => {
        const p = new URLSearchParams(searchParams);
        if (category) {
            p.set('category', category);
        } else {
            p.delete('category');
        }
        p.set('page', '1');
        setSearchParams(p);
    };

    // Reset filters
    const resetFilters = () => navigate('/articles');

    // Change page
    const changePage = (pg: number) => {
        const p = new URLSearchParams(searchParams);
        p.set('page', pg.toString());
        setSearchParams(p);
        window.scrollTo(0, 0);
    };

    // Fetch categories dynamically from the API
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_CONFIG.baseUrl}/pet-knowledge/categories`);
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    setCategories(data);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        })();
    }, []);

    // Fetch articles based on category filter
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const p = new URLSearchParams();
                p.append('page', currentPage.toString());
                p.append('limit', '9');

                if (currentCategory) {
                    p.set('category', currentCategory);
                }

                const res = await fetch(`${API_CONFIG.baseUrl}/pet-knowledge?${p.toString()}`);
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const api: ApiResponse = await res.json();

                setTotalPages(api.pagination?.totalPages || 1);
                setArticles(Array.isArray(api.data) ? api.data : []);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch articles');
                setArticles([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [searchParams.toString()]);

    return (
        <div className="articles-page">
            <Header />
            <BannerShop paths={getBannerPaths()} />

            <div className="articles-container">
                <div className="articles-sidebar">
                    <div className="articles-sidebar-section">
                        <h3 className="articles-sidebar-title">Categories</h3>
                        <ul className="articles-categories-list">
                            <li
                                className={`articles-category-item ${!currentCategory ? 'active' : ''}`}
                                onClick={() => handleCategoryChange('')}
                            >
                                All Categories
                            </li>
                            {categories.map(category => (
                                <li
                                    key={category}
                                    className={`articles-category-item ${currentCategory === category ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="articles-content">
                    <div className="articles-header">
                        <h1 className="articles-title">
                            {currentCategory ? `${currentCategory} Articles` : 'All Articles'}
                        </h1>

                        {currentCategory && (
                            <button
                                onClick={resetFilters}
                                className="articles-reset-btn"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="articles-loading">Loading articles...</div>
                    ) : error ? (
                        <div className="articles-error">{error}</div>
                    ) : articles.length === 0 ? (
                        <div className="articles-empty">
                            No articles found
                            {currentCategory ? ` in category "${currentCategory}"` : ''}
                        </div>
                    ) : (
                        <ArticleCardGrid
                            customArticles={articles}
                            columns={3}
                            count={articles.length}
                            title=""
                            showTitle={false}
                        />
                    )}

                    {totalPages > 1 && (
                        <div className="articles-pagination">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="articles-pagination-btn articles-pagination-prev"
                            >
                                ← Previous
                            </button>

                            <span className="articles-pagination-info">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="articles-pagination-btn articles-pagination-next"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ArticlesPage;