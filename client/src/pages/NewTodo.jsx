import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import TextInput from '../components/TextInput';
import { useCreateTodoMutation } from '../features/todos/todoSlice';

const schema = yup.object().shape({
    title: yup.string().required('Please enter a title'),
    description: yup.string().required('Please enter a description'),
});

export default function NewTodo() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const [createTodo, { isError, isSuccess }] = useCreateTodoMutation();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        createTodo(data);
    };

    useEffect(() => {
        if (isError) {
            toast.error('Something went wrong');
        }
    }, [isError]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Todo created successfully');
            navigate('/');
        }
    }, [isSuccess, navigate]);

    return (
        <div className="py-4 min-h-screen">
            <Helmet>
                <title>Create New TODO - TODO App</title>
            </Helmet>
            <h1 className="text-center text-3xl font-semibold mb-8">
                <span className="text-red-400">Create</span> Todos
            </h1>

            <div className="md:max-w-lg mx-auto px-4 py-8 shadow shadow-gray-600 rounded-md space-y-4">
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <TextInput
                        label="Title"
                        placeholder="Enter a title"
                        {...register('title')}
                        error={errors.title?.message}
                    />

                    <div className="form-control w-full">
                        <label htmlFor="description" className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            placeholder="Enter a description for your todo"
                            className={`w-full h-52 text-gray-800 border rounded-md outline-none transition duration-100 px-3 py-2 ${
                                errors.description
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            }`}
                            {...register('description')}
                        />
                        {errors?.description && (
                            <label className="label">
                                <span className="label-text text-red-600">
                                    {errors.description?.message}
                                </span>
                            </label>
                        )}
                    </div>

                    <button type="submit" className="btn btn-success">
                        Create Todo
                    </button>
                </form>
            </div>
        </div>
    );
}
