import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiKey } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import TextInput from '../components/TextInput';
import { useResetPasswordMutation, useValidTokenQuery } from '../features/auth/authApiSlice';

const schema = yup.object().shape({
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
            'Must use One Uppercase, Lowercase, Number and Special Character'
        )

        .max(32, `Password shouldn't more than 32 characters`)
        .required(),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

export default function ResetPassword() {
    const {
        handleSubmit,
        register,

        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const { token } = useParams();
    const { isLoading, error } = useValidTokenQuery(token);

    const [resetPassword] = useResetPasswordMutation();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await resetPassword({ token, password: data.password }).unwrap();
            setValue('password', '');
            setValue('confirmPassword', '');
            toast.success('Password reset successfully');
            navigate('/login');
        } catch (err) {
            toast.error(err.data?.message || 'Something went wrong');
        }
    };

    return (
        <>
            <Helmet>
                <title>Reset Password - TODO App</title>
            </Helmet>
            <div className="min-h-screen flex justify-center items-center">
                {isLoading && (
                    <div className="text-2xl font-semibold">
                        <FiKey className="animate-spin inline-block mr-2" />
                    </div>
                )}
                {!isLoading && error && (
                    <div className="text-2xl font-semibold">
                        {error.data?.message || 'Something went wrong'}
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="px-8 py-8 shadow shadow-gray-600 rounded-md space-y-3 max-w-md">
                        <div className="p-3 rounded-full w-fit mx-auto bg-purple-400/30">
                            <div className="p-2 rounded-full bg-purple-400/60 shadow">
                                <FiKey className="text-2xl text-primary" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-semibold text-center">Set a new password</h3>
                        <h5 className="text-gray-500 text-center">
                            Always use a strong password that you don&apos;t use anywhere else and
                            that you don&apos;t share with anyone.
                        </h5>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                            <TextInput
                                label="Password"
                                placeholder="Enter Your password"
                                type="password"
                                {...register('password')}
                                error={errors.password?.message}
                            />
                            <TextInput
                                label="Confirm Password"
                                placeholder="Enter same password again"
                                type="password"
                                {...register('confirmPassword')}
                                error={errors.confirmPassword?.message}
                            />
                            <button type="submit" className="btn btn-secondary">
                                Reset Password
                            </button>
                        </form>
                        <Link to="/login" className="btn btn-ghost text-gray-600 w-full">
                            <FiArrowLeft className="text-xl mr-2" />
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
