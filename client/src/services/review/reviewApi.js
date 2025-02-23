
const { canimApi } = require("../canim");

const reviewApi = canimApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Review
    addReview: builder.mutation({
      query: (body) => ({
        url: "/review/add-review",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body,
      }),

      invalidatesTags: ["Review", "Product", "User"],
    }),

    // remove review
    removeReview: builder.mutation({
      query: (id) => ({
        url: `/review/delete-review/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      invalidatesTags: ["Review", "Product", "User"],
    }),
  }),
});

export const { useAddReviewMutation, useRemoveReviewMutation } = reviewApi;
