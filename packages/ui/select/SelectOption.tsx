import { Listbox } from "@headlessui/react";
import { FC } from "react";
import { ExtractProps } from "../types";
import { classNames } from "../lib/classNames";

export type SelectOptionProps = ExtractProps<typeof Listbox.Option> & {};

const SelectOption: FC<SelectOptionProps> = ({ className, ...props }) => {
  return (
    <Listbox.Option
      {...props}
      className={({ active }) =>
        classNames(
          active ? "text-white bg-indigo-600" : "text-gray-900",
          "cursor-default select-none relative py-2 pl-3 pr-9",
          className
        )
      }
    />
  );
};

export default SelectOption;
