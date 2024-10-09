import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // state جدید برای لودینگ
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('jwt');
        if (token) {
            navigate('/panel');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // شروع لودینگ

        try {
            const response = await axios.post('http://localhost:1337/api/auth/local', {
                identifier: username,
                password: password,
            });

            sessionStorage.setItem('jwt', response.data.jwt);

            toast.success('ورود موفقیت آمیز بود');
            setTimeout(() => {
                navigate('/panel');
            }, 2000); // پس از 2 ثانیه انتقال به صفحه پنل
        } catch (error) {
            console.error('An error occurred:', error.response);
            toast.error('نام کاربری یا رمز عبور اشتباه است');
        } finally {
            setIsLoading(false); // پایان لودینگ
        }
    };

    const isFormValid = username && password;

    return (
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center h-dvh bg-custom-color1">
            <div className="bg-custom-color12 p-8 rounded w-96 border border-custom-color3">
                <h1 className="text-center mb-4">ورود به پنل مدیریت</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-yellow-700 mb-2">نام کاربری</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-2 border border-gray-300 rounded text-custom-color1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:border-2"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="true"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-yellow-700 mb-2">رمز عبور</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border border-gray-300 rounded text-custom-color1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:border-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-custom-color3 text-white py-2 rounded ${!isFormValid || isLoading ? 'opacity-35 cursor-not-allowed' : ''} active:bg-custom-color31`}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2 justify-center">
                                <div className="loader"></div>
                            </div>
                        ) : (
                            'ورود'
                        )}
                    </button>
                </form>
            </div>
            <ToastContainer
                position="top-center" // موقعیت توست
                autoClose={5000} // مدت زمان نمایش (۵ ثانیه)
                hideProgressBar={true} // عدم نمایش نوار پیشرفت
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
            />
        </div>
    );
};

export default Login;
