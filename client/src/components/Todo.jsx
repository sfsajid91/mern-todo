import moment from 'moment';

export default function Todo({ todo }) {
    const colors = [
        'to-blue-400 from-green-300',
        'to-green-400 from-indigo-200',
        'to-yellow-400 from-blue-200',
        'to-red-400 from-purple-500',
        'to-purple-400 from-blue-500',
        'to-pink-400 from-yellow-500',
        'from-indigo-400 to-purple-500',
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <div
            className={`px-4 py-3 cursor-pointer shadow-md rounded bg-gradient-to-t flex justify-between gap-4 flex-col ${randomColor}`}
        >
            <div className="space-y-2">
                <h4 className="text-lg font-semibold">{todo?.title}</h4>
                <p className="text-gray-600 text-sm">
                    {todo?.description?.length > 100 ? (
                        <span>{todo?.description?.slice(0, 100)}...</span>
                    ) : (
                        <span>{todo?.description}</span>
                    )}
                </p>
            </div>
            <div className="flex justify-between items-center mt-auto">
                <p className="text-xs text-gray-800">{moment(todo?.createdAt).fromNow()}</p>
                <p className="inline-flex justify-center items-center py-0.5 px-4 text-[13px] bg-accent rounded-full">
                    {todo?.completed ? 'Completed' : 'Pending'}
                </p>
            </div>
        </div>
    );
}
