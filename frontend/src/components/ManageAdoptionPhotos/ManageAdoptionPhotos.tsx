import React, { useState, useEffect } from 'react';
import './ManageAdoptionPhotos.css';
import { API_CONFIG } from '../../config/api.config';

interface Breed {
    id: string;
    name: string;
    description: string;
    images?: { id: string, url: string, altText?: string, displayOrder: number }[];
}

interface AdoptionPhoto {
    id: string;
    url: string;
    altText?: string;
    displayOrder: number;
    breed: { id: string; name: string; };
}

interface ImageFormData {
    url: string;
    altText: string;
    displayOrder: number;
}

const ManageAdoptionPhotos: React.FC = () => {
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [adoptionPhotos, setAdoptionPhotos] = useState<Record<string, AdoptionPhoto[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
    const [photoManagementMode, setPhotoManagementMode] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPhotoPage, setCurrentPhotoPage] = useState(1);
    const photosPerPage = 4;

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
            const response = await fetch(`${API_CONFIG.baseUrl}/breed`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading breeds: ${response.status}`);
            }

            const data = await response.json();
            setBreeds(data);

            await fetchAllAdoptionPhotos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllAdoptionPhotos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_CONFIG.baseUrl}/adoption-photos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error loading adoption photos: ${response.status}`);
            }

            const photos = await response.json();

            const photosByBreed: Record<string, AdoptionPhoto[]> = {};
            photos.forEach((photo: AdoptionPhoto) => {
                const breedId = photo.breed.id;
                if (!photosByBreed[breedId]) {
                    photosByBreed[breedId] = [];
                }
                photosByBreed[breedId].push(photo);
            });

            setAdoptionPhotos(photosByBreed);
        } catch (err) {
            console.error('Error fetching adoption photos:', err);
        }
    };

    const getPaginatedPhotos = (photos: AdoptionPhoto[] | undefined) => {
        if (!photos) return [];

        const startIndex = (currentPhotoPage - 1) * photosPerPage;
        return photos.slice(startIndex, startIndex + photosPerPage);
    };

    const getPageCount = (photos: AdoptionPhoto[] | undefined) => {
        if (!photos) return 0;
        return Math.ceil(photos.length / photosPerPage);
    };

    const handleNextPage = () => {
        if (!selectedBreed) return;
        const pageCount = getPageCount(adoptionPhotos[selectedBreed.id]);
        if (currentPhotoPage < pageCount) {
            setCurrentPhotoPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPhotoPage > 1) {
            setCurrentPhotoPage(prev => prev - 1);
        }
    };

    const handleManagePhotos = (breed: Breed) => {
        setSelectedBreed(breed);
        setPhotoManagementMode(true);
        setCurrentPhotoPage(1);
        setImageFormData({
            url: '',
            altText: '',
            displayOrder: adoptionPhotos[breed.id]?.length || 0
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
        if (!selectedBreed || !imageFormData.url.trim()) return;

        setUploadLoading(true);
        try {
            const token = localStorage.getItem('token');

            const photoData = {
                ...imageFormData,
                breedId: selectedBreed.id
            };

            const response = await fetch(`${API_CONFIG.baseUrl}/adoption-photos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(photoData)
            });

            if (!response.ok) {
                throw new Error(`Error adding photo: ${response.status}`);
            }

            await fetchAllAdoptionPhotos();

            setImageFormData({
                url: '',
                altText: '',
                displayOrder: (adoptionPhotos[selectedBreed.id]?.length || 0) + 1
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error adding photo');
            console.error(err);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDeletePhoto = async (photoId: string) => {
        if (!window.confirm('Are you sure you want to delete this adoption photo?')) return;

        if (!selectedBreed) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_CONFIG.baseUrl}/adoption-photos/${photoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting photo: ${response.status}`);
            }

            await fetchAllAdoptionPhotos();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting photo');
            console.error(err);
        }
    };

    const filteredBreeds = breeds.filter(breed =>
        breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="map-loading">Loading breeds...</div>;
    if (error) return <div className="map-error">Error: {error}</div>;

    return (
        <div className="manage-adoption-photos">
            <div className="map-section-header">
                <h2>Manage Adoption Photos</h2>
            </div>

            <div className="map-search-container">
                <input
                    type="text"
                    className="map-search-input"
                    placeholder="Search breeds by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="map-breeds-grid">
                {filteredBreeds.length === 0 ? (
                    <p className="map-no-items">
                        {breeds.length === 0 ? "No breeds registered." : "No breeds match your search."}
                    </p>
                ) : (
                    <div className="map-breed-cards">
                        {filteredBreeds.map(breed => (
                            <div key={breed.id} className="map-breed-card">
                                <div className="map-breed-image">
                                    {breed.images && breed.images.length > 0 ? (
                                        <img src={breed.images[0].url} alt={breed.images[0].altText || breed.name} />
                                    ) : (
                                        <div className="map-no-image">No image</div>
                                    )}
                                </div>
                                <h3>{breed.name}</h3>

                                <div className="map-adoption-photos-count">
                                    <span>
                                        {adoptionPhotos[breed.id]?.length || 0} adoption photos
                                    </span>
                                </div>

                                <div className="map-card-actions">
                                    <button
                                        className="map-manage-photos-button"
                                        onClick={() => handleManagePhotos(breed)}
                                    >
                                        Manage Photos
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {photoManagementMode && selectedBreed && (
                <div className="map-photo-management-overlay">
                    <div className="map-photo-management-container">
                        <h3>Manage Adoption Photos for {selectedBreed.name}</h3>

                        <div className="map-current-photos">
                            {adoptionPhotos[selectedBreed.id]?.length > 0 ? (
                                <>
                                    <div className="map-photo-grid">
                                        {getPaginatedPhotos(adoptionPhotos[selectedBreed.id]).map(photo => (
                                            <div key={photo.id} className="map-photo-item">
                                                <img src={photo.url} alt={photo.altText || `Adoption photo for ${selectedBreed.name}`} />
                                                <div className="map-photo-details">
                                                    <p>Order: {photo.displayOrder}</p>
                                                </div>
                                                <button
                                                    className="map-delete-photo"
                                                    onClick={() => handleDeletePhoto(photo.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {getPageCount(adoptionPhotos[selectedBreed.id]) > 1 && (
                                        <div className="map-pagination-controls">
                                            <button
                                                className="map-pagination-button"
                                                onClick={handlePrevPage}
                                                disabled={currentPhotoPage === 1}
                                            >
                                                Previous
                                            </button>
                                            <span className="map-pagination-info">
                                                Page {currentPhotoPage} of {getPageCount(adoptionPhotos[selectedBreed.id])}
                                            </span>
                                            <button
                                                className="map-pagination-button"
                                                onClick={handleNextPage}
                                                disabled={currentPhotoPage === getPageCount(adoptionPhotos[selectedBreed.id])}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="map-no-photos">No adoption photos available for this breed</p>
                            )}
                        </div>

                        <div className="map-add-photo-form">
                            <h4>Add New Adoption Photo</h4>
                            <div className="map-form-group">
                                <label htmlFor="url">Image URL:</label>
                                <input
                                    type="text"
                                    id="url"
                                    name="url"
                                    value={imageFormData.url}
                                    onChange={handleImageInputChange}
                                    placeholder="https://example.com/adoption-photo.jpg"
                                    required
                                />
                            </div>
                            <div className="map-form-group">
                                <label htmlFor="altText">Description (Alt Text):</label>
                                <input
                                    type="text"
                                    id="altText"
                                    name="altText"
                                    value={imageFormData.altText}
                                    onChange={handleImageInputChange}
                                    placeholder="Happy family with their adopted dog"
                                />
                            </div>
                            <div className="map-form-group">
                                <label htmlFor="displayOrder">Display Order:</label>
                                <input
                                    type="number"
                                    id="displayOrder"
                                    name="displayOrder"
                                    value={imageFormData.displayOrder + 1}
                                    onChange={handleImageInputChange}
                                    min="0"
                                />
                            </div>
                            <button
                                className="map-add-photo-btn"
                                disabled={uploadLoading || !imageFormData.url.trim()}
                                onClick={handleAddPhoto}
                            >
                                {uploadLoading ? 'Adding...' : 'Add Photo'}
                            </button>
                        </div>

                        <div className="map-modal-actions">
                            <button
                                className="map-close-button"
                                onClick={() => {
                                    setPhotoManagementMode(false);
                                    setSelectedBreed(null);
                                    setError(null);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAdoptionPhotos;