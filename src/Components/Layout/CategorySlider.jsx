import { useEffect, useState } from "react";

const CategorySlider = () => {
    const apiUrl = 'https://rad-cafe-api.chbk.run';

    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://rad-cafe-api.chbk.run/api/categories?populate=*')
            .then(res => res.json())
            .then(data => {
                setCategoryData(data.data);
                setLoading(false);
                setError(null);
            }).catch(err => {
                setLoading(false);
                setError(err.message);
            });
    }, []);

    const handleScrollToCategory = (categoryName) => {
        const element = document.getElementById(categoryName);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex flex-col gap-2 h-lvh overflow-y-auto mt-3 border-8 border-custom-color12 bg-custom-color12 rounded-xl">
            {categoryData && categoryData.map(item => (
                <div
                    key={item.id}
                    onClick={() => handleScrollToCategory(item.attributes.name)}
                    className="cursor-pointer"
                >
                    <img
                        src={`${apiUrl}${item.attributes.image.data.attributes.url}`}
                        alt={item.attributes.name}
                        className="w-24 aspect-square bg-custom-color1 p-4 rounded-t-xl"
                    />
                    <p className="bg-custom-color3 text-xs py-1 w-full text-center text-nowrap font-kalame rounded-b-lg">{item.attributes.name}</p>
                </div>
            ))}
        </div>
    );
};

export default CategorySlider;
