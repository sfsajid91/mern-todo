import BottomNav from '../components/BottomNav';
import Todo from '../components/Todo';
import { useGetTodosQuery } from '../features/todos/todoSlice';

export default function Todos() {
    const { data: { todos = [] } = {}, isLoading, isSuccess, isError, error } = useGetTodosQuery();

    console.log(todos);

    return (
        <>
            {/* <Helmet>
                <title>Todos - TODO App</title>
            </Helmet> */}
            <div className="py-4 min-h-screen">
                <h1 className="text-center text-3xl font-semibold mb-4">
                    <span className="text-red-400">All</span> Todos
                </h1>
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
                    </div>
                )}
                {!isLoading && !error && todos.length > 0 && (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4">
                        {todos.map((todo) => (
                            <Todo key={todo._id} todo={todo} />
                        ))}
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
            <BottomNav />
        </>
    );
}
