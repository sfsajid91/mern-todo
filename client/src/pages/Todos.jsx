import { Helmet } from 'react-helmet-async';
import Todo from '../components/Todo';
import { useGetTodosQuery } from '../features/todos/todoSlice';

export default function Todos() {
    const { data: { todos = [] } = {}, isLoading, error } = useGetTodosQuery();

    return (
        <>
            <Helmet>
                <title>All Todos - TODO App</title>
            </Helmet>
            <div className="py-4 min-h-screen">
                <h1 className="text-center text-3xl font-semibold mb-4">
                    <span className="text-red-400">All</span> Todos
                </h1>
                {isLoading && (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4">
                        {[...Array(8).keys()].map((_) => (
                            <div
                                key={_}
                                className="px-4 py-3 cursor-pointer shadow-md rounded w-full"
                            >
                                <div className="animate-pulse space-y-4">
                                    <div className="rounded bg-slate-200 h-7 w-full" />
                                    <div className="flex-1 space-y-4">
                                        <div className="h-24 bg-slate-200 rounded" />
                                        <div className="flex justify-between">
                                            <div className="w-1/5 h-4 bg-slate-200 rounded" />
                                            <div className="w-1/5 h-4 bg-slate-200 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!isLoading && !error && (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4">
                        {todos.length > 0 &&
                            todos.map((todo) => <Todo key={todo._id} todo={todo} />)}
                        {todos.length === 0 && (
                            <div className="flex justify-center items-center">
                                <h1 className="text-center text-3xl font-semibold mb-4">
                                    No Todos Found
                                </h1>
                            </div>
                        )}
                    </div>
                )}
                {!isLoading && error && (
                    <div className="flex justify-center items-center">
                        <h1 className="text-center text-3xl font-semibold mb-4">
                            <span className="text-red-400">Error</span> Fetching Todos
                        </h1>
                    </div>
                )}
            </div>
        </>
    );
}
