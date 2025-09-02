import clsx from "clsx";
import React, { FC } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export interface AppButtonProps {
  loading?: boolean;
  fullWidth?: boolean;
  primary?: boolean;
  danger?: boolean;
}

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  AppButtonProps;

export const AppButton: FC<Props> = ({
  loading,
  primary,
  fullWidth,
  danger,
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "py-2.5 px-6 text-sm  rounded-lg cursor-pointer font-semibold text-center shadow-xs transition-all duration-500",
        primary && "bg-primary-500 text-white  hover:bg-primary-700",
        fullWidth && "w-full",
        danger && "bg-red-500 text-white  hover:bg-red-700"
      )}
      {...rest}
    >
      {loading ? <AiOutlineLoading3Quarters /> : children}
    </button>
  );
};
