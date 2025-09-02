import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";
import { ISignInProps } from "../../interface";

const AccountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery(baseQuery),
  tagTypes: ["accountApi"],
  endpoints: ({ mutation }) => ({
    LoginAdminAccount: mutation<
      { data: { token: string; user: string } },
      ISignInProps
    >({
      query: ({ email, password }: ISignInProps) => {
        return {
          url: `/admin/sign-in`,
          body: {
            email,
            password,
          },
          method: "PUT",
        };
      },
      invalidatesTags: ["accountApi"],
    }),
    LogoutAdminAccount: mutation<{ data: string }, void>({
      query: () => {
        return {
          url: "/mentor/sign-out",
          method: "POST",
        };
      },
      invalidatesTags: ["accountApi"],
    }),
  }),
});

export const AccountApiMiddleware = AccountApi.middleware;
export const AccountApiReducer = AccountApi.reducer;
export const { useLoginAdminAccountMutation, useLogoutAdminAccountMutation } =
  AccountApi;
