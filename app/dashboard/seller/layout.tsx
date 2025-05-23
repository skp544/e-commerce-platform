import React, { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SellerDashboardLayout = async ({ children }: { children: ReactNode }) => {
  const user = await currentUser();

  if (user?.privateMetadata && user?.privateMetadata.role !== "SELLER") {
    redirect("/");
  }

  return <div>{children}</div>;
};
export default SellerDashboardLayout;
