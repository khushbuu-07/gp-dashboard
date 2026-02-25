import { apiSlice } from './apiSlice';

const CLIENTS_URL = 'clients';

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
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApiSlice;