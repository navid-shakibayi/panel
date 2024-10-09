import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Popup = () => {
    const [popupData, setPopUpData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(true);
    const [exiting, setExiting] = useState(false);  // برای مدیریت انیمیشن خروج

    const baseURL = 'http://localhost:1337';

    useEffect(() => {
        axios.get(`${baseURL}/api/popup?populate=*`)
            .then(response => {
                setPopUpData(response.data.data);
                setLoading(false);
            }).catch(error => {
                console.error('Error fetching popup:', error);
                Swal.fire('خطا!', 'عدم دسترسی به پاپ آپ.', 'error');
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleClose = () => {
        setExiting(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 500);
    };

    if (loading) return <p>در حال بارگذاری...</p>;
    if (error) return <p>{error.message || 'خطایی رخ داده است'}</p>;

    if (!showPopup || !popupData || !popupData.attributes.isOn) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-custom-color21 bg-opacity-40 z-50`}>
            <div className={`relative bg-custom-color2 bg-opacity-80 p-6 m-4 shadow-lg rounded-md max-w-80 sm:max-w-sm h-auto flex justify-center items-center  ${exiting ? 'popup-exit' : 'popup-enter'}`}>
                <button
                    onClick={handleClose}
                    className="absolute flex items-center justify-center h-6 w-6 -top-2 -right-2 text-white bg-red-500 rounded-full p-2 hover:bg-red-700"
                >
                    &times;
                </button>

                <img
                    src={`${baseURL}${popupData.attributes.image.data.attributes.url}`}
                    alt="پاپ آپ"
                    className="max-h-full max-w-full object-contain"
                />
            </div>
        </div>
    );
};

export default Popup;
