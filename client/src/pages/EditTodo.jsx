import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import Loading from '../components/Loading';
import TextInput from '../components/TextInput';

import {
    useDeleteTodoMutation,
    useGetTodoQuery,
    useUpdateTodoMutation,
} from '../features/todos/todoSlice';
import NotFound from './NotFound';

const schema = yup.object().shape({
    title: yup.string().required('Please enter a title'),
    description: yup.string().required('Please enter a description'),
    completed: yup.boolean(),
});

export default function EditTodo() {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
    } = useForm({ resolver: yupResolver(schema) });

    const params = useParams();

    // a function that validate mongoDb id or not
    const validateMongoId = (id) => {
        const checkForHexRegExp = /^[0-9a-fA-F]{24}$/;
        return checkForHexRegExp.test(id);
    };

    const {
        data: todo,
        isError,
        isLoading,
    } = useGetTodoQuery(params.id, {
        skip: !validateMongoId(params.id),
    });

    const navigate = useNavigate();

    const [
        updateTodo,
        {
            isError: uTodoError,
            isSuccess: uTodoSuccess,
            isLoading: uTodoLoading,
        },
    ] = useUpdateTodoMutation();

    const [
        deleteTodo,
        {
            isError: dTodoError,
            isSuccess: dTodoSuccess,
            isLoading: dTodoLoading,
        },
    ] = useDeleteTodoMutation();

    useEffect(() => {
        if (todo?._id) {
            setValue('title', todo.title);
            setValue('description', todo.description);
            setValue('completed', todo.completed);
        }
    }, [setValue, todo]);

    // update todo
    const onSubmit = (data) => {
        updateTodo({ id: todo._id, ...data });
    };

    useEffect(() => {
        if (uTodoSuccess || dTodoSuccess) {
            if (uTodoSuccess) {
                toast.success('Todo updated successfully');
            }
            if (dTodoSuccess) {
                toast.success('Todo deleted successfully');
            }
            navigate('/');
        }
    }, [uTodoSuccess, dTodoSuccess, navigate]);

    // delete todo
    const handleDelete = () => {
        deleteTodo(todo._id);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!validateMongoId(params.id) || isError) {
        return <NotFound />;
    }

    return (
        <div className="py-4 min-h-screen">
            <Helmet>
                <title>Edit TODO - TODO App</title>
            </Helmet>
            <h1 className="text-center text-3xl font-semibold mb-8">
                <span className="text-red-400">Edit</span> Todo
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

                    <div className="form-control w-full">
                        <label htmlFor="status" className="label">
                            <span className="label-text">Completed</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            id="status"
                            {...register('completed')}
                            defaultValue={false}
                        >
                            <option value={false}>No</option>
                            <option value>Yes</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={dTodoLoading || uTodoLoading}
                    >
                        Update Todo
                    </button>
                </form>
                <button
                    className="btn btn-error w-full"
                    onClick={handleDelete}
                    disabled={dTodoLoading || uTodoLoading}
                >
                    Delete Todo
                </button>
            </div>

            {(uTodoError || dTodoError) && (
                <div className="flex justify-center mt-4 rounded py-4 bg-red-400 md:max-w-lg mx-auto shadow">
                    Something went wrong. Please try again later.
                </div>
            )}
        </div>
    );
}
