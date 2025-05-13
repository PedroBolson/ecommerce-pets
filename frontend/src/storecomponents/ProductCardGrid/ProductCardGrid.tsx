import React from 'react';
import ProductCard, { Product } from '../ProductCard/ProductCard';
import './ProductCardGrid.css';

interface ProductCardGridProps {
    products: Product[];
    columns?: number;
    maxItems?: number;
}

const ProductCardGrid: React.FC<ProductCardGridProps> = ({
    products,
    columns = 4,
    maxItems
}) => {
    const displayProducts = maxItems ? products.slice(0, maxItems) : products;

    return (
        <div className={`product-card-grid columns-${columns}`}>
            {displayProducts.map(product => (
                <div key={product.id} className="product-card-grid-item">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default ProductCardGrid;