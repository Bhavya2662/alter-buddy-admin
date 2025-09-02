import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import { toast } from "react-toastify";

import { Layout } from "../../../../layout";
import {
     useLazyGetMentorByIdQuery,
     useLazyGetAllCategoryQuery,
     useUpdateMentorByIdMutation,
} from "../../../../app/api";
import { AppInput, AppButton } from "../../../../component/ui";
import { MentorValidationSchema } from "../../../../validation";
import { PageTitle } from "../../../../component";
import { ICategoryProps, IMentorProps } from "../../../../interface";
import { AiOutlineClose } from "react-icons/ai";

export const MentorDetailsPage = () => {
     const { mentorId } = useParams();
     const [
          GetMentor,
          {
               data: mentor,
               isError: isMentorError,
               isFetching: isMentorLoading,
               error: mentorError,
          },
     ] = useLazyGetMentorByIdQuery();
     const [
          GetAllCategory,
          {
               isError: isCategoryError,
               error: categoryError,
               isLoading: isCategoryLoading,
               data: categoryData,
          },
     ] = useLazyGetAllCategoryQuery();

     const [
          UpdateMentor,
          {
               isLoading: isMentorUpdateLoading,
               isError: isMentorUpdateError,
               error: mentorUpdateError,
          },
     ] = useUpdateMentorByIdMutation();

     useEffect(() => {
          if (mentorId) {
               if (isMentorError) {
                    console.log(mentorError);
               }
               if (isCategoryError) {
                    console.log(categoryError);
               }

               if (isMentorUpdateError) {
                    console.log(mentorUpdateError);
               }
               (async () => {
                    await GetMentor(mentorId);
                    await GetAllCategory();
               })();
          }
     }, [
          mentorId,
          isMentorError,
          mentorError,
          GetMentor,
          GetAllCategory,
          isCategoryError,
          categoryError,
          isMentorUpdateError,
          mentorUpdateError,
     ]);

     const handleSubmit = async (e: any) => {
          const mentorDetails = {
               auth: {
                    username: e.username,
                    password: e.password,
               },
               contact: {
                    address: e.address,
                    email: e.email,
                    mobile: e.mobile,
               },
               name: {
                    firstName: e.firstName,
                    lastName: e.lastName,
               },
               category: e.category as string,
               specialists: [],
          };

          await UpdateMentor({ ...(mentorDetails as any) });
          toast.success("Mentor details updated successfully");
     };

     return (
          <Layout
               pageTitle={`${mentor?.data.name.firstName} ${mentor?.data.name.lastName} details`}
          >
               {isMentorLoading && (
                    <div className="flex flex-col h-[400px] justify-center items-center">
                         <p className="text-gray-500 uppercase text-2xl animate-pulse">
                              Getting mentor details
                         </p>
                    </div>
               )}
               {!isMentorLoading &&
                    !isCategoryLoading &&
                    !isMentorUpdateLoading && (
                         <div>
                              <PageTitle
                                   title={`${mentor?.data.name.firstName} ${mentor?.data.name.lastName} details`}
                              />
                         </div>
                    )}
               {!isMentorLoading &&
                    !isCategoryLoading &&
                    !isMentorUpdateLoading && (
                         <Formik
                              onSubmit={handleSubmit}
                              initialValues={{
                                   ...mentor?.data,
                                   ...mentor?.data.name,
                                   ...mentor?.data.contact,
                                   ...mentor?.data.auth,
                                   category: (
                                        (mentor?.data as IMentorProps)
                                             ?.category as ICategoryProps[]
                                   )?.map((prop) => {
                                        return prop._id;
                                   }),
                              }}
                              enableReinitialize
                              validationSchema={MentorValidationSchema}
                         >
                              {({
                                   handleBlur,
                                   handleChange,
                                   handleSubmit,
                                   values,
                                   touched,
                                   errors,
                              }) => (
                                   <form onSubmit={handleSubmit}>
                                        <div className="flex w-full items-center gap-5">
                                             <div className="flex-1">
                                                  <AppInput
                                                       label="First name"
                                                       value={values.firstName}
                                                       onChange={handleChange(
                                                            "firstName"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "firstName"
                                                       )}
                                                       touched={
                                                            touched?.firstName
                                                       }
                                                       error={
                                                            errors?.firstName as string
                                                       }
                                                  />
                                             </div>
                                             <div className="flex-1">
                                                  <AppInput
                                                       label="Last name"
                                                       value={values.lastName}
                                                       onChange={handleChange(
                                                            "lastName"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "lastName"
                                                       )}
                                                       touched={
                                                            touched.lastName as boolean
                                                       }
                                                       error={
                                                            errors.lastName as string
                                                       }
                                                  />
                                             </div>
                                        </div>
                                        <div className="flex gap-5 mt-5">
                                             <div className="flex-1">
                                                  <AppInput
                                                       label="Mobile number"
                                                       value={values.mobile}
                                                       onChange={handleChange(
                                                            "mobile"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "mobile"
                                                       )}
                                                       touched={
                                                            touched?.mobile as boolean
                                                       }
                                                       error={
                                                            errors?.mobile as string
                                                       }
                                                  />
                                             </div>
                                             <div className="flex-1">
                                                  <AppInput
                                                       label="Email address"
                                                       value={values.email}
                                                       onChange={handleChange(
                                                            "email"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "email"
                                                       )}
                                                       touched={
                                                            touched.email as boolean
                                                       }
                                                       error={
                                                            errors.email as string
                                                       }
                                                  />
                                             </div>
                                             <div className="flex-1">
                                                  <AppInput
                                                       label="Address"
                                                       value={values.address}
                                                       onChange={handleChange(
                                                            "address"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "address"
                                                       )}
                                                       touched={
                                                            touched?.address as boolean
                                                       }
                                                       error={
                                                            errors?.address as string
                                                       }
                                                  />
                                             </div>
                                        </div>
                                        <div className="flex gap-5">
                                             {mentor?.data.category.map(
                                                  (category) => (
                                                       <div className="flex gap-5 mt-5 bg-gray-200 px-3 py-2 rounded-md capitalize items-center">
                                                            <AiOutlineClose />
                                                            {
                                                                 (
                                                                      category as ICategoryProps
                                                                 ).title
                                                            }
                                                       </div>
                                                  )
                                             )}
                                        </div>
                                        <div className="flex gap-5 mt-5">
                                             <div className="flex-1">
                                                  <label
                                                       htmlFor="category"
                                                       className="capitalize text-gray-500 text-sm"
                                                  >
                                                       Category
                                                  </label>
                                                  <select
                                                       onChange={handleChange(
                                                            "category"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "category"
                                                       )}
                                                       value={
                                                            values.category as any
                                                       }
                                                       className="p-3 w-full border focus:border-teacher-500 rounded-md focus:outline-none"
                                                       required
                                                  >
                                                       <option
                                                            defaultValue="none"
                                                            disabled
                                                            selected
                                                       >
                                                            Select category
                                                       </option>
                                                       <option value="none">
                                                            None
                                                       </option>
                                                       {categoryData?.data.map(
                                                            (category) => (
                                                                 <option
                                                                      value={
                                                                           category?._id
                                                                      }
                                                                      key={
                                                                           category?._id
                                                                      }
                                                                 >
                                                                      {
                                                                           category.title
                                                                      }
                                                                 </option>
                                                            )
                                                       )}
                                                  </select>
                                                  {touched.category && (
                                                       <p className="text-right text-xs capitalize text-rose-500">
                                                            {errors.category}
                                                       </p>
                                                  )}
                                             </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-5">
                                             <div className="flex-1">
                                                  <AppInput
                                                       label="Spealists"
                                                       value={
                                                            values.specialists
                                                       }
                                                       onChange={handleChange(
                                                            "specialists"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "specialists"
                                                       )}
                                                       touched={
                                                            touched.specialists
                                                       }
                                                       error={
                                                            errors.specialists
                                                       }
                                                  />
                                             </div>
                                             <div className="flex-1">
                                                  <AppInput
                                                       label="Userame"
                                                       value={values.username}
                                                       onChange={handleChange(
                                                            "username"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "username"
                                                       )}
                                                       touched={
                                                            touched.username
                                                       }
                                                       error={errors.username}
                                                  />
                                             </div>
                                        </div>
                                        <div className="mt-3">
                                             <div className="flex-1">
                                                  <AppInput
                                                       label="Password"
                                                       value={values.password}
                                                       onChange={handleChange(
                                                            "password"
                                                       )}
                                                       onBlur={handleBlur(
                                                            "password"
                                                       )}
                                                       touched={
                                                            touched.password
                                                       }
                                                  />
                                                  {touched.password && (
                                                       <p className="text-right text-xs capitalize text-rose-500">
                                                            {errors.password}
                                                       </p>
                                                  )}
                                             </div>
                                        </div>
                                        <div className="flex justify-end mt-5">
                                             <AppButton primary type="submit">
                                                  Save details
                                             </AppButton>
                                        </div>
                                   </form>
                              )}
                         </Formik>
                    )}
          </Layout>
     );
};
