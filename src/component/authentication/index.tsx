import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { GetTokenFromLocal } from "../../utils";

export const ProtectedPages = () => {
     const token = GetTokenFromLocal();

     if (!token) {
          return <Navigate to="/" replace />;
     } else {
          return <Outlet />;
     }
};
