import React from 'react';
import { Link } from 'react-router-dom';
import './DogCard.css';
import { useCurrency } from '../../context/CurrencyContext';

export interface Dog {
    id: string;
    sku: string;
    breed: string;
    color: string;
    price: number;
    images: string[];
    age: number;
    gender: string;
}

interface DogCardProps {
    dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
    const { formatPrice } = useCurrency();
    const formattedPrice = formatPrice(dog.price);

    const idx = Math.floor(Math.random() * dog.images.length);
    const displayImage = dog.images[idx] || dog.images[0];

    const m = dog.sku.match(/^([A-Z]{2})-(\d{4})$/);
    const dogCode = m
        ? `${m[1]}${parseInt(m[2], 10)}`
        : dog.sku.replace('-', '');

    const ageLabel =
        dog.age < 12
            ? `${dog.age.toString().padStart(2, '0')} month${dog.age !== 1 ? 's' : ''}`
            : `${Math.floor(dog.age / 12)} year${Math.floor(dog.age / 12) !== 1 ? 's' : ''}`;

    return (
        <Link to={`/dogs/${dog.id}`} className="dog-card">
            <div className="dog-card-image">
                <img src={displayImage} alt={`${dog.breed} ${dog.color}`} />
            </div>
            <div className="dog-card-info">
                <h3 className="dog-code-breed">
                    {dogCode} – <span className="dog-breed">{dog.breed}</span>
                    <span className="dog-color">{dog.color}</span>
                </h3>
                <p className="dog-gender-age">
                    Gender: {dog.gender} • Age: {ageLabel}
                </p>
                <p className="dog-price">{formattedPrice}</p>
            </div>
        </Link>
    );
};

export default DogCard;