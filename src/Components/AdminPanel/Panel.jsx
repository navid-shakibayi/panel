import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PanelCategorySlider from './PanelCategorySlider';
import PanelIndex from './PanelIndex';

const Panel = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('نوشیدنی گرم');

    useEffect(() => {
        const token = sessionStorage.getItem('jwt');

        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const logout = () => {
        sessionStorage.removeItem('jwt');
        navigate('/login');
    };

    return (
        <section className='bg-custom-color1 max-w-6xl mx-auto px-2'>
            <PanelCategorySlider selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            <div className='flex justify-center'>
                <button
                    className='flex gap-2 justify-center items-center bg-custom-color31 text-center p-2 rounded px-6 sm:px-20'
                    onClick={() => navigate('/panel/create-new-item')}
                >
                    <span className='border-2 border-dashed rounded-full w-5 h-5 flex items-center justify-center font-bold'>+</span>
                    افزودن محصول جدید
                </button>
            </div>

            <PanelIndex selectedCategory={selectedCategory} />

            <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded">خروج از حساب کاربری</button>
        </section>
    );
};

export default Panel;
