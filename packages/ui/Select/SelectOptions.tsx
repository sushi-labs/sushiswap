import { Listbox } from "@headlessui/react";
import { FC, forwardRef, MutableRefObject } from "react";
import { ExtractProps } from "../types";
import { classNames } from "../lib/classNames";

export type SelectOptionsProps = ExtractProps<typeof Listbox.Options> & {};

const SelectOptions: FC<SelectOptionsProps> = forwardRef<
  MutableRefObject<HTMLDivElement>,
  SelectOptionsProps
>(({ className, ...props }, ref) => {
  return (
    <Listbox.Options
      {...props}
      ref={ref}
      className={classNames(
        className,
        "absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      )}
    />
  );
});

export default SelectOptions;
