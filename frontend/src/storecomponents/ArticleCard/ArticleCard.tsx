import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

interface Breed {
    id: string;
    name: string;
}

interface ArticleProps {
    id: string;
    title: string;
    summary: string;
    imageUrl?: string;
    category: string;
    createdAt: Date | string;
    breed?: Breed;
}

const ArticleCard: React.FC<ArticleProps> = ({
    id,
    title,
    summary,
    imageUrl,
    category,
    createdAt,
    breed
}) => {
    // Truncate summary if it's too long
    const truncateSummary = (text: string, maxLength: number = 120) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <Link to={`/articles/${id}`} className="article-card">
            <div className="article-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} />
                ) : (
                    <div className="article-card-no-image">No image available</div>
                )}
            </div>

            <div className="article-card-content">
                <div className="article-card-category">
                    {category}
                </div>

                <h3 className="article-card-title">{title}</h3>

                <p className="article-card-summary">{truncateSummary(summary)}</p>

                <div className="article-card-footer">
                    {breed && (
                        <span className="article-card-breed">
                            {breed.name}
                        </span>
                    )}
                    <span className="article-card-date">
                        {new Date(createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;