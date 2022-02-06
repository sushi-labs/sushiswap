import { ExtractProps } from "../types";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { FC, forwardRef, MutableRefObject } from "react";

export type MenuItem = ExtractProps<typeof HeadlessMenu.Item> & {
  className?: string;
};

export const MenuItem: FC<MenuItem> = forwardRef<
  MutableRefObject<HTMLDivElement>,
  MenuItem
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className="py-1">
      <HeadlessMenu.Item {...props}>{children}</HeadlessMenu.Item>
    </div>
  );
});
