import React, { FC, ReactNode, useEffect } from "react";

import Helmet from "react-helmet";
import {
     AiOutlineBell,
     AiOutlineBook,
     AiOutlineDashboard,
     AiOutlineMenu,
     AiOutlineTeam,
     AiOutlineUser,
     AiOutlineVideoCameraAdd,
     AiOutlineAppstore,
     AiOutlineBranches
} from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { AppButton, NavGroup } from "../component";
import { MdPayment } from "react-icons/md";
import clsx from "clsx";
import { useAppDispatch } from "../app/hooks";
import { handleAuthentication, removeAuthentication } from "../app/features";
import { useLogoutAdminAccountMutation } from "../app/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Layout: FC<ILayoutProps> = ({ pageTitle, children }) => {
     const token = localStorage.getItem("ADMIN");
     const [
          Logout,
          {
               isError: isLogoutError,
               error: logoutError,
               isSuccess: isLogoutSuccess,
          },
     ] = useLogoutAdminAccountMutation();
     const dispatch = useAppDispatch();
     const navigate = useNavigate();

     useEffect(() => {
          const validateToken = async () => {
               if (token) {
                    try {
                         // Test token validity
                         const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/test`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                         });
                         
                         if (response.ok) {
                              dispatch(handleAuthentication(token));
                         } else {
                              // Token invalid, clear storage
                              localStorage.removeItem("ADMIN");
                              dispatch(removeAuthentication());
                              navigate("/", { replace: true });
                         }
                    } catch (error) {
                         localStorage.removeItem("ADMIN");
                         dispatch(removeAuthentication());
                         navigate("/", { replace: true });
                    }
               }
          };
          
          validateToken();
          
          if (isLogoutError) {
               console.log(logoutError);
          }
          if (isLogoutSuccess) {
               navigate("/", { replace: true });
          }
     }, [
          token,
          dispatch,
          isLogoutError,
          logoutError,
          isLogoutSuccess,
          navigate,
     ]);
     return (
          <div className="h-screen flex overflow-hidden transition-all duration-300">
               <ToastContainer />
               <div
                    className={clsx(
                         "duration-300 w-[260px] p-3 flex flex-col justify-between border-r overflow-y-scroll"
                    )}
               >
                    <div>
                         <img
                              src="http://localhost:3002/static/media/logo.f6f03919811d124b745b.png"
                              alt=""
                         />
                         <div className="mt-5">
                              <NavGroup
                                   label="General"
                                   nav={[
                                        {
                                             Icon: AiOutlineDashboard,
                                             label: "dashboard",
                                             path: "/dashboard",
                                        },
                                        {
                                             Icon: AiOutlineVideoCameraAdd,
                                             label: "call logs",
                                             path: "/call-logs",
                                        },
                                   ]}
                              />
                              <NavGroup
                                   label="managements"
                                   nav={[
                                        {
                                             Icon: AiOutlineUser,
                                             label: "users",
                                             path: "/users/manage",
                                        },
                                        {
                                             Icon: AiOutlineTeam,
                                             label: "mentors",
                                             path: "/mentors/manage",
                                        },
                                        {
                                             Icon: AiOutlineAppstore,
                                             label: "categories",
                                             path: "/categories/manage",
                                        },
                                        // {
                                        //      Icon: AiOutlineBranches,
                                        //      label: "select",
                                        //      path: "/categoriestwo/manage",
                                        // },
                                        {
                                             Icon: AiOutlineBook,
                                             label: "blogs",
                                             path: "/blogs/manage",
                                        },
                                   ]}
                              />
                              {/* <NavGroup
              label="Features"
              nav={[
                {
                  Icon: MdPayment,
                  label: "payments",
                  path: "/payment/margins",
                },
                { Icon: AiOutlineApi, label: "api keys", path: "/api-keys" },
                {
                  Icon: AiOutlineDotChart,
                  label: "analysis",
                  path: "/analysis",
                },
              ]}
            /> */}
                              {/* <NavGroup
              label="support system"
              nav={[
                { Icon: AiOutlineIssuesClose, label: "issues", path: "/users" },
                {
                  Icon: AiOutlineUserSwitch,
                  label: "accounts",
                  path: "/accounts",
                },
                { Icon: AiOutlineMore, label: "other", path: "/other" },
              ]}
            /> */}
                              <NavGroup
                                   label="settings"
                                   nav={[
                                        {
                                             Icon: MdPayment,
                                             label: "User payments",
                                             path: "/payment",
                                        },
                                        {
                                             Icon: MdPayment,
                                             label: "Mentor Payments",
                                             path: "/mentor-payment",
                                        },
                                   ]}
                              />
                         </div>
                    </div>
                    <div className="py-5">
                         <AppButton
                              type="button"
                              fullWidth
                              danger
                              onClick={async () => {
                                   await Logout();
                                   dispatch(removeAuthentication());
                                   navigate("/", { replace: true });
                              }}
                         >
                              Logout
                         </AppButton>
                    </div>
               </div>
               <main className=" overflow-y-scroll relative flex-1">
                    <Helmet>
                         <title>{pageTitle} | admin | Apna Mentor</title>
                    </Helmet>
                    <section>
                         {/* {navBar && ( */}
                         <nav className="absolute py-4 px-5 top-0 backdrop-blur-lg w-full">
                              <div className="flex items-center justify-between">
                                   <button>
                                        <AiOutlineMenu size={24} />
                                   </button>
                                   <h6 className="text-lg font-roboto">
                                        <span className="capitalize text-xl font-semibold text-primary-500">
                                             {pageTitle}
                                        </span>
                                   </h6>
                                   <div className=" flex gap-5">
                                        <button>
                                             <AiOutlineBell
                                                  size={24}
                                                  className="fill-gray-500"
                                             />
                                        </button>
                                        <button>
                                             <FiUser
                                                  size={24}
                                                  className="stroke-gray-500"
                                             />
                                        </button>
                                   </div>
                              </div>
                         </nav>
                         <section className="mt-16 px-5">{children}</section>
                    </section>
               </main>
          </div>
     );
};

export interface ILayoutProps {
     pageTitle: string;
     children: ReactNode;
}
