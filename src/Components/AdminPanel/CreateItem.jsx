import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Switch from 'react-switch';

const CreateItem = () => {
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
        } else {
            axios.get('http://localhost:1337/api/categories?populate=*', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setCategories(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                    Swal.fire('خطا!', 'عدم دسترسی به دسته‌بندی‌ها.', 'error');
                });
        }
    }, [navigate]);

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

    const handleGalleryFileChange = (e) => {
        const files = Array.from(e.target.files);

        setFormData(prevFormData => ({
            ...prevFormData,
            gallery: [...prevFormData.gallery, ...files]
        }));

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const handleGalleryRemove = (index) => {
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

            let thumbnailId = null;
            let galleryIds = [];

            if (formData.thumbnail) {
                const thumbnailData = new FormData();
                thumbnailData.append('files', formData.thumbnail);

                const thumbnailResponse = await axios.post('http://localhost:1337/api/upload', thumbnailData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                thumbnailId = thumbnailResponse.data[0].id;
            }

            if (formData.gallery.length > 0) {
                const galleryData = new FormData();
                formData.gallery.forEach(file => galleryData.append('files', file));

                const galleryResponse = await axios.post('http://localhost:1337/api/upload', galleryData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                galleryIds = galleryResponse.data.map(file => file.id);
            }

            const newItem = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                instock: formData.instock,
                new: formData.new,
                category: formData.category,
                thumbnail: thumbnailId,
                gallery: galleryIds
            };

            await axios.post('http://localhost:1337/api/items', { data: newItem }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire('موفقیت!', 'محصول با موفقیت افزوده شد.', 'success');
            navigate('/panel');
        } catch (error) {
            console.error('Error creating item:', error);
            Swal.fire('خطا!', 'خطایی در ایجاد محصول رخ داد.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-custom-color1">
            <button
                onClick={() => navigate(-1)}
                className="block w-fit text-sm mb-4 bg-custom-color3 text-custom-color2 py-2 px-4 rounded hover:bg-custom-color31 transition cursor-pointer"
            >
                بازگشت
            </button>

            <form
                onSubmit={handleSubmit}
                className="bg-custom-color12 p-6 rounded-lg shadow-lg"
            >
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="text-sm block mb-2 text-custom-color21"
                    >
                        نام محصول
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 outline-none focus:border-custom-color4 transition-all duration-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="text-sm block mb-2 text-custom-color21"
                    >
                        توضیحات محصول
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 outline-none focus:border-custom-color4 transition-all duration-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="price"
                        className="text-sm block mb-2 text-custom-color21"
                    >
                        قیمت محصول
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 outline-none focus:border-custom-color4 transition-all duration-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="thumbnail"
                        className="text-sm block mb-2 text-custom-color21"
                    >
                        تصویر اصلی محصول
                    </label>
                    <div className="min-h-36 border-2 border-dashed border-custom-color21 rounded-lg p-4 flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-custom-color2 relative">
                        <input
                            type="file"
                            name="thumbnail"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="max-h-28 rounded-md"
                            />
                        ) : (
                            <span className="text-2xl text-custom-color2">+</span>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="gallery"
                        className="text-sm block mb-2 text-custom-color21"
                    >
                        گالری تصاویر
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {galleryPreviews.map((preview, index) => (
                            <div
                                key={index}
                                className="relative w-28 h-28 p-1 border-2 border-dashed border-custom-color21 rounded-lg"
                            >
                                <img
                                    src={preview}
                                    alt={`Gallery Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleGalleryRemove(index)}
                                    className="absolute -top-2 -right-2 text-white bg-custom-color5 rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-custom-color21 rounded-lg cursor-pointer">
                            <input
                                type="file"
                                name="gallery"
                                multiple
                                onChange={handleGalleryFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <span className="text-2xl text-custom-color2">+</span>
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-sm block mb-2 text-custom-color21">دسته‌بندی محصول</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 outline-none focus:border-custom-color4 transition-all duration-500"
                        required
                    >
                        <option value="">انتخاب دسته‌بندی</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.attributes.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm text-custom-color21">موجود در انبار</label>
                    <Switch
                        checked={formData.instock}
                        onChange={() => setFormData({ ...formData, instock: !formData.instock })}
                        onColor="#3be13b"
                        offColor="#DC3545"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                    />
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm text-custom-color21">محصول جدید</label>
                    <Switch
                        checked={formData.new}
                        onChange={() => setFormData({ ...formData, new: !formData.new })}
                        onColor="#3be13b"
                        offColor="#DC3545"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <a
                        className="w-24 text-center text-sm mt-4 bg-custom-color5 text-custom-color2 py-2 px-4 rounded hover:brightness-150 cursor-pointer transition duration-500"
                        onClick={() => { navigate(-1) }}
                    >
                        لغو
                    </a>

                    <button
                        type="submit"
                        className="w-24 text-center text-sm mt-4 bg-custom-color3 text-custom-color2 py-2 px-4 rounded hover:bg-custom-color31 transition duration-500"
                        >
                        {loading ? (
                            <div className="loader border-t-2 border-b-2 border-green-500 w-6 h-6 rounded-full animate-spin"></div>
                        ) : (
                            'ثبت'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateItem;
