import React, { useState, useEffect } from 'react';
import ArticleCard from '../ArticleCard/ArticleCard';
import { API_CONFIG } from '../../config/api.config';
import './ArticleCardGrid.css';

interface Article {
    id: string;
    title: string;
    summary: string;
    imageUrl?: string;
    category: string;
    createdAt: Date | string;
    breed?: {
        id: string;
        name: string;
    };
}

interface ArticleCardGridProps {
    columns?: number;
    count?: number;
    category?: string;
    excludeIds?: string[];
    title?: string;
}

const ArticleCardGrid: React.FC<ArticleCardGridProps> = ({
    columns = 3,
    count = 3,
    category,
    excludeIds = [],
    title = "Related Articles"
}) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);

                let url = `${API_CONFIG.baseUrl}/pet-knowledge?limit=${count + excludeIds.length}&random=true`;

                if (category) {
                    url += `&category=${encodeURIComponent(category)}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();

                const articlesData = Array.isArray(data) ? data : data.data || [];

                const filteredArticles: Article[] = articlesData
                    .filter((article: Article) => !excludeIds.includes(article.id))
                    .slice(0, count);

                setArticles(filteredArticles);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load articles');
                console.error('Failed to fetch articles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [count, category, excludeIds]);

    if (loading) {
        return (
            <div className="article-grid-container">
                {title && <h2 className="article-grid-title">{title}</h2>}
                <div className="article-grid-loading">Loading articles...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="article-grid-container">
                {title && <h2 className="article-grid-title">{title}</h2>}
                <div className="article-grid-error">Error loading articles: {error}</div>
            </div>
        );
    }

    if (articles.length === 0) {
        return null;
    }

    return (
        <div className="article-grid-container">
            {title && <h2 className="article-grid-title">{title}</h2>}
            <div
                className="article-grid"
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`
                }}
            >
                {articles.map(article => (
                    <div key={article.id} className="article-grid-item">
                        <ArticleCard
                            id={article.id}
                            title={article.title}
                            summary={article.summary}
                            imageUrl={article.imageUrl}
                            category={article.category}
                            createdAt={article.createdAt}
                            breed={article.breed}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticleCardGrid;