import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useRefreshMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import BottomNav from './BottomNav';
import Loading from './Loading';

export default function Layout() {
    const [refresh, { isLoading }] = useRefreshMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        const localUser = localStorage.getItem('user');
        async function refreshUser() {
            try {
                const { user, accessToken } = await refresh().unwrap();
                dispatch(setCredentials({ user, accessToken }));
                localStorage.setItem('user', JSON.stringify(user));
            } catch (err) {
                localStorage.removeItem('user');
            }
        }
        if (localUser) {
            refreshUser();
        }
    }, []);

    return (
        <div className="lg:max-w-6xl md:max-w-2xl px-8 w-full mx-auto">
            {isLoading ? <Loading /> : <Outlet />}
            {!isLoading && <BottomNav />}
            <Toaster />
        </div>
    );
}
