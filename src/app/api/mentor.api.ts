import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils";
import { IMentorProps } from "../../interface";

const MentorApi = createApi({
     baseQuery: fetchBaseQuery(baseQuery),
     reducerPath: "mentorApi",
     tagTypes: ["mentorApi"],
     endpoints: ({ mutation, query }) => ({
          GetAllMentor: query<{ data: IMentorProps[] }, void>({
               query: () => `/mentor`,
               providesTags: ["mentorApi"],
          }),
          GetMentorById: query<{ data: IMentorProps }, string>({
               query: (id: string) => `/mentor/profile/${id}`,
               providesTags: ["mentorApi"],
          }),
          CreateNewMentor: mutation<{ data: string }, IMentorProps>({
               query: (payload) => {
                    return {
                         url: "/mentor/sign-up",
                         body: {
                              ...payload,
                         },
                         method: "POST",
                    };
               },
               invalidatesTags: ["mentorApi"],
          }),
          DeleteMentorById: mutation<{ data: string }, string>({
               query: (id) => {
                    return {
                         url: `/mentor/${id}`,
                         method: "DELETE",
                    };
               },
               invalidatesTags: ["mentorApi"],
          }),
          UpdateMentorById: mutation<
               { data: string },
               { mentorId: string; payload: Partial<IMentorProps> }
          >({
               query: ({ payload, mentorId }) => {
                    return {
                         url: `/mentor/update/${mentorId}`,
                         method: "PUT",
                         body: { ...payload },
                    };
               },
               invalidatesTags: ["mentorApi"],
          }),
     }),
});

export const MentorApiReducer = MentorApi.reducer;
export const MentorApiMiddleware = MentorApi.middleware;
export const {
     useGetAllMentorQuery,
     useLazyGetMentorByIdQuery,
     useCreateNewMentorMutation,
     useUpdateMentorByIdMutation,
     useDeleteMentorByIdMutation,
} = MentorApi;
