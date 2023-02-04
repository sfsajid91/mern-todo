import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

export default function Test() {
    const user = useSelector(selectCurrentUser);
    return <h1>Hey there {user.email}</h1>;
}
