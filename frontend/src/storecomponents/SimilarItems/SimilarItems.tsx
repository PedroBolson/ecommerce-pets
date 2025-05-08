import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCardGrid from '../ProductCardGrid/ProductCardGrid';
import { API_CONFIG } from '../../config/api.config';
import './SimilarItems.css';
import { Product } from '../ProductCard/ProductCard';

interface ApiProduct {
    id: string;
    sku: string;
    name: string;
    description?: string;
    price: string;
    stock: number;
    category: {
        id: string;
        name: string;
        description?: string;
    };
    images?: {
        id: string;
        url: string;
        altText?: string;
        displayOrder?: number;
    }[];
}

interface ApiResponse {
    data: ApiProduct[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

interface SimilarItemsProps {
    categoryId: string;
    currentProductId: string;
    title?: string;
}

const SimilarItems: React.FC<SimilarItemsProps> = ({
    categoryId,
    currentProductId
}) => {
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            try {
                setLoading(true);

                const fetchProductsByCategory = async (categoryId: string) => {
                    const res = await fetch(`${API_CONFIG.baseUrl}/store-item?categoryId=${categoryId}`);
                    if (!res.ok) throw new Error(`Error: ${res.status}`);
                    return res.json();
                };

                const fetchAllProducts = async () => {
                    const allRes = await fetch(`${API_CONFIG.baseUrl}/store-item`);
                    if (!allRes.ok) throw new Error(`Error: ${allRes.status}`);
                    return allRes.json();
                };

                const categoryResponse: ApiResponse = await fetchProductsByCategory(categoryId);
                let list = categoryResponse.data?.filter(p => p.id !== currentProductId) || [];

                if (list.length < 4) {
                    const allProductsResponse: ApiResponse = await fetchAllProducts();
                    const extraProducts = allProductsResponse.data?.filter(p =>
                        p.id !== currentProductId && !list.some(x => x.id === p.id)
                    ) || [];

                    list = [...list, ...extraProducts].slice(0, 4);
                } else {
                    list = list.slice(0, 4);
                }

                const mappedProducts: Product[] = list.map(p => ({
                    id: p.id,
                    sku: p.sku,
                    name: p.name,
                    price: parseFloat(p.price),
                    inStock: p.stock > 0,
                    images: p.images || [],
                    category: {
                        id: p.category.id,
                        name: p.category.name
                    }
                }));

                setSimilarProducts(mappedProducts);
            } catch (e: any) {
                console.error(e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarProducts();
    }, [categoryId, currentProductId]);

    return (
        <div className="similar-items-section">
            <div className="similar-items-header">
                <h2>What's new?</h2>
                <Link to="/products" className="see-more-link">See More Products</Link>
            </div>
            {loading ? (
                <div className="similar-items-loading">Loading similar products...</div>
            ) : error ? (
                <div className="similar-items-error">Unable to load similar products</div>
            ) : similarProducts.length === 0 ? (
                <div className="similar-items-empty">No similar products found</div>
            ) : (
                <ProductCardGrid products={similarProducts} columns={4} maxItems={4} />
            )}
        </div>
    );
};

export default SimilarItems;