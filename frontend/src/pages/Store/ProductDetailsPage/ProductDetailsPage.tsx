import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from '../../../storecomponents/ProductDetails/ProductDetails';
import './ProductDetailsPage.css';
import Header from '../../../storecomponents/Header/Header';
import Footer from '../../../storecomponents/Footer/Footer';
import { API_CONFIG } from '../../../config/api.config';
import SimilarItems from '../../../storecomponents/SimilarItems/SimilarItems';

interface ApiProduct {
    id: string;
    sku: string;
    name: string;
    description?: string;
    price: string;
    stock: number;
    size: number;
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

interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    size: number;
    category: {
        id: string;
        name: string;
    };
    price: number;
    inStock: boolean;
    stockQuantity?: number;
}

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const res = await fetch(`${API_CONFIG.baseUrl}/store-item/${id}`, {
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const apiData: ApiProduct = await res.json();

                console.log("API Response:", apiData);

                const adaptedProduct: Product = {
                    id: apiData.id,
                    sku: apiData.sku,
                    name: apiData.name,
                    description: apiData.description,
                    size: apiData.size,
                    category: {
                        id: apiData.category.id,
                        name: apiData.category.name,
                    },
                    price: parseFloat(apiData.price),
                    inStock: apiData.stock > 0,
                    stockQuantity: apiData.stock,
                };

                if (apiData.images && apiData.images.length > 0) {
                    setImages(apiData.images);
                }

                setProduct(adaptedProduct);
            } catch (err) {
                console.error("Erro ao carregar produto:", err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div className="product-details-loading">Carregando...</div>;
    if (error) return <div className="product-details-error">Erro: {error}</div>;
    if (!product) return <div className="product-details-not-found">Produto não encontrado</div>;

    return (
        <>
            <Header />
            <div className="product-details-page">
                <div className="product-details-container">
                    <ProductDetails product={product} preloadedImages={images} />
                </div>

                {product && (
                    <SimilarItems
                        categoryId={product.category.id}
                        currentProductId={product.id}
                        title={`Similar ${product.category.name} Products`}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default ProductDetailsPage;