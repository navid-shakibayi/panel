import axios from "axios";
import { useEffect, useState } from "react";
import PanelCard from "./PanelCard";

const PanelIndex = ({ selectedCategory }) => {
    const apiUrl = 'https://rad-cafe-api.chbk.run';

    const [indexData, setIndexData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("https://rad-cafe-api.chbk.run/api/items?populate=*")
            .then((response) => {
                const data = response.data;
                const categories = data.data.reduce((acc, item) => {
                    const category = item.attributes.category?.data?.attributes?.name;
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
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleDelete = (id) => {
        setIndexData((prevData) => {
            const newData = { ...prevData };
            for (const category in newData) {
                newData[category] = newData[category].filter(item => item.id !== id);
            }
            return newData;
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="">
                {indexData && selectedCategory && (
                    <div className="mb-6">
                        <h2
                            id={selectedCategory}
                            className="text-base text-center font-bold mb-2 rounded-t-[30px] pt-5 pb-3 border-t border-custom-color3 bg-gradient-to-b from-custom-color13 to-custom-color1"
                        >
                            {selectedCategory}
                        </h2>

                        <div className="flex flex-col gap-2 mt-4">
                            {indexData[selectedCategory]?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4"
                                >
                                    <PanelCard
                                        id={item.id}
                                        src={`${apiUrl}${item.attributes.thumbnail?.data?.attributes?.url}`}
                                        name={item.attributes.name}
                                        description={item.attributes.description}
                                        price={item.attributes.price}
                                        isnew={item.attributes.new}
                                        instock={!item.attributes.instock}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default PanelIndex;
