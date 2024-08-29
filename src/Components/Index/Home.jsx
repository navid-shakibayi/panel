import { useEffect, useState } from "react";
import CategorySlider from "../Layout/CategorySlider"
import Popup from "../Popup/Popup"
import Main from "./Main"

const Home = ({

}) => {

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return <>
        {showPopup && <Popup />}
        <section className="grid grid-cols-4 gap-2 max-w-6xl mx-auto px-2">

            <CategorySlider />

            <Main />

        </section>
    </>
}

export default Home