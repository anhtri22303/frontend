
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const canimApi = createApi({
  reducerPath: "canimApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  }),
  tagTypes: [
    "User",
    "Product",
    "Brand",
    "Category",
    "Store",
    "Cart",
    "Favorite",
    "Purchase",
    "Review",
  ],
  endpoints: () => ({}),
});
