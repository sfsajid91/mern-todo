import { yupResolver } from '@hookform/resolvers/yup';
import Lottie from 'lottie-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import animationData from '../assets/register.json';
import TextInput from '../components/TextInput';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        // .matches(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
        //     'One Uppercase, One Lowercase, One Number and One Special Case Character'
        // )

        .max(32, `Password shouldn't more than 32 characters`)
        .required(),
});

export default function Login() {
    const {
        handleSubmit,
        register,
        setError,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    // const location = useLocation();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const { user, accessToken } = await login(data).unwrap();
            dispatch(setCredentials({ user, accessToken }));
            setValue('email', '');
            setValue('password', '');
            // if (location.state?.from && !location.state?.from === location.pathname) {
            //     return navigate(location.state.from);
            // }
            return navigate('/');
        } catch (err) {
            let message = 'Something went wrong';
            if (err?.data) {
                message = err.data?.message;
            }
            setError('email', { message });
            setError('password', { message });
        }
    };

    return (
        <>
            {/* <Helmet>
                <title>Login - TODO App</title>
            </Helmet> */}
            <div className="min-h-screen flex justify-center items-center">
                <div className="flex justify-between items-center">
                    <div className="w-1/3 hidden md:block">
                        <Lottie animationData={animationData} />
                    </div>
                    <div className="md:w-1/2 lg:w-1/3 px-4 py-8 shadow shadow-gray-600 rounded-md space-y-4">
                        <h1 className="text-xl font-semibold text-center">
                            <span className="text-primary">Login</span> to your Account
                        </h1>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                            <TextInput
                                label="Email"
                                placeholder="Enter Your Email"
                                {...register('email')}
                                error={errors.email?.message}
                            />
                            <TextInput
                                label="Password"
                                placeholder="Enter Your Password"
                                type="password"
                                {...register('password')}
                                error={errors.password?.message}
                            />
                            <button type="submit" className="btn btn-success">
                                {isLoading ? 'Loading...' : 'Login'}
                            </button>
                            <div className="flex justify-evenly items-center mx-2">
                                <Link
                                    to="/forget-password"
                                    className="w-full text-left text-sm md:text-base font-medium duration-200 text-gray-700 hover:text-blue-400"
                                >
                                    Forgot Password?
                                </Link>
                                <Link
                                    to="/signup"
                                    className="w-full text-right font-medium text-gray-700 duration-200 hover:text-blue-400"
                                >
                                    Singup!
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
