import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { API_CONFIG } from '../../config/api.config';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import './AdoptionPhoto.css';

interface AdoptionPhotoProps {
    title?: string;
    breedId?: string;
}

interface PhotoItem {
    id: string;
    url: string;
    altText?: string;
    displayOrder?: number;
}

const fetchAdoptionPhotos = async (breedId?: string) => {
    const url = breedId
        ? `${API_CONFIG.baseUrl}/adoption-photos/breed/${breedId}`
        : `${API_CONFIG.baseUrl}/adoption-photos`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return data;
};

const AdoptionPhoto: React.FC<AdoptionPhotoProps> = ({
    title = "Our lovely customer",
    breedId
}) => {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await fetchAdoptionPhotos(breedId);
                setPhotos(data.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)));
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [breedId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!photos.length) return null;

    return (
        <div className="adoption-photo-section">
            <h2 className="adoption-title">{title}</h2>
            <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={4.5}
                spaceBetween={15}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true, bulletClass: 'swiper-pagination-bullet', bulletActiveClass: 'swiper-pagination-bullet-active' }}
                breakpoints={{
                    480: { slidesPerView: 1.5 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4.5 }
                }}
            >
                {photos.map(photo => (
                    <SwiperSlide key={photo.id}>
                        <img
                            src={photo.url}
                            alt={photo.altText || ''}
                            className="adoption-swiper-img"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default AdoptionPhoto;