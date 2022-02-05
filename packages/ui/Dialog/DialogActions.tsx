import React, { FC, ReactNode } from "react";
import { classNames } from "../lib/classNames";

export interface DialogActionProps {
  className?: string;
  children: ReactNode[];
}

const DialogActions: FC<DialogActionProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        className,
        "mt-5 sm:mt-4 sm:flex sm:flex-row-reverse"
      )}
    >
      {children}
    </div>
  );
};

export default DialogActions;
