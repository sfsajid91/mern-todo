import { apiSlice } from '../../app/api/apiSlice';

export const todoApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: () => '/todos',
            keepUnusedDataFor: 5,
        }),
    }),
});

export const { useGetTodosQuery } = todoApiSlice;
