import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { useCurrency } from '../../context/CurrencyContext';

export interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    inStock: boolean;
    size: number;
    images?: {
        id: string;
        url: string;
        altText?: string;
        displayOrder?: number;
    }[];
    category: {
        id: string;
        name: string;
    };
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { formatPrice } = useCurrency();
    const formattedPrice = formatPrice(product.price);

    const displayImage = product.images && product.images.length > 0
        ? [...product.images].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))[0].url
        : 'https://via.placeholder.com/300x300?text=No+Image';

    const m = product.sku.match(/^([A-Z]{2,3})-(\d{4,5})$/);
    const productCode = m
        ? `${m[1]}${parseInt(m[2], 10)}`
        : product.sku.replace('-', '');

    return (
        <Link to={`/products/${product.id}`} className="product-card">
            <div className="product-card-image">
                <img
                    src={displayImage}
                    alt={product.name}
                />
            </div>
            <div className="product-card-info">
                <h3 className="product-code-name">
                    {productCode} – <span className="product-card-name">{product.name}</span>
                </h3>
                <div className="product-details">
                    <p className="product-category-size">
                        <span className="product-category">{product.category.name}</span>
                        <span className="product-size">
                            {product.size > 0
                                ? (product.size >= 1000
                                    ? `${(product.size / 1000).toFixed(1).replace(/\.0$/, '')}kg`
                                    : `${product.size}g`)
                                : ''}
                        </span>                    </p>
                    <p className="product-stock-status">
                        {product.inStock ? (
                            <><span className="product-stock-pill"></span> In stock</>
                        ) : (
                            <><span className="product-stock-pill product-out-of-stock"></span> Out of stock</>
                        )}
                    </p>
                </div>
                <p className="product-price">{formattedPrice}</p>
            </div>
        </Link>
    );
};

export default ProductCard;