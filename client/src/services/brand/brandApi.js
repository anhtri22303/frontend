
const { canimApi } = require("../canim");

const brandApi = canimApi.injectEndpoints({
  endpoints: (builder) => ({
    // add new brand
    addBrand: builder.mutation({
      query: (body) => ({
        url: "/brand/add-brand",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["Brand", "User"],
    }),

    // get all brands
    getBrands: builder.query({
      query: () => ({
        url: "/brand/get-brands",
        method: "GET",
      }),

      providesTags: ["Brand"],
    }),

    // update brand
    updateBrand: builder.mutation({
      query: ({ id, body }) => ({
        url: `/brand/update-brand/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["Brand", "User"],
    }),

    // get a brand
    getBrand: builder.query({
      query: (id) => ({
        url: `/brand/get-brand/${id}`,
        method: "GET",
      }),

      providesTags: ["Brand"],
    }),

    // delete a brand
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brand/delete-brand/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      invalidatesTags: ["Brand", "User"],
    }),
  }),
});

export const {
  useAddBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
  useGetBrandQuery,
  useDeleteBrandMutation,
} = brandApi;
