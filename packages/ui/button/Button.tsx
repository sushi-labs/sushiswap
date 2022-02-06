import * as React from "react";
import { FC } from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const Button: FC<ButtonProps> = (props) => {
  return <button {...props} />;
};
