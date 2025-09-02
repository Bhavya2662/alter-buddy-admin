import React, { useEffect, useState } from "react";

import { Layout } from "../../../../layout";
import { useGetAllUserQuery } from "../../../../app/api";
import { PageTitle } from "../../../../component";
import {
  AiOutlineDelete,
  AiOutlineLoading,
  AiOutlineMail,
  AiOutlinePhone,
} from "react-icons/ai";
import { FaCircle } from "react-icons/fa";
import { LiaUserTimesSolid, LiaUserCheckSolid } from "react-icons/lia";
import { MdOutlineBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import DataTable from "react-data-table-component";


export const UsersPage = () => {

  const [query, setQuery] = useState("");
 
  const {
    isError: isUsersError,
    error: usersError,
    isLoading: isUsersLoading,
    data: usersData,
  } = useGetAllUserQuery();

  useEffect(() => {
    if (isUsersError) {
      console.log(usersError);
    }
  }, [isUsersError, usersError, usersData]);

  const filteredUsers = (usersData?.data || []).filter(user =>
    `${user.name?.firstName ?? ""} ${user.name?.lastName ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <Layout pageTitle="Manage Users">
      <div>
        <PageTitle
          title={`Manage Users`}
          subTitle="You can manage the users from here"
        />
      </div>
      <div className="w-full flex justify-end mb-4">
  <input
    type="text"
    placeholder="Search Users"
    value={query}
    onChange={e => setQuery(e.target.value)}
    className="border p-2 w-[100%] md:w-[30%] rounded-md"
  />
</div>
      {isUsersLoading && (
        <div className="flex justify-center flex-col items-center gap-4">
          <AiOutlineLoading
            size={150}
            className="animate-spin text-primary-500"
          />
          <p className="text-gray-500 font-mono">Users are loading....</p>
        </div>
      )}
     {!isUsersLoading && usersData?.data.length !== 0 && (
  <DataTable
    pagination
    paginationPerPage={20}
    data={filteredUsers}  
    columns={[
      {
        id: "#",
        name: "#",
        width: "80px",
        cell: (_, i) => (
          <div>
            <p className="text-md">{i + 1}</p>
          </div>
        ),
      },
      {
        id: "#",
        name: "Name",
        cell: ({ name }) => (
          <div className="py-2">
            <p className="text-md capitalize">
              {name?.firstName} {name?.lastName}
            </p>
          </div>
        ),
      },
      {
        id: "#",
        name: "Email",
        cell: ({ email }) => (
          <div className="flex items-center gap-3">
            <AiOutlineMail size={18} className="text-gray-500" />
            <p className="text-md text-gray-500">{email}</p>
          </div>
        ),
      },
      {
        id: "#",
        name: "Contact",
        cell: ({ mobile }) => (
          <div className="flex items-center gap-3">
            <AiOutlinePhone size={18} className="text-gray-500" />
            <p className="text-md capitalize text-gray-500">{mobile}</p>
          </div>
        ),
      },
      {
        id: "#",
        name: "Verified",
        width: "6rem",
        center: true,
        cell: ({ verified }) => (
          <div>
            {verified ? (
              <LiaUserCheckSolid size={25} className="text-green-500" />
            ) : (
              <LiaUserTimesSolid size={25} className="text-red-500" />
            )}
          </div>
        ),
      },
      {
        id: "#",
        name: "Block",
        center: true,
        width: "5rem",
        cell: ({ block }) => (
          <div className="flex items-center gap-3">
            {block ? (
              <MdOutlineBlock size={25} className="text-red-500" />
            ) : (
              <CgUnblock size={25} className="text-green-500" />
            )}
          </div>
        ),
      },
      {
        id: "#",
        name: "Online",
        width: "5rem",
        center: true,
        cell: ({ online }) => (
          <div>
            {online ? (
              <FaCircle className="text-green-500" size={12} />
            ) : (
              <FaCircle color="#F44336" size={12} />
            )}
          </div>
        ),
      },
      {
        id: "#",
        name: "Created At",
        center: true,
        cell: ({ createdAt }) => (
          <div className="flex gap-5 items-center">
            <p className="text-md text-gray-500">
            {createdAt ? new Date(createdAt).toDateString() : "N/A"}

            </p>
          </div>
        ),
      },
      {
        id: "#",
        name: "Delete Account",
        center: true,
        cell: () => (
          <button className="p-2 bg-gray-100 rounded-md">
            <AiOutlineDelete size={22} />
          </button>
        ),
      },
    ]}
  />
)}

    </Layout>
  );
};
