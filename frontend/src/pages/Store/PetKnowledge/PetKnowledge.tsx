import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../storecomponents/Header/Header';
import Footer from '../../../storecomponents/Footer/Footer';
import ArticleCardGrid from '../../../storecomponents/ArticleCardGrid/ArticleCardGrid';
import { API_CONFIG } from '../../../config/api.config';
import './PetKnowledge.css';

interface Breed {
    id: string;
    name: string;
}

interface PetKnowledgeArticle {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl?: string;
    category: string;
    createdAt: Date;
    isActive: boolean;
    breed?: Breed;
}

const PetKnowledgeArticle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<PetKnowledgeArticle | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_CONFIG.baseUrl}/pet-knowledge/${id}`);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setArticle(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load article');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchArticle();
        }
    }, [id]);

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="article-container">
                    <div className="article-loading">Loading article...</div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !article) {
        return (
            <>
                <Header />
                <div className="article-container">
                    <div className="article-error">
                        <h2>Sorry, we couldn't load this article</h2>
                        <p>{error || 'Article not found'}</p>
                        <Link to="/pet-knowledge" className="article-back-btn">Back to Pet Knowledge</Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>

            <Header />

            <main className="article-container">
                <div className="article-breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb-separator">›</span>
                    <Link to="/articles">Pet Knowledge</Link>
                    <span className="breadcrumb-separator">›</span>
                    <Link to={`/articles?category=${article.category}`}>{article.category}</Link>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-current">{article.title}</span>
                </div>

                <article className="article-content-wrapper">
                    <header className="article-header">
                        <h1 className="article-title">{article.title}</h1>

                        <div className="article-meta">
                            <div className="article-meta-item category-badge">{article.category}</div>
                            {article.breed && (
                                <div className="article-meta-item breed-badge">
                                    <Link to={`/breed/${article.breed.id}`}>
                                        {article.breed.name}
                                    </Link>
                                </div>
                            )}
                            <div className="article-meta-item date">{formatDate(article.createdAt)}</div>
                        </div>
                    </header>

                    {article.imageUrl && (
                        <div className="article-featured-image">
                            <img src={article.imageUrl} alt={article.title} />
                            {article.breed && (
                                <div className="image-caption">
                                    Featured: {article.breed.name}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="article-summary">{article.summary}</div>

                    <div
                        className="article-body"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <div className="article-tags">
                        <span className="tag-label">Related Topics:</span>
                        <Link to={`/articles?category=${article.category}`} className="article-tag" onClick={() => window.scrollTo(0, 0)}>
                            {article.category}
                        </Link>
                        {article.breed && (
                            <Link to="" className="article-tag">
                                {article.breed.name}
                            </Link>
                        )}
                        <span className="article-tag">Pet Tips</span>
                    </div>

                    <div className="article-sharing">
                        <h3>Share this article:</h3>
                        <div className="article-sharing-buttons">
                            <div className='article-sharing-icons'>
                                <button aria-label="Share on Facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                                        <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z"></path>
                                    </svg>

                                </button>
                                <button aria-label="Share on Twitter">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                                        <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z"></path>
                                    </svg>
                                </button>
                                <button aria-label="Share on Instagram">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                                        <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
                                    </svg>
                                </button>
                                <button aria-label="Share on YouTube">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                                        <path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                <ArticleCardGrid
                    columns={3}
                    count={3}
                    category={article.category}
                    excludeIds={[article.id]}
                    title="You might also like"
                />
            </main>

            <Footer />
        </>
    );
};

export default PetKnowledgeArticle;