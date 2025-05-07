import React, { useEffect, useState } from 'react';
import { API_CONFIG } from '../../config/api.config';
import DogCardGrid from '../DogCardGrid/DogCardGrid';
import './RandomDogs.css';

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

const RandomDogs: React.FC = () => {
    const [randomDogs, setRandomDogs] = useState<DogCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [breedImages, setBreedImages] = useState<Map<string, string[]>>(new Map());

    useEffect(() => {
        const fetchBreedImages = async () => {
            try {
                const res = await fetch(`${API_CONFIG.baseUrl}/breed-image`);
                if (!res.ok) throw new Error(`Error: ${res.status}`);
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
        const fetchRandomDogs = async () => {
            if (!breedImages.size) return;
            try {
                setLoading(true);
                const res = await fetch(`${API_CONFIG.baseUrl}/dog`);
                if (!res.ok) throw new Error(`Error: ${res.status}`);
                const body: ApiResponse = await res.json();

                // Shuffle dogs array
                const shuffled = [...body.data].sort(() => 0.5 - Math.random());
                // Take first 8 dogs
                const selectedDogs = shuffled.slice(0, 8);

                const mapped: DogCardData[] = selectedDogs.map(d => {
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

                setRandomDogs(mapped);
            } catch (e: any) {
                console.error(e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRandomDogs();
    }, [breedImages]);

    return (
        <div className="random-dogs-section">
            <div className="random-dogs-header">
                <div className='random-dogs-header-left'>
                    <p className="random-dogs-description">What's new?</p>
                    <h2>Take A Look At Some Of Our Pets</h2>
                </div>
                <div className='random-dogs-header-right'>
                    <button
                        className="random-dogs-button"
                        onClick={() => window.location.href = '/dogs'}
                    >
                        <p>View More</p>
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33337 6.66666L11.6667 9.99999L8.33337 13.3333" stroke="#003459" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
            {loading ? (
                <div className="random-dogs-loading">Loading puppies...</div>
            ) : error ? (
                <div className="random-dogs-error">Unable to load puppies</div>
            ) : (
                <DogCardGrid dogs={randomDogs} columns={4} maxItems={8} />
            )}
        </div>
    );
};

export default RandomDogs;