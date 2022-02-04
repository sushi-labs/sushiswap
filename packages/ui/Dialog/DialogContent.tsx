import { FC, forwardRef, MutableRefObject } from "react";
import { classNames } from "../utils/classNames";

export interface DialogContentProps {
  className?: string;
}

const DialogContent: FC<DialogContentProps> = forwardRef<
  MutableRefObject<HTMLDivElement>,
  DialogContentProps
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={classNames(
        className,
        "space-y-2 inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
      )}
    >
      {children}
    </div>
  );
});

export default DialogContent;
