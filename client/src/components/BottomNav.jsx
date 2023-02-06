import { BiHomeAlt, BiLogOut, BiPlus } from 'react-icons/bi';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useLogoutMutation } from '../features/auth/authApiSlice';
import { logOut, selectCurrentUser } from '../features/auth/authSlice';

function LoggedItems() {
    const [logout] = useLogoutMutation();
    const classes = 'duration-300 text-white hover:text-blue-500';
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await logout();
            dispatch(logOut());
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? `${classes} text-blue-500` : classes)}
            >
                <BiHomeAlt className="text-3xl" />
            </NavLink>
            <NavLink
                to="/create"
                className={({ isActive }) => (isActive ? `${classes} text-blue-500` : classes)}
            >
                <BiPlus className="text-3xl" />
            </NavLink>
            <button className={classes} onClick={handleLogout}>
                <BiLogOut className="text-3xl" />
            </button>
        </>
    );
}

function NotLoggedItems() {
    const classes = 'duration-300 text-white hover:text-blue-500';
    return (
        <>
            <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? `${classes} text-blue-500` : classes)}
            >
                <BiLogOut className="text-3xl" />
            </NavLink>

            <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? `${classes} text-blue-500` : classes)}
            >
                <MdOutlineAccountCircle className="text-3xl" />
            </NavLink>
        </>
    );
}

export default function BottomNav() {
    const user = useSelector(selectCurrentUser);
    return (
        <div className="sticky bottom-4 inset-x-4 md:inset-x-auto md:w-96 mx-auto rounded-full px-8 py-2 bg-green-400 flex justify-between items-center mt-5">
            {user ? <LoggedItems /> : <NotLoggedItems />}
        </div>
    );
}
