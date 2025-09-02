import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

export const AppLoader = () => {
  return (
    <div>
      <AiOutlineLoading size={30} className="text-primary-500 animate-spin" />
    </div>
  );
};
