import React, { useEffect } from "react";

import { Layout } from "../../../../layout";
import {
  useLazyGetAllCategoryQuery,
  useCreateNewCategoryMutation,
  useDeleteCategoryByIdMutation,
} from "../../../../app/api";
import { AppButton, AppInput, PageTitle } from "../../../../component";
import { AiOutlineDelete, AiOutlineLoading } from "react-icons/ai";
import { useAppDispatch } from "../../../../app/hooks";
import {
  handleNewCategoryModel,
  useCategorySlice,
} from "../../../../app/features";
import { Formik } from "formik";
import {
  CategoryValidationSchema,
  initialCategoryValues,
} from "../../../../validation";
import { ICategoryProps } from "../../../../interface";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const data = ["Tarot Reading", "Past Life Regression", "Akashic Records", "Automatic Writing"]

export const ManageCategoryTwo = () => {
  
  return (
    <Layout pageTitle="Manage Categories">
      <div>
        <PageTitle
          title={`Manage Categories`}
          subTitle="You can manage mentor types here e.g Healers, Buddy, Genie"
        />
      </div>
      <div className="flex justify-end items-center mb-8 gap-3">
        {/* <AppButton primary onClick={() => navigate("/mentors/manage")}>
          Mentor List
        </AppButton> */}
        <AppButton
          primary
          // onClick={() =>
          //   dispatch(handleNewCategoryModel({ newModel: true } as any))
          // }
        >
          Add New Category
        </AppButton>
      </div>
      
          <div className="grid xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.map(( item ) => (
              <div
                key={item}
                className="relative group border border-solid border-gray-200 rounded-2xl p-4 transition-all duration-500"
              >
                <div className=" mb-6 ">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.66699 12.8162L11.3501 15.4993C11.5616 15.7107 11.9043 15.7109 12.1158 15.4997L17.8753 9.75033M13.0003 23.8337C7.01724 23.8337 2.16699 18.9834 2.16699 13.0003C2.16699 7.01724 7.01724 2.16699 13.0003 2.16699C18.9834 2.16699 23.8337 7.01724 23.8337 13.0003C23.8337 18.9834 18.9834 23.8337 13.0003 23.8337Z"
                      // stroke="#4F46E5"
                      className={
                        !true ? "stroke-red-500" : "stroke-green-500"
                      }
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2 capitalize transition-all duration-500 ">
                  {item}
                </h4>
                <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 ">
                  Provides faster transaction, so money arrives in realtime
                </p>
                <div className="flex justify-between mt-3 items-center">
                  <p className="text-sm text-gray-500">
                    {/* {moment(createdAt).format("Do MMM YYYY hh:mm A")} */}
                  </p>
                  <button
                    // onClick={() => DeleteAction(_id as string)}
                    className="border border-transparent group-hover:border-red-500 p-1 rounded-md"
                  >
                    <AiOutlineDelete
                      size={20}
                      className="group-hover:fill-red-500"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
    </Layout>
  );
};
