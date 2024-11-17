import { useEffect, useState } from "react";

const CategorySlider = ({ onCategorySelect }) => {
    const apiUrl = 'http://localhost:1337';

    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:1337/api/categories?populate=*')
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex flex-col gap-2 h-lvh overflow-y-auto bg-custom-color2 ps-2">
            {categoryData && categoryData.map(item => (
                <div
                    key={item.id}
                    onClick={() => onCategorySelect(item.attributes.name)} // Pass selected category
                    className="cursor-pointer"
                >
                    <img
                        src={`${apiUrl}${item.attributes.image.data.attributes.url}`}
                        alt={item.attributes.name}
                        className="w-24 aspect-square p-4"
                    />
                </div>
            ))}
        </div>
    );
};

export default CategorySlider;
