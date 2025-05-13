import Header from "../../../storecomponents/Header/Header";
import RandomDogs from "../../../storecomponents/RandomDogs/RandomDogs";
import SectionHero from "../../../storecomponents/SectionHero/SectionHero";
import MainPageFirstBanner from "../../../storecomponents/MainPageFirstBanner/MainPageFirstBanner";
import "./MainPage.css";
import Footer from "../../../storecomponents/Footer/Footer";
import RandomProducts from "../../../storecomponents/RandomProducts/RandomProducts";
import PetSellers from "../../../storecomponents/PetSellers/PetSellers";
import MainPageSecondBanner from "../../../storecomponents/MainPageSecondBanner/MainPageSecondBanner";
import ActiveArticles from "../../../storecomponents/ActiveArticles/ActiveArticles";

function MainPage() {
    return (
        <>
            <Header />
            <SectionHero />
            <RandomDogs />
            <MainPageFirstBanner />
            <RandomProducts />
            <PetSellers />
            <MainPageSecondBanner />
            <ActiveArticles />
            <Footer />
        </>
    );
}

export default MainPage;