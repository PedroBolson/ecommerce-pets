import React, { useMemo } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './ProductImagesCarousel.css';

interface ProductImage {
    id: string;
    url: string;
    altText?: string;
}

interface ProductImagesCarouselProps {
    images: ProductImage[];
    productName: string;
}

const ProductImagesCarousel: React.FC<ProductImagesCarouselProps> = ({
    images,
    productName,
}) => {
    const slides = useMemo<ReactImageGalleryItem[]>(() => {
        const list = images.length
            ? images
            : [{ id: 'def', url: 'https://via.placeholder.com/600x400?text=No+Image', altText: 'No image' }];
        return list.map(img => ({
            original: img.url,
            thumbnail: img.url,
            originalAlt: img.altText ?? productName,
            thumbnailAlt: img.altText ?? `${productName} thumb`,
        }));
    }, [images, productName]);

    return (
        <div className="product-images-carousel">
            <ImageGallery
                items={slides}
                showPlayButton={false}
                showFullscreenButton={false}
                showNav={true}
                autoPlay={true}
                showThumbnails={true}
                thumbnailPosition="bottom"
                renderLeftNav={(onClick, disabled) => (
                    <button
                        className="custom-nav custom-nav--left"
                        onClick={onClick}
                        disabled={disabled}
                    >
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="5" width="42" height="42" rx="20" fill="white" fillOpacity="0.4" />
                            <path d="M28.1667 32.5L21.6667 26L28.1667 19.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
                renderRightNav={(onClick, disabled) => (
                    <button
                        className="custom-nav custom-nav--right"
                        onClick={onClick}
                        disabled={disabled}
                    >
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="42" height="42" rx="20" transform="matrix(-1 0 0 1 47 5)" fill="white" fillOpacity="0.4" />
                            <path d="M23.8335 32.5L30.3335 26L23.8335 19.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
                slideDuration={300}
                slideInterval={5000}
            />
        </div>
    );
};

export default React.memo(ProductImagesCarousel);