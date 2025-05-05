import React, { useState, useEffect } from 'react';
import './ManageItems.css';

interface StoreCategory {
    id: string;
    name: string;
    description?: string;
}

interface StoreItemImage {
    id: string;
    url: string;
    altText?: string;
    displayOrder: number;
}

interface StoreItem {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    category: StoreCategory;
    categoryId?: string;
    images: StoreItemImage[];
}

interface ImageFormData {
    url: string;
    altText: string;
    displayOrder: number;
}

const ManageItems: React.FC = () => {
    const [items, setItems] = useState<StoreItem[]>([]);
    const [categories, setCategories] = useState<StoreCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
    const [photoManagementMode, setPhotoManagementMode] = useState(false);
    const [itemForPhotos, setItemForPhotos] = useState<StoreItem | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterMinPrice, setFilterMinPrice] = useState<string>('');
    const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
    const [filterInStock, setFilterInStock] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(8);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: '',
        sku: ''
    });

    const [imageFormData, setImageFormData] = useState<ImageFormData>({
        url: '',
        altText: '',
        displayOrder: 0
    });

    const [currentPhotoPage, setCurrentPhotoPage] = useState(1);
    const photosPerPage = 4;

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, [filterCategory, filterMinPrice, filterMaxPrice, filterInStock, currentPage, limit]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let params = new URLSearchParams();

            params.append('page', currentPage.toString());
            params.append('limit', limit.toString());

            if (filterCategory) {
                params.append('categoryId', filterCategory);
            }

            if (filterMinPrice) {
                params.append('minPrice', filterMinPrice);
            }

            if (filterMaxPrice) {
                params.append('maxPrice', filterMaxPrice);
            }

            if (filterInStock) {
                params.append('inStock', filterInStock);
            }

            const url = `http://localhost:3000/store-item?${params.toString()}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading items: ${response.status}`);
            }

            const responseData = await response.json();

            if (Array.isArray(responseData)) {
                setItems(responseData);
                setTotalPages(1);
            } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
                setItems(responseData.data);
                setTotalPages(responseData.pagination?.totalPages || 1);
            } else if (responseData && responseData.items && Array.isArray(responseData.items)) {
                setItems(responseData.items);
                setTotalPages(responseData.pagination?.totalPages || 1);
            } else {
                console.error("Unexpected API response format:", responseData);
                setItems([]);
                setTotalPages(1);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setFilterCategory('');
        setFilterMinPrice('');
        setFilterMaxPrice('');
        setFilterInStock('');
        setCurrentPage(1);
    };

    const fetchCategories = async () => {
        try {
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
            console.error("Error fetching categories:", err);
        }
    };

    const handleCreateNew = () => {
        setFormMode('create');
        setSelectedItem(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            categoryId: categories.length > 0 ? categories[0].id : '',
            sku: ''
        });
    };

    const handleEdit = (item: StoreItem) => {
        setFormMode('edit');
        setSelectedItem(item);
        setFormData({
            name: item.name || '',
            description: item.description || '',
            price: item.price || 0,
            stock: item.stock || 0,
            categoryId: item.category?.id || '',
            sku: item.sku || ''
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/store-item/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting: ${response.status}`);
            }

            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting');
            console.error(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'discountPercentage' ? Math.min(100, Math.max(0, Number(value) || 0)) : Number(value) || 0
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

        const apiData = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            categoryId: formData.categoryId,
            sku: formData.sku,
        };

        const token = localStorage.getItem('token');
        try {
            if (formMode === 'create') {
                const response = await fetch('http://localhost:3000/store-item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(apiData)
                });

                if (!response.ok) {
                    throw new Error(`Error creating: ${response.status}`);
                }

                const newItem = await response.json();
                setItems([...items, newItem]);
            } else if (formMode === 'edit' && selectedItem) {
                const response = await fetch(`http://localhost:3000/store-item/${selectedItem.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`Error updating: ${response.status}`);
                }

                const updatedItem = await response.json();
                setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
            }

            setFormMode(null);
            setSelectedItem(null);
            fetchItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving');
            console.error(err);
        }
    };

    const handleManagePhotos = (item: StoreItem) => {
        setPhotoManagementMode(true);
        setItemForPhotos(item);
        setCurrentPhotoPage(1);
        setImageFormData({
            url: '',
            altText: '',
            displayOrder: item.images?.length || 0
        });
    };

    const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setImageFormData(prev => ({
            ...prev,
            [name]: name === 'displayOrder' ? parseInt(value) || 0 : value
        }));
    };

    const handleAddPhoto = async () => {
        if (!itemForPhotos || !imageFormData.url.trim()) return;

        setUploadLoading(true);
        try {
            const token = localStorage.getItem('token');

            const imageData = {
                ...imageFormData,
                itemId: itemForPhotos.id
            };

            const response = await fetch('http://localhost:3000/store-item-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(imageData)
            });

            if (!response.ok) {
                throw new Error(`Error adding image: ${response.status}`);
            }

            const itemResponse = await fetch(`http://localhost:3000/store-item/${itemForPhotos.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!itemResponse.ok) {
                throw new Error(`Error fetching updated item: ${itemResponse.status}`);
            }

            const updatedItem = await itemResponse.json();

            setItems(items.map(i =>
                i.id === updatedItem.id ? updatedItem : i
            ));

            setItemForPhotos(updatedItem);

            setImageFormData({
                url: '',
                altText: '',
                displayOrder: updatedItem.images?.length || 0
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error adding image');
            console.error(err);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDeletePhoto = async (imageId: string) => {
        if (!window.confirm('Are you sure you want to delete this photo?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/store-item-image/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting photo: ${response.status}`);
            }

            const itemId = itemForPhotos?.id;
            if (itemId) {
                const itemResponse = await fetch(`http://localhost:3000/store-item/${itemId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!itemResponse.ok) {
                    throw new Error(`Error fetching updated item: ${itemResponse.status}`);
                }

                const updatedItem = await itemResponse.json();

                setItems(items.map(i =>
                    i.id === updatedItem.id ? updatedItem : i
                ));

                setItemForPhotos(updatedItem);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting photo');
            console.error(err);
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatNumberWithSeparators = (num: number | string): string => {
        if (typeof num === 'string' && num === '') return '';
        return new Intl.NumberFormat('vi-VN').format(Number(num));
    };

    const getCategoryName = (item: StoreItem): string => {
        return item.category ? item.category.name : 'Unknown Category';
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPaginatedPhotos = (photos: StoreItemImage[]) => {
        const startIndex = (currentPhotoPage - 1) * photosPerPage;
        return photos.slice(startIndex, startIndex + photosPerPage);
    };

    const getPageCount = (photos: StoreItemImage[]) => {
        return Math.ceil(photos.length / photosPerPage);
    };

    const handleNextPage = () => {
        if (!itemForPhotos?.images) return;

        const pageCount = getPageCount(itemForPhotos.images);
        if (currentPhotoPage < pageCount) {
            setCurrentPhotoPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPhotoPage > 1) {
            setCurrentPhotoPage(prev => prev - 1);
        }
    };

    if (loading && items.length === 0) return <div className="mi-loading">Loading items...</div>;

    return (
        <div className="manage-items">
            <div className="mi-section-header">
                <h2>Manage Store Items</h2>
                <button className="mi-create-button" onClick={handleCreateNew}>New Item</button>
            </div>

            <div className="mi-filters-container">
                <h3>Filters</h3>
                <div className="mi-filters-grid">
                    <div className="mi-filter-group">
                        <label>Category:</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mi-filter-group">
                        <label>Stock Status:</label>
                        <select
                            value={filterInStock}
                            onChange={(e) => {
                                setFilterInStock(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Items</option>
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                        </select>
                    </div>

                    <div className="mi-filter-group">
                        <label>Price Range:</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min ₫"
                                value={filterMinPrice}
                                onChange={(e) => {
                                    setFilterMinPrice(e.target.value);
                                    setCurrentPage(1);
                                }}
                                min="0"
                            />
                            <span className='mi-span-to'>to</span>
                            <input
                                type="number"
                                placeholder="Max ₫"
                                value={filterMaxPrice}
                                onChange={(e) => {
                                    setFilterMaxPrice(e.target.value);
                                    setCurrentPage(1);
                                }}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="mi-filter-actions">
                        <button className="mi-reset-filters" onClick={resetFilters}>
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="mi-error">{error}</div>}

            {formMode && (
                <div className="mi-form-container">
                    <h3>{formMode === 'create' ? 'Create New Item' : 'Edit Item'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mi-form-row">
                            <div className="mi-form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mi-form-group">
                                <label htmlFor="sku">SKU:</label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mi-form-group">
                                <label htmlFor="categoryId">Category:</label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mi-form-row">
                            <div className="mi-form-group">
                                <label htmlFor="price">Price (₫):</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    min="0"
                                    step="1"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                                <small className="price-preview">
                                    {formData.price > 0 ? `Formatted: ${formatNumberWithSeparators(formData.price)} ₫` : ''}
                                </small>
                            </div>

                            <div className="mi-form-group">
                                <label htmlFor="stock">Stock:</label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mi-form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="mi-form-actions">
                            <button type="submit" className="mi-save-button">
                                {formMode === 'create' ? 'Create' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormMode(null);
                                    setSelectedItem(null);
                                }}
                                className="mi-cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!formMode && (
                <div className="mi-items-list">
                    {loading && <div className="mi-loading-overlay">Loading...</div>}

                    {items.length === 0 && !loading ? (
                        <p className="mi-no-items">No items found matching your filters.</p>
                    ) : (
                        <>
                            <div className="mi-item-cards">
                                {items.map(item => (
                                    <div key={item.id} className="mi-item-card">
                                        <div className="mi-item-image">
                                            {item.images && item.images.length > 0 ? (
                                                <img src={item.images[0].url} alt={item.name} />
                                            ) : (
                                                <div className="mi-no-image">No image</div>
                                            )}
                                        </div>
                                        <h3>{item.name}</h3>
                                        <div className="mi-item-details">
                                            <span className="mi-item-category">{getCategoryName(item)}</span>
                                            <span className="mi-price">{formatPrice(item.price)}</span>
                                        </div>
                                        <p>{item.description.length > 100 ?
                                            `${item.description.substring(0, 100)}...` :
                                            item.description}
                                        </p>
                                        <div className="mi-stock-info">
                                            <span className={`mi-stock-level ${item.stock < 5 ? 'low-stock' : ''}`}>
                                                {item.stock === 0 ? 'Out of stock' :
                                                    item.stock < 5 ? 'Low stock' : 'In stock'}
                                            </span>
                                            <span className="mi-quantity">Qty: {item.stock}</span>
                                        </div>
                                        <div className="mi-card-actions">
                                            <button onClick={() => handleEdit(item)}>Edit</button>
                                            <button onClick={() => handleManagePhotos(item)}>Photos</button>
                                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mi-pagination">
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

            {photoManagementMode && itemForPhotos && (
                <div className="mi-photo-management-overlay">
                    <div className="mi-photo-management-container">
                        <h3>Manage Photos for {itemForPhotos.name}</h3>

                        <div className="mi-current-photos">
                            {itemForPhotos.images && itemForPhotos.images.length > 0 ? (
                                <>
                                    <div className="mi-photo-grid">
                                        {getPaginatedPhotos(itemForPhotos.images).map(image => (
                                            <div key={image.id} className="mi-photo-item">
                                                <img src={image.url} alt={image.altText || itemForPhotos.name} />
                                                <div className="mi-photo-details">
                                                    <p>Order: {image.displayOrder}</p>
                                                </div>
                                                <button
                                                    className="mi-delete-photo"
                                                    onClick={() => handleDeletePhoto(image.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {itemForPhotos.images.length > photosPerPage && (
                                        <div className="mi-pagination">
                                            <button
                                                className="mi-pagination-button"
                                                onClick={handlePrevPage}
                                                disabled={currentPhotoPage === 1}
                                            >
                                                Previous
                                            </button>
                                            <span className="mi-pagination-info">
                                                Page {currentPhotoPage} of {getPageCount(itemForPhotos.images)}
                                            </span>
                                            <button
                                                className="mi-pagination-button"
                                                onClick={handleNextPage}
                                                disabled={currentPhotoPage === getPageCount(itemForPhotos.images)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="mi-no-photos">No photos available</p>
                            )}
                        </div>

                        <div className="mi-add-photo-form">
                            <h4>Add New Photo</h4>
                            <div className="mi-form-group">
                                <label htmlFor="url">Image URL:</label>
                                <input
                                    type="text"
                                    id="url"
                                    name="url"
                                    value={imageFormData.url}
                                    onChange={handleImageInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                            </div>
                            <div className="mi-form-group">
                                <label htmlFor="altText">Alt Text:</label>
                                <input
                                    type="text"
                                    id="altText"
                                    name="altText"
                                    value={imageFormData.altText}
                                    onChange={handleImageInputChange}
                                    placeholder="Description of the image"
                                />
                            </div>
                            <div className="mi-form-group">
                                <label htmlFor="displayOrder">Display Order:</label>
                                <input
                                    type="number"
                                    id="displayOrder"
                                    name="displayOrder"
                                    value={imageFormData.displayOrder}
                                    onChange={handleImageInputChange}
                                    min="0"
                                />
                            </div>
                            <button
                                className="mi-add-photo-btn"
                                disabled={uploadLoading || !imageFormData.url.trim()}
                                onClick={handleAddPhoto}
                            >
                                {uploadLoading ? 'Adding...' : 'Add Photo'}
                            </button>
                        </div>

                        <div className="mi-modal-actions">
                            <button onClick={() => {
                                setPhotoManagementMode(false);
                                setItemForPhotos(null);
                            }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageItems;