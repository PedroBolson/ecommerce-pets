import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BannerShop.css';
import dogsGroupImage from '../../assets/dogs-group.png';
import playCircleIcon from '../../assets/Play-Circle.png';

interface BannerShopProps {
    paths: { name: string; url: string }[];
    onViewIntro?: () => void;
}

const BannerShop: React.FC<BannerShopProps> = ({ paths, onViewIntro }) => {
    const navigate = useNavigate();

    return (
        <div className="banner-shop-container">
            <div className="banner-breadcrumb">
                {paths.map((path, index) => (
                    <React.Fragment key={`${path.name}-${index}`}>
                        {path.url ? (
                            <Link to={path.url}>{path.name}</Link>
                        ) : (
                            <span>{path.name}</span>
                        )}
                        {index < paths.length - 1 && <span className="banner-breadcrumb-separator">›</span>}
                    </React.Fragment>
                ))}
            </div>

            <div className="banner-content">
                <div className="banner-image-container">
                    <img
                        src={dogsGroupImage}
                        alt="Group of different dog breeds"
                        className="banner-dogs-image"
                    />
                </div>

                <div className="banner-overlay-rectangle"></div>

                <div className="banner-text">
                    <h1>One More Friend</h1>
                    <h2>Thousands More Fun!</h2>

                    <p className="banner-description">
                        Having a pet means you have more joy, a new friend, a happy person who will always be with you to have fun. We have 200+ different pets that can meet your needs!
                    </p>

                    <div className="banner-buttons">
                        <button className="banner-btn-view-intro" onClick={onViewIntro}>
                            View Intro
                            <img src={playCircleIcon} alt="Play icon" className="banner-icon-play" />
                        </button>
                        <button
                            className="banner-btn-explore-now"
                            onClick={() => navigate('/dogs')}
                        >
                            Explore Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerShop;