import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";
import { IUserProps } from "../../interface/user.interface";

const UserApi = createApi({
  baseQuery: fetchBaseQuery(baseQuery),
  reducerPath: "userApi",
  tagTypes: ["userApi"],
  endpoints: ({ query }) => ({
    GetAllUser: query<{ data: IUserProps[] }, void>({
      query: () => `/website/users`,
      providesTags: ["userApi"],
    }),
    GetUserById: query<{ data: IUserProps }, string>({
      query: (id: string) => `/website/users/${id}`,
      providesTags: ["userApi"],
    }),
  }),
});

export const UserApiReducer = UserApi.reducer;
export const UserApiMiddleware = UserApi.middleware;
export const { useGetAllUserQuery, useLazyGetUserByIdQuery } = UserApi;
