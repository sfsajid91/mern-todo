import { apiSlice } from '../../app/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials },
            }),
        }),

        signup: builder.mutation({
            query: (credentials) => ({
                url: '/auth/signup',
                method: 'POST',
                body: { ...credentials },
            }),
        }),

        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'GET',
            }),
        }),

        confirmEmail: builder.query({
            query: (token) => `/auth/confirm/${token}`,
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useRefreshMutation,
    useLogoutMutation,
    useConfirmEmailQuery,
} = authApiSlice;
