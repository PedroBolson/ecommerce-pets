import Header from "../../../storecomponents/Header/Header";
import RandomDogs from "../../../storecomponents/RandomDogs/RandomDogs";
import SectionHero from "../../../storecomponents/SectionHero/SectionHero";
import MainPageFirstBanner from "../../../storecomponents/MainPageFirstBanner/MainPageFirstBanner";
import "./MainPage.css";

function MainPage() {
    return (
        <>
            <Header />
            <SectionHero />
            <RandomDogs />
            <MainPageFirstBanner />
        </>
    );
}

export default MainPage;