import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiKey } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import TextInput from '../components/TextInput';
import { useSendResetPasswordEmailMutation } from '../features/auth/authApiSlice';

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
});

export default function ForgotPass() {
    const {
        handleSubmit,
        register,
        setError,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const [sendResetPasswordEmail] = useSendResetPasswordEmailMutation();

    const onSubmit = async (data) => {
        try {
            await sendResetPasswordEmail(data).unwrap();
            setValue('email', '');
            toast.success('Reset password email sent successfully');
        } catch (err) {
            setError('email', { message: err.data?.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>Forgot Password - TODO App</title>
            </Helmet>
            <div className="min-h-screen flex justify-center items-center">
                <div className="px-8 py-8 shadow shadow-gray-600 rounded-md space-y-3">
                    <div className="p-3 rounded-full w-fit mx-auto bg-purple-400/30">
                        <div className="p-2 rounded-full bg-purple-400/60 shadow">
                            <FiKey className="text-2xl text-primary" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-center">Forgot Password?</h3>
                    <h5 className="text-gray-500">
                        No worries, we&apos;ll send you reset instruction
                    </h5>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <TextInput
                            label="Email"
                            placeholder="Enter Your Email"
                            {...register('email')}
                            error={errors.email?.message}
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
            </div>
        </>
    );
}
