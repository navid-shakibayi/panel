import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Switch from 'react-switch';

const EditItem = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        thumbnail: null,
        gallery: [],
        instock: true,
        new: false,
        category: "",
    });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [galleryToDelete, setGalleryToDelete] = useState([]); // For storing files to be deleted
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("jwt");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "https://rad-cafe-api.chbk.run/api/categories?populate=*",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCategories(response.data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                Swal.fire("خطا!", "عدم دسترسی به دسته‌بندی‌ها.", "error");
            }
        };

        const fetchItem = async () => {
            try {
                const response = await axios.get(
                    `https://rad-cafe-api.chbk.run/api/items/${id}?populate=*`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const item = response.data.data;

                setFormData({
                    name: item?.attributes?.name || "",
                    description: item?.attributes?.description || "",
                    price: item?.attributes?.price || "",
                    instock: item?.attributes?.instock || false,
                    new: item?.attributes?.new || false,
                    category: item?.attributes?.category?.data?.id || "",
                    thumbnail: item?.attributes?.thumbnail || null,
                    gallery: item?.attributes?.gallery?.data || [],
                });

                if (item?.attributes?.thumbnail?.data?.attributes?.url) {
                    setThumbnailPreview(
                        `https://rad-cafe-api.chbk.run${item.attributes.thumbnail.data.attributes.url}`
                    );
                }

                const galleryUrls =
                    item?.attributes?.gallery?.data?.map(
                        (file) => `https://rad-cafe-api.chbk.run${file.attributes.url}`
                    ) || [];
                setGalleryPreviews(galleryUrls);
            } catch (error) {
                console.error("Error fetching item:", error);
                Swal.fire("خطا!", "عدم دسترسی به اطلاعات محصول.", "error");
            }
        };

        fetchCategories();
        fetchItem();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        setFormData({
            ...formData,
            [name]: file,
        });
        if (file) {
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            gallery: [...formData.gallery, ...files],
        });
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    };

    const handleGalleryRemove = async (index) => {
        const fileId = formData.gallery[index]?.id; // Get the ID of the file to be deleted
        if (fileId) {
            const confirm = await Swal.fire({
                title: "آیا مطمئن هستید؟",
                text: "این تصویر حذف خواهد شد و این عملیات قابل بازگشت نیست!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "بله، حذف کن!",
                cancelButtonText: "لغو",
            });

            if (confirm.isConfirmed) {
                setGalleryToDelete([...galleryToDelete, fileId]); // Store the file ID for deletion
                const newGallery = formData.gallery.filter((_, i) => i !== index);
                const newPreviews = galleryPreviews.filter((_, i) => i !== index);
                setFormData({
                    ...formData,
                    gallery: newGallery,
                });
                setGalleryPreviews(newPreviews);
            }
        } else {
            // If the file is newly added and not yet uploaded
            const newGallery = formData.gallery.filter((_, i) => i !== index);
            const newPreviews = galleryPreviews.filter((_, i) => i !== index);
            setFormData({
                ...formData,
                gallery: newGallery,
            });
            setGalleryPreviews(newPreviews);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = sessionStorage.getItem("jwt");
        if (!token) {
            Swal.fire("خطا!", "توکن موجود نیست. لطفا دوباره وارد شوید.", "error");
            setLoading(false);
            return;
        }

        try {
            // آپلود فایل‌های جدید به سرور
            let uploadedGallery = [];
            if (formData.gallery.some(file => file instanceof File)) {
                const galleryFormData = new FormData();
                formData.gallery.forEach((file) => {
                    if (file instanceof File) {
                        galleryFormData.append("files", file);
                    }
                });

                const uploadResponse = await axios.post(
                    "https://rad-cafe-api.chbk.run/api/upload",
                    galleryFormData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                uploadedGallery = uploadResponse.data.map((file) => ({
                    id: file.id,
                    url: file.url,
                }));
            }

            // اضافه کردن تصاویر قبلی به لیست نهایی
            const existingGallery = formData.gallery
                .filter(file => !(file instanceof File))  // فقط تصاویر قبلی که فایل نیستند
                .map(file => ({ id: file.id }));

            // ترکیب تصاویر جدید و قبلی
            const finalGallery = [...existingGallery, ...uploadedGallery];

            // حذف تصاویر از سرور
            for (const fileId of galleryToDelete) {
                await axios.delete(
                    `https://rad-cafe-api.chbk.run/api/upload/files/${fileId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // ساخت داده‌های نهایی برای ارسال به API
            const formDataToSend = new FormData();
            formDataToSend.append(
                "data",
                JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    instock: formData.instock,
                    new: formData.new,
                    category: formData.category,
                    gallery: finalGallery.map((file) => file.id), // اضافه کردن IDهای تصاویر آپلود شده به گالری
                })
            );

            if (formData.thumbnail && formData.thumbnail instanceof File) {
                formDataToSend.append("files.thumbnail", formData.thumbnail);
            }

            // ارسال درخواست به‌روزرسانی محصول
            await axios.put(
                `https://rad-cafe-api.chbk.run/api/items/${id}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            Swal.fire("موفقیت!", "محصول با موفقیت به‌روز شد.", "success");
        } catch (error) {
            console.error("Error updating item:", error);
            Swal.fire("خطا!", "خطا در به‌روزرسانی محصول.", "error");
        } finally {
            setLoading(false);
        }
    };




    return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-8 bg-custom-color1">
                <a
                    onClick={() => navigate(-1)}
                    className="block w-fit text-sm mb-4 bg-custom-color3 text-custom-color2 py-2 px-4 rounded hover:bg-custom-color31 transition cursor-pointer"
                >
                    بازگشت
                </a>

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
                        <div className="border-2 border-dashed border-custom-color21 rounded-lg p-4 flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-custom-color2 relative">
                            <input
                                type="file"
                                name="thumbnail"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                            />
                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
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
                        <label className="text-sm block mb-2 text-custom-color21">دسته‌بندی</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="text-xs w-full p-2 border-2 border-dashed border-custom-color3 rounded bg-custom-color14 text-custom-color2 outline-none focus:border-custom-color4 transition-all duration-500"
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

                    <div className="flex items-center gap-4 mb-4">
                        <label className="text-sm block text-custom-color21">موجود در انبار</label>
                        <Switch
                            onChange={() => setFormData({ ...formData, instock: !formData.instock })}
                            checked={formData.instock}
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
                        <label className="text-sm block text-custom-color21">محصول جدید</label>
                        <Switch
                            onChange={() => setFormData({ ...formData, new: !formData.new })}
                            checked={formData.new}
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
                            disabled={loading}
                        >
                            {loading ? "در حال ذخیره..." : "ذخیره"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditItem;
