// app/api/category.api.ts  (your file)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";
import { ICategoryProps } from "../../interface";

const CategoryApi = createApi({
  baseQuery: fetchBaseQuery(baseQuery),
  reducerPath: "categoryApi",
  tagTypes: ["categoryApi"],
  endpoints: ({ query, mutation }) => ({
    getAllCategory: query<{ data: ICategoryProps[] }, void>({
      query: () => `/category`,
      providesTags: ["categoryApi"],
    }),
    getCategoryById: query<{ data: ICategoryProps }, string>({
      query: (id) => `/category/${id}`,
      providesTags: ["categoryApi"],
    }),
    CreateNewCategory: mutation<{ data: string }, ICategoryProps>({
      query: (payload) => ({
        url: "/category",
        method: "POST",
        body: payload,            // <- send as JSON
      }),
      invalidatesTags: ["categoryApi"],
    }),

    // ✅ NEW: update
    updateCategoryById: mutation<
      { data: string } | { data: ICategoryProps },
      { id: string; body: Partial<ICategoryProps> }
    >({
      query: ({ id, body }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body,                     // <- send as JSON
      }),
      invalidatesTags: ["categoryApi"],
    }),
    DeleteCategoryById: mutation<{ data: string }, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categoryApi"],   // <- ensure list refetches
    }),
  }),
});

export const CategoryApiReducer = CategoryApi.reducer;
export const CategoryApiMiddleware = CategoryApi.middleware;
export const {
  useLazyGetAllCategoryQuery,
  useGetCategoryByIdQuery,
  useLazyGetCategoryByIdQuery,
  useGetAllCategoryQuery,
  useCreateNewCategoryMutation,
  useDeleteCategoryByIdMutation,
  useUpdateCategoryByIdMutation,
} = CategoryApi;
