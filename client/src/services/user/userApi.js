
const { canimApi } = require("../canim");

const userApi = canimApi.injectEndpoints({
  endpoints: (builder) => ({
    // get all users
    getUsers: builder.query({
      query: () => ({
        url: "/user/all-users",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      providesTags: ["User"],
    }),

    // get user
    getUser: builder.query({
      query: (id) => ({
        url: `/user/get-user/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      providesTags: ["User"],
    }),

    // update user
    updateUser: builder.mutation({
      query: (body) => ({
        url: `/user/update-information`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["User"],
    }),

    // user single user
    updateUserInfo: builder.mutation({
      query: ({ id, body }) => ({
        url: `/user/update-user/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["User"],
    }),

    // delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete-user/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      invalidatesTags: ["User"],
    }),

    // get seller request
    getSellerRequest: builder.query({
      query: () => ({
        url: "/user/seller-review",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      providesTags: ["User"],
    }),

    // review seller
    reviewSeller: builder.mutation({
      query: ({ id, body }) => ({
        url: `/user/seller-review?id=${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateUserInfoMutation,
  useDeleteUserMutation,
  useGetSellerRequestQuery,
  useReviewSellerMutation,
} = userApi;
