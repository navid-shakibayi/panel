import React from 'react';
import Delete from "../Svg/Delete";
import Edit from "../Svg/Edit";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // استفاده از useNavigate برای هدایت
import './sweetAlertStyle.css';

const PanelCard = ({
    id,
    name,
    src,
    alt,
    onDelete,
    isnew,
    instock,
}) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'آیا مطمئن هستید؟',
            text: `${name} حذف شود؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'بله، حذف شود!',
            cancelButtonText: 'لغو',
            customClass: {
                container: 'custom-swal-container',
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                text: 'custom-swal-text',
            }
        });

        if (result.isConfirmed) {
            try {
                const token = sessionStorage.getItem('jwt');
                if (!token) {
                    Swal.fire('خطا!', 'شما به سیستم وارد نشده‌اید. لطفاً ابتدا وارد شوید.', 'error');
                    throw new Error('No token found');
                }

                await axios.delete(`http://localhost:1337/api/items/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                onDelete(id); // اطلاع دادن به والدین که این محصول حذف شده است
                Swal.fire('حذف شد!', 'محصول با موفقیت حذف شد.', 'success');
            } catch (error) {
                console.error('Error deleting item:', error);
                Swal.fire('خطا!', 'خطایی در حذف محصول رخ داد.', 'error');
            }
        }
    };

    const handleEdit = () => {
        navigate(`/panel/edit-item/${id}`);
    };

    return (
        <div className="bg-custom-color12 w-full rounded-md grid grid-cols-5 gap-4 p-2 shadow shadow-custom-color12">
            <div className="flex gap-4 items-center col-span-2">
                <img
                    src={src}
                    alt={alt}
                    className="w-14 h-14 rounded"
                />
                <p className="text-base mt-1 font-kalame">{name}</p>
            </div>

            <div className='flex items-center justify-center'>
                {isnew && (
                    <div className="flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-600"></span>
                        </span>
                        <span className="text-[10px] sm:text-xs text-yellow-600 font-bold">جدید</span>
                    </div>
                )}
            </div>

            <div className='flex items-center justify-center'>
                {instock && (
                    <div className="flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className="text-[10px] sm:text-xs text-red-600 font-bold">تمام شد</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-2">
                <div
                    onClick={handleEdit}
                    className='mt-1 cursor-pointer'
                >
                    <Edit />
                </div>
                <div
                    onClick={handleDelete}
                    className='cursor-pointer'
                >
                    <Delete />
                </div>
            </div>
        </div>
    );
}

export default PanelCard;
