import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";
import { IPackagesProps } from "../../interface";

const PackagesApi = createApi({
  baseQuery: fetchBaseQuery(baseQuery),
  reducerPath: "packagesApi",
  tagTypes: ["packagesApi"],
  endpoints: ({ mutation, query }) => ({
    GetAllPackages: query<{ data: IPackagesProps[] }, void>({
      query: () => "/packages",
      providesTags: ["packagesApi"],
    }),
    CreateNewPackages: mutation<{ data: string }, IPackagesProps>({
      query: ({ ...payload }) => {
        return {
          url: "/packages",
          method: "POST",
          body: {
            ...payload,
          },
        };
      },
      invalidatesTags: ["packagesApi"],
    }),
    UpdatePackages: mutation<{ data: string }, Partial<IPackagesProps>>({
      query: ({ _id, ...payload }) => {
        return {
          url: `/packages/${_id}`,
          method: "PUT",
          body: {
            ...payload,
          },
        };
      },
      invalidatesTags: ["packagesApi"],
    }),
    DeletePackages: mutation<{ data: string }, string>({
      query: (_id) => {
        return {
          url: `/packages/${_id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["packagesApi"],
    }),
  }),
});

export const PackagesApiReducer = PackagesApi.reducer;
export const PackagesApiMiddleware = PackagesApi.middleware;
export const {
  useCreateNewPackagesMutation,
  useDeletePackagesMutation,
  useGetAllPackagesQuery,
  useUpdatePackagesMutation,
  useLazyGetAllPackagesQuery,
} = PackagesApi;
