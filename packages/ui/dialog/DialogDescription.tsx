import React, { FC } from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { ExtractProps } from "../types";
import { classNames } from "../lib/classNames";

export type DialogDescriptionProps = ExtractProps<
  typeof HeadlessDialog.Description
> & {};

const DialogDescription: FC<DialogDescriptionProps> = ({
  className,
  ...props
}) => {
  return (
    <HeadlessDialog.Description
      {...props}
      className={classNames(className, "text-sm text-gray-500")}
    />
  );
};

export default DialogDescription;
