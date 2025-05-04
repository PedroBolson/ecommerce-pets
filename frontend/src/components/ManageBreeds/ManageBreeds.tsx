import React, { useState, useEffect } from 'react';
import './ManageBreeds.css';

interface Breed {
    id: string;
    name: string;
    description: string;
    images: { id: string, url: string, altText?: string, displayOrder: number }[];
}

interface ImageFormData {
    url: string;
    altText: string;
    displayOrder: number;
}

const ManageBreeds: React.FC = () => {
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
    const [photoManagementMode, setPhotoManagementMode] = useState(false);
    const [breedForPhotos, setBreedForPhotos] = useState<Breed | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    // Image form state
    const [imageFormData, setImageFormData] = useState<ImageFormData>({
        url: '',
        altText: '',
        displayOrder: 0
    });

    useEffect(() => {
        fetchBreeds();
    }, []);

    const fetchBreeds = async () => {
        try {
            setLoading(true);
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
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setFormMode('create');
        setSelectedBreed(null);
        setFormData({
            name: '',
            description: '',
        });
    };

    const handleEdit = (breed: Breed) => {
        setFormMode('edit');
        setSelectedBreed(breed);
        setFormData({
            name: breed.name,
            description: breed.description,
        });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this breed?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/breed/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting: ${response.status}`);
            }

            setBreeds(breeds.filter(breed => breed.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting');
            console.error(err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        try {
            if (formMode === 'create') {
                const response = await fetch('http://localhost:3000/breed', {
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

                const newBreed = await response.json();
                setBreeds([...breeds, newBreed]);
            } else if (formMode === 'edit' && selectedBreed) {
                const response = await fetch(`http://localhost:3000/breed/${selectedBreed.id}`, {
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

                const updatedBreed = await response.json();
                setBreeds(breeds.map(b => b.id === updatedBreed.id ? updatedBreed : b));
            }

            setFormMode(null);
            setSelectedBreed(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving');
            console.error(err);
        }
    };

    const handleManagePhotos = (breed: Breed) => {
        setPhotoManagementMode(true);
        setBreedForPhotos(breed);
        setImageFormData({
            url: '',
            altText: '',
            displayOrder: breed.images?.length || 0
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
        if (!breedForPhotos || !imageFormData.url.trim()) return;

        setUploadLoading(true);
        try {
            const token = localStorage.getItem('token');

            const imageData = {
                ...imageFormData,
                breedId: breedForPhotos.id
            };

            const response = await fetch('http://localhost:3000/breed-image', {
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

            const breedResponse = await fetch(`http://localhost:3000/breed/${breedForPhotos.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!breedResponse.ok) {
                throw new Error(`Error fetching updated breed: ${breedResponse.status}`);
            }

            const updatedBreed = await breedResponse.json();

            setBreeds(breeds.map(b =>
                b.id === updatedBreed.id ? updatedBreed : b
            ));

            setBreedForPhotos(updatedBreed);

            setImageFormData({
                url: '',
                altText: '',
                displayOrder: updatedBreed.images?.length || 0
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
            const response = await fetch(`http://localhost:3000/breed-image/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting photo: ${response.status}`);
            }

            const breedId = breedForPhotos?.id;
            if (breedId) {
                const breedResponse = await fetch(`http://localhost:3000/breed/${breedId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!breedResponse.ok) {
                    throw new Error(`Error fetching updated breed: ${breedResponse.status}`);
                }

                const updatedBreed = await breedResponse.json();

                setBreeds(breeds.map(b =>
                    b.id === updatedBreed.id ? updatedBreed : b
                ));

                setBreedForPhotos(updatedBreed);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting photo');
            console.error(err);
        }
    };

    // Filter breeds based on search term
    const filteredBreeds = breeds.filter(breed =>
        breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading breeds...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="manage-breeds">
            <div className="section-header">
                <h2>Manage Breeds</h2>
                <button className="create-button" onClick={handleCreateNew}>New Breed</button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search breeds by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {formMode && (
                <div className="form-container">
                    <h3>{formMode === 'create' ? 'Create New Breed' : 'Edit Breed'}</h3>
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit">{formMode === 'create' ? 'Create' : 'Save'}</button>
                            <button type="button" onClick={() => setFormMode(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {!formMode && (
                <div className="breeds-list">
                    {filteredBreeds.length === 0 ? (
                        <p className="no-items">
                            {breeds.length === 0 ? "No breeds registered." : "No breeds match your search."}
                        </p>
                    ) : (
                        <div className="breed-cards">
                            {filteredBreeds.map(breed => (
                                <div key={breed.id} className="breed-card">
                                    <div className="breed-image">
                                        {breed.images && breed.images.length > 0 ? (
                                            <img src={breed.images[0].url} alt={breed.images[0].altText || breed.name} />
                                        ) : (
                                            <div className="no-image">No image</div>
                                        )}
                                    </div>
                                    <h3>{breed.name}</h3>
                                    <p>{breed.description.length > 100 ?
                                        `${breed.description.substring(0, 100)}...` :
                                        breed.description}
                                    </p>
                                    <div className="card-actions">
                                        <button onClick={() => handleEdit(breed)}>Edit</button>
                                        <button onClick={() => handleManagePhotos(breed)}>Photos</button>
                                        <button onClick={() => handleDelete(breed.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {photoManagementMode && breedForPhotos && (
                <div className="photo-management-overlay">
                    <div className="photo-management-container">
                        <h3>Manage Photos for {breedForPhotos.name}</h3>

                        <div className="current-photos">
                            {breedForPhotos.images && breedForPhotos.images.length > 0 ? (
                                <div className="photo-grid">
                                    {breedForPhotos.images.map(image => (
                                        <div key={image.id} className="photo-item">
                                            <img src={image.url} alt={image.altText || breedForPhotos.name} />
                                            <div className="photo-details">
                                                <p>Order: {image.displayOrder}</p>
                                            </div>
                                            <button
                                                className="delete-photo"
                                                onClick={() => handleDeletePhoto(image.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-photos">No photos available</p>
                            )}
                        </div>

                        <div className="add-photo-form">
                            <h4>Add New Photo</h4>
                            <div className="form-group">
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
                            <div className="form-group">
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
                            <div className="form-group">
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
                                className="add-photo-btn"
                                disabled={uploadLoading || !imageFormData.url.trim()}
                                onClick={handleAddPhoto}
                            >
                                {uploadLoading ? 'Adding...' : 'Add Photo'}
                            </button>
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => {
                                setPhotoManagementMode(false);
                                setBreedForPhotos(null);
                            }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBreeds;