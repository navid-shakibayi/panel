import { useEffect, useState } from "react"
import axios from "axios";
import Card from "../Shared/Card";

const Main = () => {
    const apiUrl = 'http://localhost:1337'

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
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="col-span-3 h-screen overflow-y-auto mt-3 ps-2">
            {indexData &&
                Object.keys(indexData).map((category) => (
                    <div key={category} className="mb-6">
                        <div className="relative h-12 flex justify-center items-center w-full overflow-hidden text-base text-center font-bold mb-2 rounded-t-[30px] pt-5 pb-3 border-t border-custom-color3 bg-gradient-to-b from-custom-color13 to-custom-color1 before:absolute before:bg-[conic-gradient(transparent,transparent,#FCF6BA)] before:h-2 before:w-full before:animate-spin-slow">
                            <h2
                                id={category}
                                className="absolute top-[2px] left-[2px] right-[2px] text-base text-center font-bold mb-2 rounded-t-[30px] pt-5 pb-3 border-t border-none bg-gradient-to-b from-custom-color13 to-custom-color1"
                            >
                                {category}
                            </h2>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                            {indexData[category].map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4"
                                >
                                    <Card
                                        src={`${apiUrl}${item.attributes?.thumbnail?.data?.attributes?.url}`}
                                        name={item.attributes?.name}
                                        description={item.attributes?.description}
                                        price={item.attributes?.price}
                                        isnew={item.attributes?.new}
                                        instock={!item.attributes?.instock}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default Main;
