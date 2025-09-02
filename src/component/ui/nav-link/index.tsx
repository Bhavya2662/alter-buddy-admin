import React, { FC } from "react";
import { IconType } from "react-icons/lib";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import clsx from "clsx";

export interface NavLinkProps {
     path: string;
     label: string;
     Icon: IconType;
}

export const NavLink: FC<NavLinkProps> = ({ Icon, label, path }) => {
     const resolved = useResolvedPath(path);
     const match = useMatch({ path: resolved.pathname, end: true });
     const linkColor: string = match ? "text-primary-500" : "text-gray-900";
     return (
          <Link to={path} className="flex items-center gap-2">
               <Icon size={24} className={clsx(linkColor)} />{" "}
               <p className={clsx(linkColor, "text-xs font-medium uppercase")}>{label}</p>
          </Link>
     );
};
