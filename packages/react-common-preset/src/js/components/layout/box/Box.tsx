import type { ReactNode } from "react";

export interface IBoxProps {
  children?: ReactNode;
}

const Box = ({ children }: IBoxProps) => {
  return <div className="rcp-box">{children}</div>;
};

export default Box;
