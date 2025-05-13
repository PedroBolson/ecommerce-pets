import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../ArticleCard/ArticleCard';
import { API_CONFIG } from '../../config/api.config';
import './ActiveArticles.css';

interface Article {
    id: string;
    title: string;
    summary: string;
    imageUrl?: string;
    category: string;
    createdAt: Date | string;
    isActive: boolean;
    breed?: {
        id: string;
        name: string;
    };
}

const ActiveArticles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);

                const activeResponse = await fetch(`${API_CONFIG.baseUrl}/pet-knowledge?isActive=true&limit=3`);

                if (!activeResponse.ok) {
                    throw new Error(`Error: ${activeResponse.status}`);
                }

                const activeData = await activeResponse.json();

                let activeArticles = Array.isArray(activeData) ? activeData : (activeData.data || []);

                if (activeArticles.length < 3) {
                    const remainingCount = 3 - activeArticles.length;

                    const activeIds: string[] = activeArticles.map((article: Article) => article.id);

                    const additionalResponse = await fetch(
                        `${API_CONFIG.baseUrl}/pet-knowledge?limit=${remainingCount + 5}&random=true`
                    );

                    if (additionalResponse.ok) {
                        const additionalData = await additionalResponse.json();
                        const additionalArticles = Array.isArray(additionalData)
                            ? additionalData
                            : (additionalData.data || []);

                        const filteredAdditional: Article[] = additionalArticles
                            .filter((article: Article) => !activeIds.includes(article.id))
                            .slice(0, remainingCount);

                        activeArticles = [...activeArticles, ...filteredAdditional];
                    }
                }

                setArticles(activeArticles);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load articles');
                console.error('Failed to fetch articles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <section className="section-articles">
                <div className="container">
                    <div className="section-header">
                        <div className="section-header-titles">
                            <p className="section-pretitle">You already know?</p>
                            <h2 className="section-title">Useful Pet Knowledge</h2>
                        </div>
                        <Link to="/pet-knowledge" className="view-all-link">View more <span>→</span></Link>
                    </div>
                    <div className="articles-loading">Loading articles...</div>
                </div>
            </section>
        );
    }

    if (error || articles.length === 0) {
        return null;
    }

    return (
        <section className="section-articles">
            <div className="container">
                <div className="section-header">
                    <div className="section-header-titles">
                        <p className="section-pretitle">You already know?</p>
                        <h2 className="section-title">Useful Pet Knowledge</h2>
                    </div>
                    <Link to="/articles" className="view-all-link">View more <span>→</span></Link>
                </div>

                <div className="articles-grid">
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
        </section>
    );
};

export default ActiveArticles;