import React, { useState, useEffect } from 'react';
import './ManageDogs.css';

interface Breed {
    id: string;
    name: string;
}

interface Dog {
    id: string;
    sku: string;
    breed: Breed;
    gender: 'Male' | 'Female';
    ageInMonths: number;
    size: 'Small' | 'Medium' | 'Large';
    color: string;
    price: number;
    vaccinated: boolean;
    dewormed: boolean;
    microchip: boolean;
    certification?: string;
    location?: string;
    publishedDate?: string;
    additionalInfo?: string;
}

const ManageDogs: React.FC = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);

    // Filter states
    const [filterGender, setFilterGender] = useState<string>('');
    const [filterColor, setFilterColor] = useState<string>('');
    const [filterMinPrice, setFilterMinPrice] = useState<string>('');
    const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
    const [filterSize, setFilterSize] = useState<string>('');
    const [filterBreed, setFilterBreed] = useState<string>('');

    // Common dog colors
    const dogColors = [
        'Red', 'Apricot', 'Black', 'White', 'Cream', 'Fawn', 'Brown',
        'Chocolate', 'Tan', 'Golden', 'Gray', 'Silver', 'Blue', 'Brindle',
        'Black & White', 'Black & Tan', 'Brown & White', 'Tricolor', 'Merle'
    ];

    // Form state with default values
    const [formData, setFormData] = useState({
        sku: '',
        breedId: '',
        gender: 'Male',
        ageInMonths: 1,
        size: 'Medium',
        color: '',
        price: 0,
        vaccinated: false,
        dewormed: false,
        microchip: false,
        certification: '',
        location: '',
        additionalInfo: ''
    });

    useEffect(() => {
        fetchDogs();
        fetchBreeds();
    }, [filterGender, filterColor, filterMinPrice, filterMaxPrice, filterSize, filterBreed]);

    const fetchDogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            let params = new URLSearchParams();

            if (filterGender) {
                params.append('gender', filterGender);
            }

            if (filterColor) {
                params.append('color', filterColor);
            }

            if (filterMinPrice) {
                params.append('minPrice', filterMinPrice);
            }

            if (filterMaxPrice) {
                params.append('maxPrice', filterMaxPrice);
            }

            if (filterSize) {
                params.append('size', filterSize);
            }

            if (filterBreed) {
                params.append('breedId', filterBreed);
            }

            const url = `http://localhost:3000/dog?${params.toString()}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading dogs: ${response.status}`);
            }

            const data = await response.json();
            setDogs(data.data || data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setFilterGender('');
        setFilterColor('');
        setFilterMinPrice('');
        setFilterMaxPrice('');
        setFilterSize('');
        setFilterBreed('');
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
            setBreeds(data);
        } catch (err) {
            console.error("Error fetching breeds:", err);
            // We don't set the main error state for breeds to avoid blocking the UI
        }
    };

    const handleCreateNew = () => {
        setFormMode('create');
        setSelectedDog(null);
        setFormData({
            sku: '',
            breedId: breeds.length > 0 ? breeds[0].id : '',
            gender: 'Male',
            ageInMonths: 1,
            size: 'Medium',
            color: '',
            price: 0,
            vaccinated: false,
            dewormed: false,
            microchip: false,
            certification: '',
            location: '',
            additionalInfo: ''
        });
    };

    const handleEdit = (dog: Dog) => {
        setFormMode('edit');
        setSelectedDog(dog);
        setFormData({
            sku: dog.sku,
            breedId: dog.breed.id,
            gender: dog.gender,
            ageInMonths: dog.ageInMonths,
            size: dog.size,
            color: dog.color || '',
            price: dog.price,
            vaccinated: dog.vaccinated || false,
            dewormed: dog.dewormed || false,
            microchip: dog.microchip || false,
            certification: dog.certification || '',
            location: dog.location || '',
            additionalInfo: dog.additionalInfo || ''
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this dog?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/dog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting: ${response.status}`);
            }

            setDogs(dogs.filter(dog => dog.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting');
            console.error(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle different input types
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? '' : Number(value)
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

        const token = localStorage.getItem('token');
        try {
            if (formMode === 'create') {
                const response = await fetch('http://localhost:3000/dog', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`Error creating: ${response.status}`);
                }

                await fetchDogs(); // Refresh the dogs list
            } else if (formMode === 'edit' && selectedDog) {
                const response = await fetch(`http://localhost:3000/dog/${selectedDog.id}`, {
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

                await fetchDogs(); // Refresh the dogs list
            }

            setFormMode(null);
            setSelectedDog(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving');
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

    const calculateAge = (months: number): string => {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years > 0) {
            return `${years}y ${remainingMonths}m`;
        }
        return `${months}m`;
    };

    return (
        <div className="manage-dogs">
            <div className="md-section-header">
                <h2>Manage Dogs</h2>
                <button className="md-create-button" onClick={handleCreateNew}>New Dog</button>
            </div>

            <div className="md-filters-container">
                <h3>Filters</h3>
                <div className="md-filters-grid">
                    <div className="md-filter-group">
                        <label>Gender:</label>
                        <select
                            value={filterGender}
                            onChange={(e) => setFilterGender(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="md-filter-group">
                        <label>Color:</label>
                        <select
                            value={filterColor}
                            onChange={(e) => setFilterColor(e.target.value)}
                        >
                            <option value="">All Colors</option>
                            {dogColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md-filter-group">
                        <label>Size:</label>
                        <select
                            value={filterSize}
                            onChange={(e) => setFilterSize(e.target.value)}
                        >
                            <option value="">All Sizes</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                        </select>
                    </div>

                    <div className="md-filter-group">
                        <label>Breed:</label>
                        <select
                            value={filterBreed}
                            onChange={(e) => setFilterBreed(e.target.value)}
                        >
                            <option value="">All Breeds</option>
                            {breeds.map(breed => (
                                <option key={breed.id} value={breed.id}>{breed.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md-filter-group">
                        <label>Price Range:</label>
                        <div className="md-price-inputs">
                            <input
                                type="number"
                                placeholder="Min ₫"
                                value={filterMinPrice}
                                onChange={(e) => setFilterMinPrice(e.target.value)}
                                min="0"
                            />
                            <span>to</span>
                            <input
                                type="number"
                                placeholder="Max ₫"
                                value={filterMaxPrice}
                                onChange={(e) => setFilterMaxPrice(e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="md-filter-actions">
                        <button className="md-reset-filters" onClick={resetFilters}>
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="md-error">{error}</div>}

            {formMode && (
                <div className="md-form-container">
                    <h3>{formMode === 'create' ? 'Add New Dog' : 'Edit Dog'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="md-form-row">
                            <div className="md-form-group">
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

                            <div className="md-form-group">
                                <label htmlFor="breedId">Breed:</label>
                                <select
                                    id="breedId"
                                    name="breedId"
                                    value={formData.breedId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {breeds.map(breed => (
                                        <option key={breed.id} value={breed.id}>
                                            {breed.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="md-form-row">
                            <div className="md-form-group">
                                <label htmlFor="gender">Gender:</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="md-form-group">
                                <label htmlFor="ageInMonths">Age (months):</label>
                                <input
                                    type="number"
                                    id="ageInMonths"
                                    name="ageInMonths"
                                    min="1"
                                    max="240"
                                    value={formData.ageInMonths}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="md-form-group">
                                <label htmlFor="size">Size:</label>
                                <select
                                    id="size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                >
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>
                            </div>
                        </div>

                        <div className="md-form-row">
                            <div className="md-form-group">
                                <label htmlFor="color">Color:</label>
                                <input
                                    type="text"
                                    id="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="md-form-group">
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
                        </div>

                        <div className="md-form-row md-checkboxes">
                            <div className="md-form-group md-checkbox">
                                <input
                                    type="checkbox"
                                    id="vaccinated"
                                    name="vaccinated"
                                    checked={formData.vaccinated}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="vaccinated">Vaccinated</label>
                            </div>

                            <div className="md-form-group md-checkbox">
                                <input
                                    type="checkbox"
                                    id="dewormed"
                                    name="dewormed"
                                    checked={formData.dewormed}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="dewormed">Dewormed</label>
                            </div>

                            <div className="md-form-group md-checkbox">
                                <input
                                    type="checkbox"
                                    id="microchip"
                                    name="microchip"
                                    checked={formData.microchip}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="microchip">Microchip</label>
                            </div>
                        </div>

                        <div className="md-form-row">
                            <div className="md-form-group">
                                <label htmlFor="certification">Certification:</label>
                                <input
                                    type="text"
                                    id="certification"
                                    name="certification"
                                    value={formData.certification}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="md-form-group">
                                <label htmlFor="location">Location:</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="md-form-group">
                            <label htmlFor="additionalInfo">Additional Information:</label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                                rows={3}
                            />
                        </div>

                        <div className="md-form-actions">
                            <button type="submit" className="md-save-button">
                                {formMode === 'create' ? 'Create' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormMode(null);
                                    setSelectedDog(null);
                                }}
                                className="md-cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!formMode && (
                <div className="md-dogs-list">
                    {loading ? (
                        <div className="md-loading">Loading dogs...</div>
                    ) : dogs.length === 0 ? (
                        <p className="md-no-items">No dogs found matching the filters.</p>
                    ) : (
                        <table className="md-dogs-table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Breed</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Size</th>
                                    <th>Color</th>
                                    <th>Price</th>
                                    <th>Health</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dogs.map(dog => (
                                    <tr key={dog.id}>
                                        <td>{dog.sku}</td>
                                        <td>{dog.breed.name}</td>
                                        <td>{dog.gender}</td>
                                        <td>{calculateAge(dog.ageInMonths)}</td>
                                        <td>{dog.size}</td>
                                        <td>{dog.color}</td>
                                        <td>{formatPrice(dog.price)}</td>
                                        <td className="md-health-cell">
                                            {dog.vaccinated ? '💉' : ''}
                                            {dog.dewormed ? '🪱' : ''}
                                            {dog.microchip ? '🔍' : ''}
                                        </td>
                                        <td>{dog.location || 'N/A'}</td>
                                        <td className="md-actions-cell">
                                            <button
                                                onClick={() => handleEdit(dog)}
                                                className="md-edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dog.id)}
                                                className="md-delete-button"
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

export default ManageDogs;