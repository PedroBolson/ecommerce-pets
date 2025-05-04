import React, { useState, useEffect } from 'react';
import './ManagePetKnowledge.css';

interface Breed {
    id: string;
    name: string;
}

interface PetKnowledge {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl?: string;
    category: string;
    createdAt: Date;
    isActive: boolean;
    breed?: Breed;
}

const ManagePetKnowledge: React.FC = () => {
    const [articles, setArticles] = useState<PetKnowledge[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<PetKnowledge | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
    const [categories] = useState<string[]>(['General', 'Health', 'Training', 'Nutrition', 'Behavior', 'Grooming']);
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeArticlesCount, setActiveArticlesCount] = useState(0);
    const MAX_ACTIVE_ARTICLES = 3;

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        imageUrl: '',
        category: 'General',
        breedId: '',
        isActive: false
    });

    useEffect(() => {
        fetchArticles();
        fetchBreeds();
    }, [currentPage, filterCategory]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let url = `http://localhost:3000/pet-knowledge?page=${currentPage}&limit=6`;

            if (filterCategory) {
                url += `&category=${encodeURIComponent(filterCategory)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading articles: ${response.status}`);
            }

            const data = await response.json();

            let articlesData: PetKnowledge[] = [];

            if (Array.isArray(data)) {
                articlesData = data;
                setTotalPages(1);
            } else if (data.data && Array.isArray(data.data)) {
                articlesData = data.data;
                setTotalPages(data.pagination?.totalPages || 1);
            }

            const activeCount = articlesData.filter(article => article.isActive).length;
            setActiveArticlesCount(activeCount);
            setArticles(articlesData);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBreeds = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/breed', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading breeds: ${response.status}`);
            }

            const data = await response.json();
            setBreeds(Array.isArray(data) ? data : (data.data || []));
        } catch (err) {
            console.error("Error fetching breeds:", err);
        }
    };

    const handleCreateNew = () => {
        setFormMode('create');
        setSelectedArticle(null);
        setFormData({
            title: '',
            summary: '',
            content: '',
            imageUrl: '',
            category: 'General',
            breedId: '',
            isActive: false
        });
    };

    const handleEdit = (article: PetKnowledge) => {
        setFormMode('edit');
        setSelectedArticle(article);

        const category = categories.includes(article.category) ? article.category : 'General';

        setFormData({
            title: article.title || '',
            summary: article.summary || '',
            content: article.content || '',
            imageUrl: article.imageUrl || '',
            category: category,
            breedId: article.breed?.id || '',
            isActive: article.isActive
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this article? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:3000/pet-knowledge/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting: ${response.status}`);
            }

            setError(null);
            alert('Article successfully deleted');

            fetchArticles();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting article');
            console.error(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;

            if (name === 'isActive' && checked && activeArticlesCount >= MAX_ACTIVE_ARTICLES && (!selectedArticle || !selectedArticle.isActive)) {
                alert(`You can only have ${MAX_ACTIVE_ARTICLES} active articles for homepage highlights. Please deactivate another article first.`);
                return;
            }

            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.summary || !formData.content) {
            setError('Please fill in all required fields.');
            return;
        }

        if (formData.isActive &&
            activeArticlesCount >= MAX_ACTIVE_ARTICLES &&
            (!selectedArticle || !selectedArticle.isActive)) {
            setError(`You can only have ${MAX_ACTIVE_ARTICLES} active articles for homepage highlights.`);
            return;
        }

        const token = localStorage.getItem('token');

        const { breedId, ...baseData } = formData;
        const dataToSend = {
            ...baseData,
            ...(breedId ? { breedId } : {})
        };

        try {
            if (formMode === 'create') {
                const response = await fetch('http://localhost:3000/pet-knowledge', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dataToSend)
                });

                if (!response.ok) {
                    throw new Error(`Error creating: ${response.status}`);
                }
            } else if (formMode === 'edit' && selectedArticle) {
                const response = await fetch(`http://localhost:3000/pet-knowledge/${selectedArticle.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dataToSend)
                });

                if (!response.ok) {
                    throw new Error(`Error updating: ${response.status}`);
                }
            }

            setFormMode(null);
            setSelectedArticle(null);
            setError(null);
            fetchArticles();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving article');
            console.error(err);
        }
    };

    const handleToggleActive = async (article: PetKnowledge) => {
        if (!article.isActive && activeArticlesCount >= MAX_ACTIVE_ARTICLES) {
            alert(`You can only have ${MAX_ACTIVE_ARTICLES} active articles for homepage highlights. Please deactivate another article first.`);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/pet-knowledge/${article.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    isActive: !article.isActive
                })
            });

            if (!response.ok) {
                throw new Error(`Error updating: ${response.status}`);
            }

            fetchArticles();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating article');
            console.error(err);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <div className="manage-pet-knowledge">
            <div className="section-header">
                <h2>Manage Pet Knowledge Articles</h2>
                <div className="header-actions">
                    <div className="active-count">
                        <span className={activeArticlesCount >= MAX_ACTIVE_ARTICLES ? 'count-full' : ''}>
                            Active Articles: {activeArticlesCount}/{MAX_ACTIVE_ARTICLES}
                        </span>
                        <small>Active articles are featured on the homepage</small>
                    </div>
                    <div className="filter-controls">
                        <span className="filter-label">Category:</span>
                        <select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="category-filter"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <button className="create-button" onClick={handleCreateNew}>New Article</button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {formMode && (
                <div className="form-container">
                    <h3>{formMode === 'create' ? 'Create New Article' : 'Edit Article'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Title: <span className="required">*</span></label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category">Category: <span className="required">*</span></label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="breedId">Breed: (Optional)</label>
                                <select
                                    id="breedId"
                                    name="breedId"
                                    value={formData.breedId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Not breed specific</option>
                                    {breeds.map(breed => (
                                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group checkbox-group">
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    disabled={!formData.isActive && activeArticlesCount >= MAX_ACTIVE_ARTICLES && (!selectedArticle || !selectedArticle.isActive)}
                                />
                                <label htmlFor="isActive">
                                    Featured on Homepage
                                    <span className="helper-text">
                                        (Limited to {MAX_ACTIVE_ARTICLES} articles)
                                    </span>
                                </label>
                            </div>
                            {activeArticlesCount >= MAX_ACTIVE_ARTICLES && !formData.isActive && (
                                <p className="limit-warning">
                                    Maximum active articles limit reached ({MAX_ACTIVE_ARTICLES}).
                                    You must deactivate an article before activating a new one.
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="summary">Summary: <span className="required">*</span></label>
                            <textarea
                                id="summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                rows={2}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Content: <span className="required">*</span></label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                rows={10}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageUrl">Image URL: (Optional)</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-button">
                                {formMode === 'create' ? 'Create' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormMode(null);
                                    setSelectedArticle(null);
                                    setError(null);
                                }}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!formMode && (
                <div className="articles-list">
                    {loading ? (
                        <div className="loading">Loading articles...</div>
                    ) : articles.length === 0 ? (
                        <p className="no-items">No articles available.</p>
                    ) : (
                        <>
                            <div className="article-cards">
                                {articles.map(article => (
                                    <div key={article.id} className={`article-card ${article.isActive ? 'active-article' : 'inactive-article'}`}>
                                        {article.isActive && (
                                            <div className="active-badge">
                                                Featured
                                            </div>
                                        )}
                                        <div className="article-image">
                                            {article.imageUrl ? (
                                                <img src={article.imageUrl} alt={article.title} />
                                            ) : (
                                                <div className="no-image">No Image</div>
                                            )}
                                        </div>
                                        <div className="article-content">
                                            <h3>{truncateText(article.title, 50)}</h3>
                                            <div className="article-meta">
                                                <span className="category">{article.category}</span>
                                                {article.breed && (
                                                    <span className="breed">Breed: {article.breed.name}</span>
                                                )}
                                                <span className="date">{formatDate(article.createdAt)}</span>
                                                <span className={`status-indicator ${article.isActive ? 'status-active' : 'status-inactive'}`}>
                                                    {article.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="summary">{truncateText(article.summary, 120)}</p>
                                            <div className="article-actions">
                                                <button
                                                    onClick={() => handleEdit(article)}
                                                    className="edit-button"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(article)}
                                                    className={`feature-button ${article.isActive ? 'featured' : ''}`}
                                                    disabled={!article.isActive && activeArticlesCount >= MAX_ACTIVE_ARTICLES}
                                                    title={!article.isActive && activeArticlesCount >= MAX_ACTIVE_ARTICLES ?
                                                        `Limited to ${MAX_ACTIVE_ARTICLES} active articles` : ''}
                                                >
                                                    {article.isActive ? 'Unfeature' : 'Feature'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManagePetKnowledge;