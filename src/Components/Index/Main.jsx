import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../Shared/Card";

const Main = ({ selectedCategory, setSelectedCategory }) => {  // دریافت setSelectedCategory از والد
    const apiUrl = 'http://localhost:1337';

    const [indexData, setIndexData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:1337/api/items?populate=*")
            .then((response) => {
                const data = response.data;
                const categories = data.data.reduce((acc, item) => {
                    const category = item.attributes?.category?.data?.attributes?.name;
                    if (category) {
                        if (!acc[category]) {
                            acc[category] = [];
                        }
                        acc[category].push(item);
                    }
                    return acc;
                }, {});
                setIndexData(categories);
                setLoading(false);
                setError(null);

                // Set default selected category to the first category if available
                const firstCategory = Object.keys(categories)[0];
                if (!selectedCategory && firstCategory) {
                    // If no category is selected, set the first one as default
                    setSelectedCategory(firstCategory);  // ارسال setSelectedCategory از والد
                }
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [selectedCategory, setSelectedCategory]); // استفاده از setSelectedCategory

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Filter items based on the selected category
    const filteredItems = selectedCategory ? indexData[selectedCategory] : [];

    return (
        <div className="col-span-3 h-screen overflow-y-auto px-2 no-scrollbar">
            {/* Display category name only once at the top */}
            {selectedCategory && (
                <div className="flex justify-center items-center bg-custom-color2 rounded-b-[18px]">
                    <h2 className="text-lg font-bold py-2">
                        {selectedCategory}
                    </h2>
                </div>
            )}

            {/* Display items of the selected category */}
            {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                    <div key={item.id} className="mb-6">
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-4">
                                <Card
                                    src={`${apiUrl}${item.attributes?.thumbnail?.data?.attributes?.url}`}
                                    name={item.attributes?.name}
                                    description={item.attributes?.description}
                                    price={item.attributes?.price}
                                    isnew={item.attributes?.new}
                                    instock={!item.attributes?.instock}
                                />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>محصولی جهت نمایش وجود ندارد</p>
            )}
        </div>
    );
};

export default Main;
