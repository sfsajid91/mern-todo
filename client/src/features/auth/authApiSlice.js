import { apiSlice } from '../../app/api/apiSlice';
import { logOut } from './authSlice';

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

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut());
                } catch (err) {
                    // do nothing
                }
            },
        }),

        confirmEmail: builder.query({
            query: (token) => `/auth/confirm/${token}`,
        }),

        sendResetPasswordEmail: builder.mutation({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { ...data },
            }),
        }),

        validToken: builder.query({
            query: (token) => `/auth/reset-password/${token}`,
        }),

        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `/auth/reset-password/${token}`,
                method: 'PUT',
                body: { password },
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useRefreshMutation,
    useLogoutMutation,
    useConfirmEmailQuery,
    useSendResetPasswordEmailMutation,
    useResetPasswordMutation,
    useValidTokenQuery,
} = authApiSlice;
