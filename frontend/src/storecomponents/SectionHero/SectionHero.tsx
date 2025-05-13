import "./SectionHero.css";
import { Link } from "react-router-dom";
import heroImg from "../../assets/Hero-image.png"
import PlayCircle from "../../assets/Play-Circle.png";
export default function SectionHero() {
    return (
        <section className="hero-section">
            <div className="hero-shape-rect1" />
            <div className="hero-shape-rect2" />
            <div className="hero-shape-rect3" />
            <div className="hero-shape-rect4" />
            <div className="hero-shape-rect5" />
            <div className="hero-shape-rect6" />
            <div className="hero-shape-rect7" />
            <div className="hero-shape-rect8" />

            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">One More Friend</h1>
                    <h2 className="hero-subtitle">Thousands More Fun!</h2>
                    <p className="hero-description">
                        Having a pet means you have more joy, a new friend, a happy person
                        who will always be with you to have fun. We have 200+ different pets
                        that can meet your needs!
                    </p>
                    <div className="hero-buttons">
                        <button className="hero-btn-intro">
                            View Intro
                            <img src={PlayCircle} alt="Arrow" className="hero-view-intro" />
                        </button>
                        <Link to="/dogs" className="hero-btn-explore">
                            Explore Now
                        </Link>
                    </div>
                </div>
                <div className="hero-image-container">
                    <img
                        src={heroImg}
                        alt="Person holding a corgi dog"
                        className="hero-image"
                    />
                </div>
            </div>
        </section>
    );
}