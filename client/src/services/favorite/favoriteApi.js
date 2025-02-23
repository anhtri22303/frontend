
const { canimApi } = require("../canim");

const favoriteApi = canimApi.injectEndpoints({
  endpoints: (build) => ({
    addToFavorite: build.mutation({
      query: (body) => ({
        url: `/favorite/add-to-favorite`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["Favorite", "User"],
    }),

    getFavorites: build.query({
      query: () => ({
        url: `/favorite/get-favorites`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      providesTags: ["Favorite"],
    }),

    removeFromFavorite: build.mutation({
      query: ({ id }) => ({
        url: `/favorite/delete-from-favorite/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      invalidatesTags: ["Favorite", "User"],
    }),
  }),
});

export const {
  useAddToFavoriteMutation,
  useGetFavoritesQuery,
  useRemoveFromFavoriteMutation,
} = favoriteApi;
