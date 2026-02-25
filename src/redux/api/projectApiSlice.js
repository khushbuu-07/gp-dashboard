import { apiSlice } from "./apiSlice";

const PROJECTS_URL = "project";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: ({ page = 1, limit = 1000, search = "", status = "" } = {}) => ({
        url: PROJECTS_URL,
        params: { page, limit, search, status },
      }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        Array.isArray(result?.data)
          ? [
              { type: "Project", id: "LIST" },
              ...result.data.map((project) => ({ type: "Project", id: project._id })),
            ]
          : [{ type: "Project", id: "LIST" }],
      keepUnusedDataFor: 5,
    }),

    getProjectById: builder.query({
      query: (id) => `${PROJECTS_URL}/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, arg) => [{ type: "Project", id: result?._id || arg }],
    }),

    getPublicLiveProjects: builder.query({
      query: ({ page = 1, limit = 1000 } = {}) => ({
        url: `${PROJECTS_URL}/public/live`,
        params: { page, limit },
      }),
      transformResponse: (response) => response,
      providesTags: [{ type: "Project", id: "PUBLIC_LIVE" }],
    }),

    addProject: builder.mutation({
      query: (data) => ({
        url: PROJECTS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }, { type: "Project", id: "PUBLIC_LIVE" }],
    }),

    updateProject: builder.mutation({
      query: ({ _id, data }) => ({
        url: `${PROJECTS_URL}/${_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg._id },
        { type: "Project", id: "PUBLIC_LIVE" },
      ],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `${PROJECTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg },
        { type: "Project", id: "PUBLIC_LIVE" },
      ],
    }),

    incrementProjectApplications: builder.mutation({
      query: (id) => ({
        url: `${PROJECTS_URL}/${id}/applications`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetPublicLiveProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useIncrementProjectApplicationsMutation,
} = projectApiSlice;
