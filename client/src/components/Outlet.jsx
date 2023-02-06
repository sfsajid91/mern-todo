/* eslint-disable react/jsx-no-useless-fragment */

import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';

import routes, { publicRoutes } from '../utils/routes';

export function Private() {
    const user = useSelector(selectCurrentUser);
    // const user = null;

    const location = useLocation();

    return (
        <>
            {user ? (
                <Outlet />
            ) : (
                <Navigate to={routes.login} replace state={{ from: location.pathname }} />
            )}
        </>
    );
}

export function Public() {
    // const user = { name: 'John' };
    const user = useSelector(selectCurrentUser);

    const location = useLocation();

    const isPublicRoute = publicRoutes.some((route) => route === location.state?.from);

    const destination = isPublicRoute ? routes.todos : location.state?.from;

    return (
        <>
            {user ? (
                <Navigate to={destination} replace state={{ from: location.pathname }} />
            ) : (
                <Outlet />
            )}
        </>
    );
}
