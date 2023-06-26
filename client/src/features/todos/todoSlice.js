import { apiSlice } from '../../app/api/apiSlice';

export const todoApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: () => '/todos',
        }),

        getTodo: builder.query({
            query: (id) => `/todos/${id}`,
        }),

        createTodo: builder.mutation({
            query: (todo) => ({
                url: '/todos',
                method: 'POST',
                body: todo,
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        todoApiSlice.util.updateQueryData(
                            'getTodos',
                            undefined,
                            (draft) => {
                                draft.push(result.data);
                            }
                        )
                    );
                } catch (err) {
                    // do nothing
                }
            },
        }),

        updateTodo: builder.mutation({
            query: (todo) => ({
                url: `/todos/${todo.id}`,
                method: 'PUT',
                body: todo,
            }),

            async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        todoApiSlice.util.updateQueryData(
                            'getTodos',
                            undefined,
                            (draft) => {
                                const index = draft.findIndex(
                                    (t) => t._id === id
                                );
                                draft[index] = result.data;
                            }
                        )
                    );

                    // update getTodo query data
                    dispatch(
                        todoApiSlice.util.updateQueryData(
                            'getTodo',
                            id,
                            (draft) => {
                                return result.data;
                            }
                        )
                    );
                } catch (err) {
                    // do nothing
                }
            },
        }),

        deleteTodo: builder.mutation({
            query: (id) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
            }),

            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(
                        todoApiSlice.util.updateQueryData(
                            'getTodos',
                            undefined,
                            (draft) => {
                                const index = draft.findIndex(
                                    (t) => t._id === id
                                );
                                draft.splice(index, 1);
                            }
                        )
                    );

                    // remove getTodo query data
                    dispatch(
                        todoApiSlice.util.updateQueryData(
                            'getTodo',
                            id,
                            (draft) => {
                                draft = undefined;
                            }
                        )
                    );
                } catch (err) {
                    // do nothing
                }
            },
        }),
    }),
});

export const {
    useGetTodosQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useGetTodoQuery,
} = todoApiSlice;
