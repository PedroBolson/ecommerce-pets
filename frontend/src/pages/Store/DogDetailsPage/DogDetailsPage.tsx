import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DogDetails from '../../../storecomponents/DogDetails/DogDetails';
import './DogDetailsPage.css';
import Header from '../../../storecomponents/Header/Header';
import AdoptionPhoto from '../../../storecomponents/AdoptionPhoto/AdoptionPhoto';
import SimilarDogs from '../../../storecomponents/SimilarDogs/SimilarDogs';
import Footer from '../../../storecomponents/Footer/Footer';
import { API_CONFIG } from '../../../config/api.config';

interface Dog {
    id: string;
    sku: string;
    breed: { id: string; name: string; description?: string };
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

const DogDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [dog, setDog] = useState<Dog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_CONFIG.baseUrl}/dog/${id}`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: Dog = await res.json();
                setDog(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error loading dog');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div className="dog-details-loading">Loading...</div>;
    if (error) return <div className="dog-details-error">Error: {error}</div>;
    if (!dog) return <div className="dog-details-not-found">Not found</div>;

    return (
        <>
            <Header />
            <div className="dog-details-page">
                <div className="dog-details-container">
                    <DogDetails dog={dog} />
                </div>
            </div>
            <AdoptionPhoto
                breedId={dog.breed.id}
                title={`Our ${dog.breed.name} customer`}
            />
            <SimilarDogs
                currentDogId={dog.id}
                dogSize={dog.size}
            />
            <Footer />
        </>
    );
};

export default DogDetailsPage;