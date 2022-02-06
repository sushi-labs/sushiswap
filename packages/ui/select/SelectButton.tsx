import { Listbox } from "@headlessui/react";
import { FC, forwardRef, MutableRefObject } from "react";
import { ExtractProps } from "../types";
import { SelectorIcon } from "@heroicons/react/solid";
import { classNames } from "../lib/classNames";

export type SelectButtonProps = ExtractProps<typeof Listbox.Label> & {};

const SelectButton: FC<SelectButtonProps> = forwardRef<
  MutableRefObject<HTMLDivElement>,
  SelectButtonProps
>(({ children, ...props }, ref) => {
  return (
    <Listbox.Button
      {...props}
      ref={ref}
      className={classNames(
        props.className,
        "dark:bg-slate-700 bg-white relative w-full border border-slate-300 dark:border-slate-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      )}
    >
      {children}
      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <SelectorIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
      </span>
    </Listbox.Button>
  );
});

export default SelectButton;
