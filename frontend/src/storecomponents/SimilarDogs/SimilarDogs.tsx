import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DogCardGrid from '../DogCardGrid/DogCardGrid';
import { API_CONFIG } from '../../config/api.config';
import './SimilarDogs.css';

interface DogCardData {
    id: string;
    sku: string;
    breed: string;
    color: string;
    price: number;
    images: string[];
    age: number;
    gender: string;
}

interface ApiDog {
    id: string;
    sku: string;
    breed: { id: string; name: string; description?: string };
    gender: 'Male' | 'Female';
    ageInMonths: number;
    size: 'Small' | 'Medium' | 'Large';
    color: string;
    price: string;
    vaccinated: boolean;
    dewormed: boolean;
    microchip: boolean;
    images?: string[];
}

interface BreedImage {
    id: string;
    url: string;
    altText: string;
    displayOrder: number;
    breed: {
        id: string;
        name: string;
        description: string;
    };
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

interface SimilarDogsProps {
    currentDogId: string;
    dogSize: 'Small' | 'Medium' | 'Large';
}

const SimilarDogs: React.FC<SimilarDogsProps> = ({ currentDogId, dogSize }) => {
    const [similarDogs, setSimilarDogs] = useState<DogCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [breedImages, setBreedImages] = useState<Map<string, string[]>>(new Map());

    useEffect(() => {
        const fetchBreedImages = async () => {
            try {
                const res = await fetch(`${API_CONFIG.baseUrl}/breed-image`);
                if (!res.ok) throw new Error(`Erro: ${res.status}`);
                const images: BreedImage[] = await res.json();
                const map = new Map<string, string[]>();
                images.forEach(img => {
                    const bid = img.breed.id;
                    if (!map.has(bid)) map.set(bid, []);
                    map.get(bid)!.push(img.url);
                });
                setBreedImages(map);
            } catch (e) {
                console.error(e);
            }
        };
        fetchBreedImages();
    }, []);

    useEffect(() => {
        const fetchSimilarDogs = async () => {
            if (!breedImages.size) return;
            try {
                setLoading(true);
                const fetchDogsBySize = async (dogSize: string) => {
                    const res = await fetch(`${API_CONFIG.baseUrl}/dog?size=${dogSize}`);
                    if (!res.ok) throw new Error(`Erro: ${res.status}`);
                    return res.json();
                };

                const fetchAllDogs = async () => {
                    const allRes = await fetch(`${API_CONFIG.baseUrl}/dog`);
                    if (!allRes.ok) throw new Error(`Erro: ${allRes.status}`);
                    return allRes.json();
                };

                const body: ApiResponse = await fetchDogsBySize(dogSize);
                let list = body.data.filter(d => d.id !== currentDogId);

                if (list.length < 4) {
                    const allBody: ApiResponse = await fetchAllDogs();
                    const extra = allBody.data.filter(d =>
                        d.id !== currentDogId && !list.some(x => x.id === d.id)
                    );
                    list = [...list, ...extra].slice(0, 4);
                } else {
                    list = list.slice(0, 4);
                }

                const mapped: DogCardData[] = list.map(d => {
                    const m = d.sku.match(/^([A-Z]{2})-(\d{4})$/);
                    const sku = m ? `${m[1]}${parseInt(m[2], 10)}` : d.sku.replace('-', '');

                    const imgs = breedImages.get(d.breed.id) || ['https://placehold.co/400x400?text=No+Image'];

                    return {
                        id: d.id,
                        sku,
                        breed: d.breed.name,
                        color: d.color,
                        price: parseFloat(d.price),
                        images: imgs,
                        age: d.ageInMonths,
                        gender: d.gender
                    };
                });

                setSimilarDogs(mapped);
            } catch (e: any) {
                console.error(e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSimilarDogs();
    }, [currentDogId, dogSize, breedImages]);

    return (
        <div className="similar-dogs-section">
            <div className="similar-dogs-header">
                <h2>What's new?</h2>
                <Link to="/dogs" className="see-more-link">See More Puppies</Link>
            </div>
            {loading ? (
                <div className="similar-dogs-loading">Loading similar puppies...</div>
            ) : error ? (
                <div className="similar-dogs-error">Unable to load similar puppies</div>
            ) : (
                <DogCardGrid dogs={similarDogs} columns={4} maxItems={4} />
            )}
        </div>
    );
};

export default SimilarDogs;