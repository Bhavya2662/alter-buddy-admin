import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppButton, AppInput } from "../../../component";
import { useLoginAdminAccountMutation } from "../../../app/api";
import { ISignInProps } from "../../../interface";
import { Formik } from "formik";
import { SignInSchema, SignInValidationValue } from "../../../validation";
import { useAppDispatch } from "../../../app/hooks";
import { handleAuthentication } from "../../../app/features";

export const LoginPage = () => {
     const [LoginAdmin, { isError, error, isSuccess, data }] = useLoginAdminAccountMutation();
     const dispatch = useAppDispatch();
     const navigate = useNavigate();

     useEffect(() => {
          if (isError) {
               console.log(error);
          }
          if (isSuccess) {
               dispatch(handleAuthentication(data?.data?.token as string));
               navigate("/dashboard", { replace: true });
          }
     }, [isError, error, isSuccess, data, dispatch, navigate]);

     const Login = async ({ email, password }: ISignInProps) => {
          console.log(email, password);
          await LoginAdmin({ email, password });
     };

     return (
          <div className="flex h-screen">
               <div className="w-[400px] flex flex-col px-5 py-3 justify-between">
                    <h6 className="text-4xl text-primary-500 mt-10">Login to your account</h6>
                    {/* <div className="flex gap-1 font-bold py-5">
                         Don't have an account?
                         <Link to="/register" className="text-blue-500">
                              Sign up
                         </Link>
                    </div> */}
                    <hr className="my-5" />
                    <Formik  onSubmit={Login} initialValues={SignInValidationValue} validationSchema={SignInSchema}>
                         {({ errors, touched, values, handleBlur, handleChange, handleSubmit }) => (
                              <form className="h-full" onSubmit={handleSubmit}>
                                   <div className="flex flex-col gap-5 justify-between h-full items-stretch">
                                        <div className="flex gap-3 flex-col">
                                             {/* {isError ? (
                                                  <p className="text-rose-500 capitalize">
                                                       {(error as any).data.message}
                                                  </p>
                                             ) : null} */}
                                             <AppInput
                                                  type="email"
                                                  label="email address"
                                                  placeholder="Enter your email"
                                                  value={values.email}
                                                  touched={touched.email}
                                                  error={errors.email}
                                                  onChange={handleChange("email")}
                                                  onBlur={handleBlur("email")}
                                             />
                                             <AppInput
                                                  label="Password"
                                                  type="password"
                                                  placeholder="Enter your password"
                                                  value={values.password}
                                                  touched={touched.password}
                                                  error={errors.password}
                                                  onChange={handleChange("password")}
                                                  onBlur={handleBlur("password")}
                                             />
                                        </div>
                                        <div>
                                             <div className="flex justify-end">
                                                  <AppButton type="submit" primary>
                                                       Login
                                                  </AppButton>
                                             </div>
                                             <hr className="my-5" />
                                             <p className="text-sm text-gray-500 font-semibold pb-3">
                                                  Forgot password?{" "}
                                                  <Link to="/reset-password" className="text-blue-500 font-normal">
                                                       Click to reset
                                                  </Link>
                                             </p>
                                        </div>
                                   </div>
                              </form>
                         )}
                    </Formik>
               </div>
               <div className="flex-1  p-3 bg-gradient-to-tr from-brandPrimary-100 to-brandSecondary-100 flex flex-col justify-center items-center">
                    <div className="flex items-center justify-center">
                         <img
                              src={require("../../../assets/image/logo.png")}
                              alt="website_logo"
                              className="w-[80%] rounded-lg"
                         />
                    </div>
                    <h6 className="text-3xl font-poppins text-center py-3">
                         <span className="text-brandSecondary-500 font-semibold">AlterBuddy</span>{" "}
                         <span>Administration Service</span>
                    </h6>
               </div>
          </div>
     );
};
