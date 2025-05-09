import React from 'react';
import bannerImage from '../../assets/MainPageFirstBanner.png';
import './MainPageFirstBanner.css';

interface MainPageFirstBannerProps {
    title?: string;
    subtitle?: string;
    description?: string;
    onViewIntro?: () => void;
    onExplore?: () => void;
}

const MainPageFirstBanner: React.FC<MainPageFirstBannerProps> = ({
    title = 'One More Friend',
    subtitle = 'Thousands More Fun!',
    description = 'Having a pet means you have more joy, a new friend, a happy person who will always be with you to have fun. We have 200+ different pets that can meet your needs!',
    onViewIntro,
    onExplore
}) => (
    <section className="banner">
        <div className="banner__shape banner__shape--left" />
        <div className="banner__shape banner__shape--right" />
        <div className="banner__content">
            <div className="banner__image-wrapper">
                <img src={bannerImage} alt={title} className="banner__image" />
            </div>
            <div className="banner__text-wrapper">
                <h1 className="banner__title">{title}</h1>
                <h2 className="banner__subtitle">{subtitle}</h2>
                <p className="banner__text">{description}</p>
                <div className="banner__actions">
                    <button className="banner-btn btn--outline" onClick={onViewIntro}>
                        View Intro
                        <img className="btn__icon" src='/src/assets/Play-Circle.png' />

                    </button>
                    <button className="banner-btn btn--solid" onClick={() => {
                        if (onExplore) onExplore();
                        window.location.href = '/dogs';
                    }}>
                        Explore Now
                    </button>
                </div>
            </div>
        </div>
    </section>
);

export default MainPageFirstBanner;