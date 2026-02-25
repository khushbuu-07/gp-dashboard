import { apiSlice } from './apiSlice';

const CLIENTS_URL = 'clients';
const FORMS_URL = 'forms';
const REQUEST_CALL_URL = 'request-call';

export const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    
    getClients: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: CLIENTS_URL,
        params: { page, limit },
      }),

      
      transformResponse: (response) => response.data,

      providesTags: (result) =>
        result?.clients
          ? [
              { type: 'Client', id: 'LIST' },
              ...result.clients.map((client) => ({
                type: 'Client',
                id: client._id,
              })),
            ]
          : [{ type: 'Client', id: 'LIST' }],

      keepUnusedDataFor: 5,
    }),

    getClient: builder.query({
      query: (clientId) => `${CLIENTS_URL}/${clientId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, arg) => [
        { type: 'Client', id: arg },
      ],
    }),

    getForms: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '' } = {}) => ({
        url: FORMS_URL,
        params: { page, limit, search, status },
      }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        Array.isArray(result?.data)
          ? [
              { type: 'Form', id: 'LIST' },
              ...result.data.map((form) => ({
                type: 'Form',
                id: form._id,
              })),
            ]
          : [{ type: 'Form', id: 'LIST' }],
      keepUnusedDataFor: 5,
    }),

    getFormByFormId: builder.query({
      query: (formId) => `${FORMS_URL}/${formId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, arg) => [
        { type: 'Form', id: result?._id || arg },
      ],
    }),

    submitForm: builder.mutation({
      query: (data) => ({
        url: `${FORMS_URL}/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Form', id: 'LIST' }],
    }),

    updateFormStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${FORMS_URL}/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Form', id: 'LIST' },
        { type: 'Form', id: arg.id },
      ],
    }),

    assignForm: builder.mutation({
      query: ({ id, userId }) => ({
        url: `${FORMS_URL}/${id}/assign`,
        method: 'PATCH',
        body: { userId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Form', id: 'LIST' },
        { type: 'Form', id: arg.id },
      ],
    }),

    deleteForm: builder.mutation({
      query: (id) => ({
        url: `${FORMS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Form', id: 'LIST' },
        { type: 'Form', id: arg },
      ],
    }),

    getRequestCalls: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: REQUEST_CALL_URL,
        params: { page, limit },
      }),
      transformResponse: (response) => response,
      keepUnusedDataFor: 5,
    }),

    addRequestCall: builder.mutation({
      query: (data) => ({
        url: REQUEST_CALL_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),

    updateRequestCall: builder.mutation({
      query: ({ id, data }) => ({
        url: `${REQUEST_CALL_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),

    deleteRequestCall: builder.mutation({
      query: (id) => ({
        url: `${REQUEST_CALL_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),


    addClient: builder.mutation({
      query: (data) => ({
        url: CLIENTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),

    
    updateClient: builder.mutation({
      query: (data) => ({
        url: `${CLIENTS_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Client', id: arg._id },
      ],
    }),

    
    deleteClient: builder.mutation({
      query: (clientId) => ({
        url: `${CLIENTS_URL}/${clientId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (r, e, arg) => [
        { type: 'Client', id: arg },
      ],
    }),

  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useGetFormsQuery,
  useGetFormByFormIdQuery,
  useLazyGetFormByFormIdQuery,
  useSubmitFormMutation,
  useUpdateFormStatusMutation,
  useAssignFormMutation,
  useDeleteFormMutation,
  useGetRequestCallsQuery,
  useAddRequestCallMutation,
  useUpdateRequestCallMutation,
  useDeleteRequestCallMutation,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApiSlice;
