import { yupResolver } from '@hookform/resolvers/yup';
import Lottie from 'lottie-react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import animationData from '../assets/login.json';
import TextInput from '../components/TextInput';
import { useSignupMutation } from '../features/auth/authApiSlice';

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    name: yup.string().required('Please enter your name'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
            'Must use One Uppercase, Lowercase, Number and Special Character'
        )

        .max(32, `Password shouldn't more than 32 characters`)
        .required(),
});

export default function Singup() {
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const [signup, { isLoading }] = useSignupMutation();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await signup(data).unwrap();
            // toast.success('Signup successfully');
            toast('Please Verify your Email!', {
                icon: '📧',
            });
            navigate('/login');
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
            <Helmet>
                <title>Signup - TODO App</title>
            </Helmet>
            <div className="min-h-screen flex justify-center items-center w-full">
                <div className="flex justify-between items-center">
                    <div className="w-1/3 hidden md:block">
                        <Lottie animationData={animationData} />
                    </div>
                    <div className="md:w-1/2 lg:w-1/3 px-4 py-8 shadow shadow-gray-600 rounded-md space-y-4">
                        <h1 className="text-xl font-semibold text-center">
                            <span className="text-primary">Create</span> a new Account
                        </h1>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                            <TextInput
                                label="Full Name"
                                placeholder="Enter Your Fullname"
                                {...register('name')}
                                error={errors.name?.message}
                            />
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
                                {isLoading ? 'Loading...' : 'Signup'}
                            </button>
                            <div className="flex justify-between items-center">
                                <h5 className="text-sm md:text-base font-medium text-gray-700">
                                    Already have an account?
                                </h5>
                                <Link
                                    to="/login"
                                    className="font-medium text-gray-700 duration-200 hover:text-blue-400"
                                >
                                    Login!
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
