import React, { useState, useEffect } from "react";

const PanelCategorySlider = ({ selectedCategory, onSelectCategory }) => {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex gap-2 overflow-y-auto mt-3 mb-6 border-b border-custom-color31 pb-6">
            {categoryData && categoryData.map(item => (
                <div
                    key={item.id}
                    className={`cursor-pointer ${selectedCategory === item.attributes.name ? 'border-t-2 border-custom-color31 rounded-t-xl' : ''}`}
                    onClick={() => onSelectCategory(item.attributes.name)} // به‌روزرسانی دسته‌بندی انتخاب شده
                >
                    <img
                        src={`${apiUrl}${item.attributes.image.data.attributes.url}`}
                        alt={item.attributes.name}
                        className="w-20 h-20 aspect-square bg-custom-color12 p-2 rounded-t-xl max-w-none"
                    />
                    <p className="bg-custom-color3 text-xs p-0.5 w-full text-center text-nowrap font-kalame">{item.attributes.name}</p>
                </div>
            ))}
        </div>
    );
}

export default PanelCategorySlider;
