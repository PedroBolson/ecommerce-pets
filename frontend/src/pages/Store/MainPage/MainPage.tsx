import Header from "../../../storecomponents/Header/Header";
import RandomDogs from "../../../storecomponents/RandomDogs/RandomDogs";
import SectionHero from "../../../storecomponents/SectionHero/SectionHero";
import MainPageFirstBanner from "../../../storecomponents/MainPageFirstBanner/MainPageFirstBanner";
import "./MainPage.css";
import Footer from "../../../storecomponents/Footer/Footer";

function MainPage() {
    return (
        <>
            <Header />
            <SectionHero />
            <RandomDogs />
            <MainPageFirstBanner />
            <Footer />
        </>
    );
}

export default MainPage;