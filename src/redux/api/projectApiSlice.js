import { apiSlice } from './apiSlice';

const PROJECTS_URL = 'project'; // FIXED (singular)

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getProjects: builder.query({
      query: () => ({
        url: PROJECTS_URL,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: 'Project', id: 'LIST' },
              ...result.data.map((project) => ({
                type: 'Project',
                id: project._id,
              })),
            ]
          : [{ type: 'Project', id: 'LIST' }],
      keepUnusedDataFor: 5,
    }),

    getProject: builder.query({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/${projectId}`,
      }),
      providesTags: (result, error, arg) => [
        { type: 'Project', id: arg },
      ],
    }),

    addProject: builder.mutation({
      query: (data) => ({
        url: PROJECTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    updateProject: builder.mutation({
      query: ({ _id, data }) => ({
        url: `${PROJECTS_URL}/${_id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Project', id: arg._id },
      ],
    }),

    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/${projectId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Project', id: arg },
      ],
    }),

    updateProjectStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${PROJECTS_URL}/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Project', id: arg.id },
      ],
    }),

    toggleProjectFeature: builder.mutation({
      query: (id) => ({
        url: `${PROJECTS_URL}/${id}/feature`,
        method: 'PATCH',
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Project', id: arg },
      ],
    }),

  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectStatusMutation,
  useToggleProjectFeatureMutation,
} = projectApiSlice;