import { useEffect, useState } from "react";

const CategorySlider = ({ onCategorySelect }) => {
    const apiUrl = 'http://localhost:1337';

    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category

    useEffect(() => {
        fetch('http://localhost:1337/api/categories?populate=*')
            .then(res => res.json())
            .then(data => {
                setCategoryData(data.data);
                setLoading(false);
                setError(null);

                // Set the first category as selected by default
                if (data.data && data.data.length > 0) {
                    setSelectedCategory(data.data[0].attributes.name);
                    onCategorySelect(data.data[0].attributes.name); // Pass selected category to parent
                }
            }).catch(err => {
                setLoading(false);
                setError(err.message);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName); // Set the clicked category as selected
        onCategorySelect(categoryName); // Pass selected category to parent
    };

    return (
        <div className="flex flex-col gap-2 h-lvh overflow-y-auto bg-custom-color2 ps-2 no-scrollbar pt-4 overflow-x-hidden">
            {categoryData && categoryData.map(item => (
                <div
                    key={item.id}
                    onClick={() => handleCategoryClick(item.attributes.name)} // Handle click
                    className={`flex justify-center cursor-pointer p-2 transition-all duration-700 relative`}
                >
                    <div
                        className={`absolute inset-0 bg-custom-color1 rounded-s-[20px] shadow-xl transition-all duration-700 transform ${selectedCategory === item.attributes.name ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    ></div>
                    <img
                        src={`${apiUrl}${item.attributes.image.data.attributes.url}`}
                        alt={item.attributes.name}
                        className="w-10 aspect-square z-10"
                    />
                </div>
            ))}
        </div>
    );
};

export default CategorySlider;
