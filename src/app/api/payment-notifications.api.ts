import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";

export interface PaymentNotification {
  _id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  transactionId: string;
  paymentId: string;
  status: 'success' | 'failed';
  transactionType: string;
  timestamp: string;
  mentorId?: string;
  sessionType?: string;
  source: string;
  createdAt?: string;
  updatedAt?: string;
}

const PaymentNotificationsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: typeof window !== 'undefined' && window.location.hostname === 'alterbuddy.com'
      ? 'https://alterbuddy.com/api'
      : 'http://localhost:3002/api',
  }),
  reducerPath: "paymentNotificationsApi",
  tagTypes: ['PaymentNotification'],
  endpoints: (builder) => ({
    getPaymentNotifications: builder.query<{ data: PaymentNotification[] }, void>({
      query: () => "/payment-notifications",
      providesTags: ['PaymentNotification'],
    }),
    getPaymentNotificationById: builder.query<{ data: PaymentNotification }, string>({
      query: (id) => `/payment-notifications/${id}`,
      providesTags: (result, error, id) => [{ type: 'PaymentNotification', id }],
    }),
  }),
});

export const PaymentNotificationsApiReducer = PaymentNotificationsApi.reducer;
export const PaymentNotificationsApiMiddleware = PaymentNotificationsApi.middleware;
export const {
  useGetPaymentNotificationsQuery,
  useGetPaymentNotificationByIdQuery,
} = PaymentNotificationsApi;