import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ProductDetails.css';
import { useCurrency } from '../../context/CurrencyContext';
import { API_CONFIG } from '../../config/api.config';
import ProductImagesCarousel from './ProductImagesCarousel';

interface ProductImage {
    id: string;
    url: string;
    altText?: string;
    displayOrder?: number;
}

interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: {
        id: string;
        name: string;
    };
    price: number;
    inStock: boolean;
    stockQuantity?: number;
}

const ProductDetails: React.FC<{ product: Product, preloadedImages?: ProductImage[] }> = ({ product, preloadedImages = [] }) => {
    const [images, setImages] = useState<ProductImage[]>(preloadedImages);
    const [loadingImgs, setLoadingImgs] = useState(preloadedImages.length === 0);

    const { formatPrice } = useCurrency();

    useEffect(() => {
        if (preloadedImages.length > 0) {
            setImages(preloadedImages);
            setLoadingImgs(false);
            return;
        }

        (async () => {
            try {
                setLoadingImgs(true);
                const res = await fetch(`${API_CONFIG.baseUrl}/store-item/${product.id}/images`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error(`Fetch images failed: ${res.status}`);
                const productData: { images: ProductImage[] } = await res.json();
                setImages(productData.images || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingImgs(false);
            }
        })();
    }, [product.id, preloadedImages]);

    const sortedImages = useMemo(
        () =>
            [...images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
        [images]
    );

    return (
        <>
            <div className="product-details">
                <div className="product-details-grid">
                    <div className="product-images-section">
                        {loadingImgs ? (
                            <div>Loading images…</div>
                        ) : (
                            <ProductImagesCarousel images={sortedImages} productName={product.name} />
                        )}

                        <div className="product-guarantee">
                            <div className="product-guarantee-badge">
                                <img width="25" height="25" src="https://img.icons8.com/color/48/guarantee.png" alt="guarantee" />
                                <span>100% quality guarantee</span>
                            </div>
                            <div className="product-guarantee-badge">
                                <img width="25" height="25" src="https://img.icons8.com/fluency/48/in-transit.png" alt="in-transit" />
                                <span>Fast shipping</span>
                            </div>
                        </div>

                        <div className="product-share">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#d11c1c" d="M12,31c-3.9,0-7-3.1-7-7c0-3.9,3.1-7,7-7s7,3.1,7,7C19,27.9,15.9,31,12,31z M12,20c-2.2,0-4,1.8-4,4 c0,2.2,1.8,4,4,4s4-1.8,4-4C16,21.8,14.2,20,12,20z"></path><path fill="#d11c1c" d="M36,19c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S39.9,19,36,19z M36,8c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4 S38.2,8,36,8z"></path><path fill="#d11c1c" d="M36,43c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S39.9,43,36,43z M36,32c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4 S38.2,32,36,32z"></path><circle cx="12" cy="24" r="5.5" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="3"></circle><circle cx="36" cy="12" r="5.5" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="3"></circle><circle cx="36" cy="36" r="5.5" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="3"></circle><line x1="16.9" x2="31.1" y1="21.5" y2="14.5" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="3"></line><line x1="16.9" x2="31.1" y1="26.5" y2="33.5" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="3"></line>
                            </svg>
                            <span>Share:</span>
                            <div className="product-share-icons">
                                <button aria-label="Share on Facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                        <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z"></path>
                                    </svg>

                                </button>
                                <button aria-label="Share on Twitter">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                        <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z"></path>
                                    </svg>
                                </button>
                                <button aria-label="Share on Instagram">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                                        <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
                                    </svg>
                                </button>
                                <button aria-label="Share on YouTube">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                                        <path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="product-info-section">
                        <div className="product-header">
                            <div className="product-breadcrumb">
                                <Link to="/">Home</Link>
                                <span className="breadcrumb-separator">&gt;</span>
                                <Link to="/products">Products</Link>
                                <span className="breadcrumb-separator">&gt;</span>
                                <Link to={`/products?category=${product.category.id}`}>{product.category.name}</Link>
                                <span className="breadcrumb-separator">&gt;</span>
                                <span className="breadcrumb-current">{product.name}</span>
                            </div>
                            <div className="product-sku">SKU: #{product.sku}</div>
                            <h1 className="product-name">{product.name}</h1>
                            <div className="product-price">{formatPrice(product.price)}</div>
                            <div className="product-actions">
                                <button className="product-btn-contact">Contact us</button>
                                <button className="product-btn-chat">
                                    <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 14.8V7.19995V7.19666C21 6.07875 21 5.51945 20.7822 5.09204C20.5905 4.71572 20.2841 4.40973 19.9078 4.21799C19.48 4 18.9203 4 17.8002 4H6.2002C5.08009 4 4.51962 4 4.0918 4.21799C3.71547 4.40973 3.40973 4.71572 3.21799 5.09204C3 5.51986 3 6.07985 3 7.19995V18.671C3 19.7367 3 20.2696 3.21846 20.5432C3.40845 20.7813 3.69644 20.9197 4.00098 20.9194C4.35115 20.919 4.76744 20.5861 5.59961 19.9203L7.12357 18.7012C7.44844 18.4413 7.61084 18.3114 7.79172 18.219C7.95219 18.137 8.12279 18.0771 8.29932 18.0408C8.49829 18 8.70652 18 9.12256 18H17.8001C18.9202 18 19.48 18 19.9078 17.782C20.2841 17.5902 20.5905 17.2844 20.7822 16.908C21 16.4806 21 15.9212 21 14.8032V14.8Z" stroke="#002A48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Chat with monito
                                </button>
                            </div>
                        </div>

                        <div className="product-specifications">
                            <div className="spec-item">
                                <span className="spec-label">SKU</span>
                                <span className="spec-value">: #{product.sku}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">In Stock</span>
                                <span className="spec-value">: {product.inStock ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Category</span>
                                <span className="spec-value">: {product.category.name}</span>
                            </div>
                        </div>

                        {product.description && (
                            <div className="product-description">
                                <h3>Description</h3>
                                <p>{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;