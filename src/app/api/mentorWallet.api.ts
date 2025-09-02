// src/app/api/mentorWallet.api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";

// Shape your backend returns: { total, transactions }
export interface MentorWalletHistoryItem {
  _id: string;
  createdAt: string;
  mentorId?: { _id: string; name?: { firstName?: string; lastName?: string } } | string;
  userId?: { _id: string; name?: { firstName?: string; lastName?: string } } | string;
  description?: string;            // if you store it
  transactionType?: string;        // e.g., "Mentor confirmed session"
  status?: string;                 // e.g., "Confirmed"
  amount?: number | string;        // gross amount
  // add any other fields you store in MentorWallet
}

type MentorWalletHistoryResponse = {
  total: number;
  data: MentorWalletHistoryItem[];
};

export const mentorWalletApi = createApi({
  baseQuery: fetchBaseQuery(baseQuery),
  reducerPath: "mentorWalletApi",
  endpoints: (build) => ({
    // GET /mentor-wallet/admin  (no filters, returns all)
    getAllMentorWalletHistory: build.query<MentorWalletHistoryResponse, void>({
      query: () => "/admin/mentor-wallet/history",
    }),
  }),
});

export const mentorWalletApiReducer = mentorWalletApi.reducer;
export const mentorWalletApiMiddleware = mentorWalletApi.middleware;
export const { useGetAllMentorWalletHistoryQuery } = mentorWalletApi;
