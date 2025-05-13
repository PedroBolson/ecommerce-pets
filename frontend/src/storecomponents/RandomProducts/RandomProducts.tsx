import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_CONFIG } from '../../config/api.config';
import ProductCardGrid from '../ProductCardGrid/ProductCardGrid';
import './RandomProducts.css';

interface ProductCardData {
    id: string;
    sku: string;
    name: string;
    category: { id: string; name: string };
    size: number;
    price: number;
    images: { id: string; url: string; altText?: string; displayOrder?: number; }[];
    rating?: number;
    inStock: boolean;
}

interface ApiProduct {
    id: string;
    sku: string;
    name: string;
    size: number;
    category: { id: string; name: string };
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    images?: string[];
    rating?: number;
}

interface ApiResponse {
    data: ApiProduct[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

const RandomProducts: React.FC = () => {
    const [randomProducts, setRandomProducts] = useState<ProductCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_CONFIG.baseUrl}/store-item?limit=16`);
                if (!res.ok) throw new Error(`Error: ${res.status}`);
                const body: ApiResponse = await res.json();

                // Shuffle products array
                const shuffled = [...body.data].sort(() => 0.5 - Math.random());
                // Take first 8 products
                const selectedProducts = shuffled.slice(0, 8);

                const mapped: ProductCardData[] = selectedProducts.map(p => {
                    let processedImages;

                    if (p.images) {
                        if (typeof p.images[0] === 'string') {
                            processedImages = p.images.map((img: string, index: number) => ({
                                id: `img-${p.id}-${index}`,
                                url: img,
                                altText: `${p.name} image ${index + 1}`,
                                displayOrder: index
                            }));
                        } else {
                            processedImages = (p.images as any[]).map((img: any, index: number) => ({
                                id: img.id || `img-${p.id}-${index}`,
                                url: img.url || img,
                                altText: img.altText || `${p.name} image ${index + 1}`,
                                displayOrder: img.displayOrder || index
                            }));
                        }
                    } else if (p.imageUrl) {
                        processedImages = [{
                            id: `img-${p.id}-0`,
                            url: p.imageUrl,
                            altText: `${p.name} image`,
                            displayOrder: 0
                        }];
                    } else {
                        processedImages = [{
                            id: `img-${p.id}-placeholder`,
                            url: 'https://placehold.co/400x400?text=No+Image',
                            altText: `No image for ${p.name}`,
                            displayOrder: 0
                        }];
                    }

                    return {
                        id: p.id,
                        sku: p.sku,
                        name: p.name,
                        size: p.size,
                        category: p.category,
                        price: p.price,
                        images: processedImages,
                        rating: p.rating,
                        inStock: p.stock > 0
                    };
                });

                setRandomProducts(mapped);
            } catch (e: any) {
                console.error(e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomProducts();
    }, []);

    return (
        <div className="random-products-section">
            <div className="random-products-header">
                <div className='random-products-header-left'>
                    <p className="random-products-description">Hard to choose right products for your pets?</p>
                    <h2>Our Products</h2>
                </div>
                <div className='random-products-header-right'>
                    <Link to="/products" className="random-products-button">
                        <p>View More</p>
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33337 6.66666L11.6667 9.99999L8.33337 13.3333" stroke="#003459" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>
            {loading ? (
                <div className="random-products-loading">Loading products...</div>
            ) : error ? (
                <div className="random-products-error">Unable to load products</div>
            ) : (
                <ProductCardGrid products={randomProducts} columns={4} maxItems={8} />
            )}
        </div>
    );
};

export default RandomProducts;