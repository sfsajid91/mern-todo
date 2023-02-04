import { BiHomeAlt, BiLogOut, BiPlus } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';

function LoggedItems() {
    const classes = 'duration-300 text-white hover:text-blue-500';
    return (
        <>
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? `${classes} text-blue-500` : classes)}
            >
                <BiHomeAlt className="text-3xl" />
            </NavLink>
            <NavLink
                to="/todos"
                className={({ isActive }) => (isActive ? `${classes} text-blue-500` : classes)}
            >
                <BiPlus className="text-3xl" />
            </NavLink>
            <NavLink
                to="/todos"
                className={({ isActive }) => (isActive ? `${classes} text-blue-500` : classes)}
            >
                <BiLogOut className="text-3xl" />
            </NavLink>
        </>
    );
}

function NotLoggedItems() {
    const classes = 'duration-300 text-white hover:text-blue-500';
    return (
        <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? `${classes} text-blue-500` : classes)}
        >
            <BiLogOut className="text-3xl" />
        </NavLink>
    );
}

export default function BottomNav() {
    const { user } = { user: { username: 'test' } };
    return (
        <div className="sticky bottom-3 inset-x-4 md:inset-x-auto md:w-96 mx-auto rounded-full px-8 py-2 bg-green-400 flex justify-between items-center">
            {user ? <LoggedItems /> : <NotLoggedItems />}
        </div>
    );
}
