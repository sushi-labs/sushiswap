import React from "react";
import { withStyles } from "../hoc";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { ExtractProps } from "../types";

type Description = (
  props: ExtractProps<typeof HeadlessDialog.Description>
) => JSX.Element;

const DialogDescription: Description = withStyles(
  HeadlessDialog.Description,
  "text-sm text-gray-500"
);

export default DialogDescription;
