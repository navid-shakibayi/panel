import { useEffect, useState } from "react";
import CategorySlider from "./CategorySlider";
import Popup from "../Popup/Popup";
import Main from "./Main";

const Menu = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null); // State to store selected category

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName); // Update the selected category
    };

    return (
        <>
            {showPopup && <Popup />}
            <section className="grid grid-cols-4 gap-2 max-w-6xl mx-auto">
                {/* ارسال تابع handleCategorySelect به CategorySlider */}
                <CategorySlider onCategorySelect={handleCategorySelect} />
                {/* ارسال selectedCategory و setSelectedCategory به Main */}
                <Main 
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory} 
                />
            </section>
        </>
    );
};

export default Menu;
