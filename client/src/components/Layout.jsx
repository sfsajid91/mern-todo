import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="lg:max-w-6xl md:max-w-2xl px-8 w-full mx-auto">
            <Outlet />
        </div>
    );
}
