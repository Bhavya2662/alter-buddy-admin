import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";
import { IBuddyCoinsProps } from "../../interface";

export type WalletTxn = {
  _id?: string;
  amount?: number | string;
  creditAmt?: number | string;
  debitAmt?: number | string;
  closingBal?: number | string;
  createdAt?: string;
  transactionId?: string;
  transactionType?: string;
  status?: string;
  description?: string;
};
const WalletApi = createApi({
  baseQuery: fetchBaseQuery(baseQuery),
  reducerPath: "walletApi",
  tagTypes: ['Wallet', 'Transaction'],
  endpoints: (builder) => ({
    getWallet: builder.query<{ data: IBuddyCoinsProps[] }, void>({
      query: () => "/wallets",
      providesTags: ['Wallet'],
    }),
    getWalletTransactionsByUser: builder.query<WalletTxn[], string>({
      query: (userId: string) => `/wallets/${userId}/transactions`,
      providesTags: (result, error, userId) => [{ type: 'Transaction', id: userId }],
    }),
    getAllTransactions: builder.query<WalletTxn[], void>({
      query: () => `/admin/transactions`,
      providesTags: ['Transaction'],
    }),
    getUserTransactions: builder.query<WalletTxn[], string>({
      query: (userId: string) => `/admin/users/${userId}/transactions`,
      providesTags: (result, error, userId) => [{ type: 'Transaction', id: userId }],
    }),
  }),
});

export const WalletApiReducer = WalletApi.reducer;
export const WalletApiMiddleware = WalletApi.middleware;
export const {
  useGetWalletQuery,
  useGetWalletTransactionsByUserQuery,
  useLazyGetWalletTransactionsByUserQuery,
  useGetAllTransactionsQuery,
  useGetUserTransactionsQuery,
  useLazyGetUserTransactionsQuery,
} = WalletApi;
