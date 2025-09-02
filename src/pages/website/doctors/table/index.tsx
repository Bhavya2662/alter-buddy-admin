import React, { useEffect, useState } from "react";

import { Layout } from "../../../../layout";
import {
     useDeleteMentorByIdMutation,
     useGetAllMentorQuery,
} from "../../../../app/api";
import { AppButton, PageTitle } from "../../../../component";
import DataTable, { TableColumn } from "react-data-table-component";
import { AiOutlineDelete, AiOutlineLoading } from "react-icons/ai";
import clsx from "clsx";
import { MdOutlineEdit, MdOutlineVerified } from "react-icons/md";
import { MdOutlineBlock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ICategoryProps, IMentorProps } from "../../../../interface";
import { toast } from "react-toastify";

export const DoctorsPage = () => {
     const navigate = useNavigate();
     const [
          DeleteMentor,
          {
               isLoading: isDeleteLoading,
               isError: isDeleteError,
               error: deleteError,
               isSuccess: isDeleteSuccess,
               data: deleteData,
          },
     ] = useDeleteMentorByIdMutation();
     const {
          data: mentors,
          isError: isMentorError,
          error: mentorError,
          isFetching: isMentorFetching,
     } = useGetAllMentorQuery();

     useEffect(() => {
          if (isMentorError) {
               console.log(mentorError);
          }
     }, [isMentorError, mentorError]);

     useEffect(() => {
          if (isDeleteError) {
               console.log(deleteError);
          }
     }, [isDeleteError, deleteError]);

     useEffect(() => {
          if (isDeleteSuccess) {
               toast.success(deleteData?.data);
          }
     }, [isDeleteSuccess, deleteData?.data]);

     const mentorColumn: TableColumn<IMentorProps>[] = [
          {
               id: "#",
               name: "#",
               width: "40px",
               cell: (_, i) => (
                    <div>
                         <p className="text-md">{i + 1}</p>
                    </div>
               ),
          },

          {
               id: "name",
               name: "Name",
               cell: ({ name, _id }) => {
                    return (
                         <p
                              className="text-gray-950 capitalize underline"
                              onClick={() =>
                                   navigate(`/mentors/new?mentor=${_id}`)
                              }
                         >
                              {name.firstName} {name.lastName}
                         </p>
                    );
               },
          },
          {
               id: "contact",
               name: "Contact Details",
               right: false,
               cell: ({ contact }) => {
                    return (
                         <div className="flex flex-col text-gray-500">
                              <p className="truncate">{contact.email}</p>
                              <p>{contact.mobile}</p>
                         </div>
                    );
               },
          },
          {
               id: "username",
               name: "Username",
               selector: (row) => row.auth.username,
          },
          {
               name: "Category",
               id: "specialists",
               cell: ({ category }) => (
                    <div className="flex gap-3 items-center flex-wrap capitalize text-gray-500">
                         {category.length
                              ? category.map((prop) =>
                                   (prop as ICategoryProps)?.title ? (
                                        `${(prop as ICategoryProps)?.title} `
                                   ) : (
                                        <p className="text-gray-500">N/A</p>
                                   )
                              )
                              : "N/A"}
                    </div>
               ),
          },

          {
               id: "status",
               name: "status",
               right: true,
               cell: ({ accountStatus, _id }) => {
                    return (
                         <div className="flex gap-3 items-center">
                              <button
                                   onClick={() =>
                                        navigate(`/mentors/new?mentor=${_id}`)
                                   }
                                   className="p-2 bg-gray-100 rounded-md"
                              >
                                   <MdOutlineEdit
                                        size={22}
                                        className={
                                             accountStatus.block
                                                  ? "fill-red-500"
                                                  : "fill-green-500"
                                        }
                                   />
                              </button>
                              <button className="p-2 bg-gray-100 rounded-md">
                                   <MdOutlineBlock
                                        size={22}
                                        className={
                                             accountStatus.block
                                                  ? "fill-red-500"
                                                  : "fill-green-500"
                                        }
                                   />
                              </button>
                              <button className="p-2 bg-gray-100 rounded-md">
                                   <MdOutlineVerified
                                        size={22}
                                        className={clsx(
                                             accountStatus.verification
                                                  ? "fill-red-500"
                                                  : "fill-green-500"
                                        )}
                                   />
                              </button>
                              <button
                                   onClick={async () =>
                                        await DeleteMentor(_id as string)
                                   }
                                   className="p-2 bg-gray-100 rounded-md"
                              >
                                   <AiOutlineDelete size={22} />
                              </button>
                         </div>
                    );
               },
          },
     ];

     const [query, setQuery] = useState("");

     const filteredMentors = (mentors?.data || []).filter(user =>
          `${user.name?.firstName ?? ""} ${user.name?.lastName ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );
     return (
          <Layout pageTitle="Manage Mentors">
               <PageTitle
                    title="Manage Mentors"
                    subTitle="You can manage mentors lists from here"
               />
               <div className="p-3 mb-5">
                    <div className="flex items-center justify-between">
                         <p>Total Mentors - {mentors?.data.length}</p>
                         <div className="flex items-center gap-5">
                              <input
                                   type="text"
                                   placeholder="Search Mentors"
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                   className="border px-3 py-2 w-[100%] md:w-[50%] rounded-md"
                              />
                              <AppButton
                                   primary
                                   onClick={() => navigate("/mentors/new")}
                              >
                                   Add New Mentor
                              </AppButton>
                              {/* <AppButton
                                   primary
                                   onClick={() =>
                                        navigate("/mentors/categories")
                                   }
                              >
                                   Categories
                              </AppButton> */}
                         </div>
                    </div>
               </div>
               {isMentorFetching && isDeleteLoading && (
                    <div className="flex justify-center flex-col items-center gap-4">
                         <AiOutlineLoading
                              size={150}
                              className="animate-spin text-primary-500"
                         />
                         <p className="text-gray-500 font-mono">
                              Mentors are loading....
                         </p>
                    </div>
               )}
               {!isMentorFetching &&
                    !isDeleteLoading &&
                    mentors?.data.length !== 0 && (
                         <DataTable
                              pagination
                              className="table table-fixed"
                              paginationPerPage={20}
                              noDataComponent={
                                   <div>
                                        <h6>There are no mentor to show</h6>
                                        <AppButton primary>
                                             New Mentor
                                        </AppButton>
                                   </div>
                              }
                              progressComponent={
                                   <div className="">
                                        <AiOutlineLoading size={150} />
                                        <p>Mentors are loading....</p>
                                   </div>
                              }
                              data={filteredMentors}
                              columns={mentorColumn}
                         />
                    )}
          </Layout>
     );
};
