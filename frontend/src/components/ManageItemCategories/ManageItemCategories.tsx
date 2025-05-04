import React, { useState, useEffect } from 'react';
import './ManageItemCategories.css';

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

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // Load categories when component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/store-category', {
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
            const response = await fetch(`http://localhost:3000/store-category/${id}`, {
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
                const response = await fetch('http://localhost:3000/store-category', {
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
                const response = await fetch(`http://localhost:3000/store-category/${selectedCategory.id}`, {
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

    if (loading) return <div className="loading">Loading categories...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="manage-categories">
            <div className="section-header">
                <h2>Manage Store Categories</h2>
                <button className="create-button" onClick={handleCreateNew}>New Category</button>
            </div>

            {formMode && (
                <div className="form-container">
                    <h3>{formMode === 'create' ? 'Create New Category' : 'Edit Category'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
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

                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
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
                                    setSelectedCategory(null);
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
                <div className="categories-list">
                    {categories.length === 0 ? (
                        <p className="no-items">No categories available.</p>
                    ) : (
                        <table className="categories-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Items Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>
                                            {category.description ?
                                                (category.description.length > 100 ?
                                                    `${category.description.substring(0, 100)}...` :
                                                    category.description) :
                                                'No description'}
                                        </td>
                                        <td className="items-count">{countItemsInCategory(category)}</td>
                                        <td className="actions-cell">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="delete-button"
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