import { apiSlice } from "./apiSlice";
import { toast } from "../../utils/toast";

const USERS_URL = "users/";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: USERS_URL,
        params: { page, limit },
      }),
      transformResponse: (response) => {
        if (response?.message?.users) return response.message;
        if (response?.data?.users) return response.data;
        if (Array.isArray(response?.users)) return response;
        return { users: [], pagination: null };
      },
      keepUnusedDataFor: 5,
    }),

    addUser: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        const tid = toast.loading("Creating user...");
        try {
          await queryFulfilled;
          toast.update(tid, { type: "success", message: "User created successfully" });
        } catch (err) {
          toast.update(tid, {
            type: "error",
            message: err?.error?.data?.message || "Failed to create user",
          });
        }
      },
    }),
  }),
});

export const { useGetUsersQuery, useAddUserMutation } = userApiSlice;
