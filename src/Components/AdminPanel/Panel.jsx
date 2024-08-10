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
            <button className='bg-custom-color31 w-full text-center p-2' onClick={() => navigate('/panel/create-new-item')}>افزودن محصول جدید</button>
            <PanelIndex selectedCategory={selectedCategory} />
            <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded">خروج از حساب کاربری</button>
        </section>
    );
};

export default Panel;
