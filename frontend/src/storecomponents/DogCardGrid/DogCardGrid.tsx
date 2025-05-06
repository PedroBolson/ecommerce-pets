import React from 'react';
import DogCard, { Dog } from '../DogCard/DogCard';
import './DogCardGrid.css';

interface DogCardGridProps {
    dogs: Dog[];
    columns?: number;
    maxItems?: number;
}

const DogCardGrid: React.FC<DogCardGridProps> = ({
    dogs,
    columns = 4,
    maxItems
}) => {
    const displayDogs = maxItems ? dogs.slice(0, maxItems) : dogs;

    return (
        <div className={`dog-card-grid columns-${columns}`}>
            {displayDogs.map(dog => (
                <div key={dog.id} className="dog-card-grid-item">
                    <DogCard dog={dog} />
                </div>
            ))}
        </div>
    );
};

export default DogCardGrid;