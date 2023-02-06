import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { useConfirmEmailQuery } from '../features/auth/authApiSlice';

export default function EmailVerification() {
    const { token } = useParams();

    const { data, isLoading, error } = useConfirmEmailQuery(token);
    const navigate = useNavigate();

    if (!isLoading && !error && data) {
        toast.success(data.message);
        return navigate('/login');
    }

    if (!isLoading && error) {
        toast.error('Link expired or invalid');
        setTimeout(() => {
            return navigate('/login');
        }, 1000);
    }

    return (
        <>
            <Helmet>
                <title>Verify Email - TODO App</title>
            </Helmet>
            <Loading />
        </>
    );
}
