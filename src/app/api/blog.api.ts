import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";
import { IBlogsProps } from "../../interface";

const BlogApi = createApi({
  baseQuery: fetchBaseQuery(baseQuery),
  reducerPath: "blogApi",
  tagTypes: ["blogApi"],
  endpoints: ({ mutation, query }) => ({
    GetAllBlogs: query<{ data: IBlogsProps[] }, void>({
      query: () => `/blog`,
      providesTags: ["blogApi"],
    }),
    CreateNewBlog: mutation<{ data: string }, IBlogsProps>({
      query: (payload) => {
        return {
          url: "/blog",
          body: {
            ...payload,
          },
          method: "POST",
        };
      },
      invalidatesTags: ["blogApi"],
    }),
    DeleteBlogById: mutation<{ data: string }, string>({
      query: (id) => {
        return {
          url: `/blog/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["blogApi"],
    }),
    UpdateBlog: mutation<{ data: string }, Partial<IBlogsProps>>({
      query: ({ _id, ...payload }) => {
        return {
          url: `/blog/${_id}`,
          method: "PUT",
          body: {
            ...payload,
          },
        };
      },
    }),
  }),
});

export const BlogApiReducer = BlogApi.reducer;
export const BlogApiMiddleware = BlogApi.middleware;
export const {
  useGetAllBlogsQuery,
  useCreateNewBlogMutation,
  useDeleteBlogByIdMutation,
  useUpdateBlogMutation,
} = BlogApi;
