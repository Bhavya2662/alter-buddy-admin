import React, { FC } from "react";

export interface AppInputProps {
     label?: string;
     error?: string;
     touched?: boolean;
}

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & AppInputProps;

export const AppInput: FC<Props> = ({ label, error, touched, ...rest }) => {
     return (
          <div className="flex flex-col gap-1 w-full">
               <label htmlFor={label} className="text-poppins text-gray-500 capitalize text-sm">
                    {label}
               </label>
               <input
                    type="text"
                    name={label}
                    id={label}
                    className="border focus:outline-none border-gray-400 focus:border-primary-500 py-2 rounded-lg px-3"
                    {...rest}
               />
               {touched && <p className="text-right text-xs capitalize text-rose-500">{error}</p>}
          </div>
     );
};
