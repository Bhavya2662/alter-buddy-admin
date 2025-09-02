import React, { FC } from "react";
import { AppButton } from "../button";

interface PageTitleProps {
  title: string;
  subTitle?: string;
  rightAction?: () => void;
  rightText?: string;
}

export const PageTitle: FC<PageTitleProps> = ({
  title,
  subTitle,
  rightAction,
  rightText,
}) => {
  return (
    <div className="py-5 flex justify-between items-center">
      <div>
        <h6 className="text-2xl capitalize font-semibold">{title}</h6>
        {subTitle && <p className="text-gray-500">{subTitle}</p>}
      </div>
      {rightAction && (
        <div>
          <AppButton primary onClick={rightAction}>
            {rightText}
          </AppButton>
        </div>
      )}{" "}
    </div>
  );
};
