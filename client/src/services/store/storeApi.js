
const { canimApi } = require("../canim");

const storeApi = canimApi.injectEndpoints({
  endpoints: (builder) => ({
    // add new store
    addStore: builder.mutation({
      query: (store) => ({
        url: "/store/add-store",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: store,
      }),

      invalidatesTags: ["Store", "User"],
    }),

    // get all stores
    getStores: builder.query({
      query: () => ({
        url: "/store/get-stores",
        method: "GET",
      }),

      providesTags: ["Store"],
    }),

    // update store
    updateStore: builder.mutation({
      query: ({ id, body }) => ({
        url: `/store/update-store/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["Store", "User"],
    }),

    // get a store
    getStore: builder.query({
      query: (id) => ({
        url: `/store/get-store/${id}`,
        method: "GET",
      }),

      providesTags: ["Store"],
    }),

    // delete store
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/store/delete-store/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      invalidatesTags: ["Store", "User"],
    }),
  }),
});

export const {
  useAddStoreMutation,
  useGetStoresQuery,
  useUpdateStoreMutation,
  useGetStoreQuery,
  useDeleteStoreMutation,
} = storeApi;
