import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://global-project-ek8i.onrender.com/api/v1/';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const user = getState().auth?.user;
      // Check for token in direct properties or nested in data object based on API response structure
      const token = user?.data?.token || user?.token || user?.accessToken || user?.access_token;
      console.log('Token being sent:', token); // Debugging log

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['User', 'Project', 'Blog', 'Query'],
  endpoints: () => ({}),
});