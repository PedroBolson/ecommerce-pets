import React, { useState, useEffect } from 'react';
import './ManageItemCategories.css';
import { API_CONFIG } from '../../config/api.config';

interface StoreCategory {
    id: string;
    name: string;
    description?: string;
    items?: any[];
}

const ManageItemCategory: React.FC = () => {
    const [categories, setCategories] = useState<StoreCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<StoreCategory | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_CONFIG.baseUrl}/store-category`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading categories: ${response.status}`);
            }

            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setFormMode('create');
        setSelectedCategory(null);
        setFormData({
            name: '',
            description: ''
        });
    };

    const handleEdit = (category: StoreCategory) => {
        setFormMode('edit');
        setSelectedCategory(category);
        setFormData({
            name: category.name || '',
            description: category.description || ''
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_CONFIG.baseUrl}/store-category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting category: ${response.status}`);
            }

            setCategories(categories.filter(category => category.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting category');
            console.error(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        try {
            if (formMode === 'create') {
                const response = await fetch(`${API_CONFIG.baseUrl}/store-category`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`Error creating category: ${response.status}`);
                }

                const newCategory = await response.json();
                setCategories([...categories, newCategory]);
            } else if (formMode === 'edit' && selectedCategory) {
                const response = await fetch(`${API_CONFIG.baseUrl}/store-category/${selectedCategory.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`Error updating category: ${response.status}`);
                }

                const updatedCategory = await response.json();
                setCategories(categories.map(c =>
                    c.id === updatedCategory.id ? updatedCategory : c
                ));
            }

            setFormMode(null);
            setSelectedCategory(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving category');
            console.error(err);
        }
    };

    const countItemsInCategory = (category: StoreCategory): number => {
        return category.items?.length || 0;
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="mic-loading">Loading categories...</div>;
    if (error) return <div className="mic-error">Error: {error}</div>;

    return (
        <div className="manage-categories">
            <div className="mic-section-header">
                <h2>Manage Store Categories</h2>
                <button className="mic-create-button" onClick={handleCreateNew}>New Category</button>
            </div>

            <div className="mic-search-container">
                <input
                    type="text"
                    className="mic-search-input"
                    placeholder="Search categories by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {formMode && (
                <div className="mic-form-container">
                    <h3>{formMode === 'create' ? 'Create New Category' : 'Edit Category'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mic-form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <small>Category name must be unique</small>
                        </div>

                        <div className="mic-form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                            />
                        </div>

                        <div className="mic-form-actions">
                            <button type="submit" className="mic-save-button">
                                {formMode === 'create' ? 'Create' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormMode(null);
                                    setSelectedCategory(null);
                                }}
                                className="mic-cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!formMode && (
                <div className="mic-categories-list">
                    {filteredCategories.length === 0 ? (
                        <p className="mic-no-items">
                            {categories.length === 0 ? "No categories available." : "No categories match your search."}
                        </p>
                    ) : (
                        <table className="mic-categories-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Items Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>
                                            {category.description ?
                                                (category.description.length > 100 ?
                                                    `${category.description.substring(0, 100)}...` :
                                                    category.description) :
                                                'No description'}
                                        </td>
                                        <td className="mic-items-count">{countItemsInCategory(category)}</td>
                                        <td className="mic-actions-cell">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="mic-edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="mic-delete-button"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageItemCategory;