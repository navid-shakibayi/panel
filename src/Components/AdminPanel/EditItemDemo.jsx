import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Switch from 'react-switch';

const EditItemDemo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        thumbnail: null,
        gallery: [],
        instock: true,
        new: false,
        category: ''
    });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('jwt');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://rad-cafe-api.chbk.run/api/categories?populate=*', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                Swal.fire('خطا!', 'عدم دسترسی به دسته‌بندی‌ها.', 'error');
            }
        };

        const fetchItem = async () => {
            try {
                const response = await axios.get(`https://rad-cafe-api.chbk.run/api/items/${id}?populate=*`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const item = response.data.data;
                setFormData({
                    name: item?.attributes?.name || '',
                    description: item?.attributes?.description || '',
                    price: item?.attributes?.price || '',
                    instock: item?.attributes?.instock || false,
                    new: item?.attributes?.new || false,
                    category: item?.attributes?.category?.data?.id || '',
                    thumbnail: item?.attributes?.thumbnail || null,
                    gallery: item?.attributes?.gallery?.data || []
                });

                if (item?.attributes?.thumbnail?.data?.attributes?.url) {
                    setThumbnailPreview(`https://rad-cafe-api.chbk.run${item.attributes.thumbnail.data.attributes.url}`);
                }

                const galleryUrls = item?.attributes?.gallery?.data?.map(file => `https://rad-cafe-api.chbk.run${file.attributes.url}`) || [];
                setGalleryPreviews(galleryUrls);
            } catch (error) {
                console.error('Error fetching item:', error);
                Swal.fire('خطا!', 'عدم دسترسی به اطلاعات محصول.', 'error');
            }
        };

        fetchCategories();
        fetchItem();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        setFormData({
            ...formData,
            [name]: file
        });
        if (file) {
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prevFormData => ({
            ...prevFormData,
            gallery: [...prevFormData.gallery, ...files]
        }));
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const handleRemoveImage = (index) => {
        const newGallery = [...formData.gallery];
        newGallery.splice(index, 1);
        const newGalleryPreviews = [...galleryPreviews];
        newGalleryPreviews.splice(index, 1);
        setFormData({
            ...formData,
            gallery: newGallery
        });
        setGalleryPreviews(newGalleryPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = sessionStorage.getItem('jwt');

            let thumbnailId = formData.thumbnail?.id || null;
            let galleryIds = formData.gallery.filter(file => typeof file === 'number');

            if (formData.thumbnail && formData.thumbnail !== thumbnailId) {
                const thumbnailData = new FormData();
                thumbnailData.append('files', formData.thumbnail);

                const thumbnailResponse = await axios.post('https://rad-cafe-api.chbk.run/api/upload', thumbnailData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                thumbnailId = thumbnailResponse.data[0].id;
            }

            if (formData.gallery.length > 0) {
                const galleryFiles = formData.gallery.filter(file => typeof file !== 'number');
                if (galleryFiles.length > 0) {
                    const galleryData = new FormData();
                    galleryFiles.forEach(file => galleryData.append('files', file));

                    const galleryResponse = await axios.post('https://rad-cafe-api.chbk.run/api/upload', galleryData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    galleryIds = galleryIds.concat(galleryResponse.data.map(file => file.id));
                }
            }

            const updatedItem = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                instock: formData.instock,
                new: formData.new,
                category: formData.category,
                thumbnail: thumbnailId,
                gallery: galleryIds.length > 0 ? galleryIds : formData.gallery
            };

            await axios.put(`https://rad-cafe-api.chbk.run/api/items/${id}`, { data: updatedItem }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire('موفقیت!', 'محصول با موفقیت ویرایش شد.', 'success');
            navigate('/panel');
        } catch (error) {
            console.error('Error updating item:', error);
            Swal.fire('خطا!', 'خطایی در ویرایش محصول رخ داد.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-custom-color1">
            <button onClick={() => navigate(-1)} className="text-sm mb-4 bg-custom-color3 text-custom-color2 py-2 px-4 rounded hover:bg-custom-color31 transition">بازگشت به صفحه قبل</button>
            <form onSubmit={handleSubmit} className="bg-custom-color12 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">نام محصول</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 focus:outline-none focus:border-custom-color4"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">توضیحات محصول</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 focus:outline-none focus:border-custom-color4"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">قیمت محصول</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 focus:outline-none focus:border-custom-color4"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">تصویر اصلی محصول</label>
                    <div className="border-2 border-dashed border-custom-color21 rounded-lg p-4 flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-custom-color2 relative">
                        <input
                            type="file"
                            name="thumbnail"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="max-h-40" />
                        ) : (
                            <span className="text-2xl text-custom-color2">+</span>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">گالری تصاویر محصول</label>
                    <div className="flex flex-wrap gap-2">
                        <div className="border-2 border-dashed border-custom-color21 rounded-lg p-4 flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-custom-color2 relative">
                            <input
                                type="file"
                                name="gallery"
                                onChange={handleGalleryChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                multiple
                            />
                            <span className="text-2xl text-custom-color2">+</span>
                        </div>
                        {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img src={preview} alt={`Gallery Preview ${index}`} className="w-16 h-16 object-cover rounded" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition-all duration-200"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">موجود در انبار</label>
                    <Switch
                        onChange={() => setFormData({ ...formData, instock: !formData.instock })}
                        checked={formData.instock}
                    />
                </div>
                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">محصول جدید</label>
                    <Switch
                        onChange={() => setFormData({ ...formData, new: !formData.new })}
                        checked={formData.new}
                    />
                </div>
                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">دسته‌بندی</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 focus:outline-none focus:border-custom-color4"
                        required
                    >
                        <option value="">انتخاب دسته‌بندی</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.attributes.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-custom-color3 text-custom-color2 rounded hover:bg-custom-color31 transition"
                    disabled={loading}
                >
                    {loading ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات'}
                </button>
            </form>
        </div>
    );
};

export default EditItemDemo;
