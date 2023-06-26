import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const { token } = getState().auth;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        // 403 means access token is expired

        // re-authenticate with refresh token
        const refreshResult = await baseQuery(
            '/auth/refresh',
            api,
            extraOptions
        );

        if (refreshResult?.data) {
            const { user } = api.getState().auth;
            // set new access token
            api.dispatch(
                setCredentials({
                    user,
                    accessToken: refreshResult.data.accessToken,
                })
            );

            // retry original request with new access token

            result = await baseQuery(args, api, extraOptions);
        } else {
            // refresh token failed, log out
            api.dispatch(logOut());
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({}),
});
