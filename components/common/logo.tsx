import React from "react";
import Image from "next/image";

interface Props {
  width: string;
  height: string;
}

const Logo = ({ width, height }: Props) => {
  return (
    <div className={"z-50"} style={{ width, height }}>
      <Image
        src={"/assets/icons/logo-1.png"}
        alt={"goshop"}
        className={"w-full h-full object-cover overflow-visible"}
        width={100}
        height={100}
      />
    </div>
  );
};
export default Logo;
