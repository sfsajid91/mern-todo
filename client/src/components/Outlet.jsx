/* eslint-disable react/jsx-no-useless-fragment */

import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';

import routes from '../utils/routes';

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

    return (
        <>
            {user ? (
                <Navigate to={routes.todos} replace state={{ from: location.pathname }} />
            ) : (
                <Outlet />
            )}
        </>
    );
}
