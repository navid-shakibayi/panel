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
    onDelete
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

                await axios.delete(`https://rad-cafe-api.chbk.run/api/items/${id}`, {
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
        <div className="bg-custom-color12 w-full rounded-md flex justify-between items-center gap-4 p-2 shadow shadow-custom-color12">
            <div className="flex gap-4 items-center">
                <img
                    src={src}
                    alt={alt}
                    className="w-14 h-14 rounded"
                />
                <p className="text-base mt-1 font-kalame">{name}</p>
            </div>

            <div className="flex gap-2">
                <div onClick={handleEdit}>
                    <Edit />
                </div>
                <div onClick={handleDelete}>
                    <Delete />
                </div>
            </div>
        </div>
    );
}

export default PanelCard;
