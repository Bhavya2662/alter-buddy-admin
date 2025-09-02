import React, { useEffect } from "react";
import { Layout } from "../../../../layout";
import { useParams } from "react-router-dom";
import { useLazyGetUserByIdQuery } from "../../../../app/api/user.api";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { AppButton } from "../../../../component";
import { MdOutlineVerified } from "react-icons/md";
import moment from "moment";

export const UserDetailsPage = () => {
  const { userId } = useParams();
  const [GetUser, { data: userData, isError: isUserError, error: userError }] =
    useLazyGetUserByIdQuery();

  useEffect(() => {
    if (isUserError) {
      console.log(userError);
    }
    if (userId) {
      GetUser(userId);
    }
  }, [isUserError, userError, GetUser, userId]);

  return (
    <Layout pageTitle="User details">
      <div className="h-[80vh]  flex justify-center items-center mt-10">
        <div className="w-[70%] rounded-lg shadow-lg border p-3">
          <p className="text-2xl">
            {userData?.data?.name?.firstName} {userData?.data?.name?.lastName}
          </p>
          <div className="mt-5 flex flex-col gap-3" id="contact">
            <label
              htmlFor="contact"
              className=" font-mono text-gray-500 uppercase"
            >
              Contact details
            </label>
            <div>
              <div className="flex items-center gap-3">
                <AiOutlinePhone size={22} className="text-gray-500" />
                <p>+91 {userData?.data.mobile}</p>
              </div>

              <div className="flex items-center gap-3">
                <AiOutlineMail size={22} className="text-gray-500" />
                <p>{userData?.data.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3" id="contact">
            <label
              htmlFor="contact"
              className=" font-mono text-gray-500 uppercase"
            >
              account details
            </label>
            <div className="flex items-center gap-3">
              <AppButton primary>
                {userData?.data.block ? (
                  <span className="uppercase text-xs">currently : block</span>
                ) : (
                  <span className="uppercase text-xs">currently : unblock</span>
                )}
              </AppButton>
              {userData?.data.verified ? (
                <div className="text-primary-500 flex items-center gap-3">
                  <MdOutlineVerified size={25} />
                  <p className="capitalize">Verified user</p>
                </div>
              ) : (
                <div className="text-gray-300 flex gap-3 items-center">
                  <MdOutlineVerified size={25} />
                  <p className=" capitalize">Not Verified</p>
                </div>
              )}

              <p className="text-gray-500">
                Last online status :{" "}
                {moment(userData?.data.updatedAt).format("Do MMM YYYY hh:mm a")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
