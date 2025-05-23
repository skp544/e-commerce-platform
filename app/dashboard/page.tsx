import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user?.privateMetadata?.role || user?.privateMetadata.role === "USER") {
    redirect("/");
  }

  if (user.privateMetadata.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (user.privateMetadata.seller === "SELLER") {
    redirect("/dashboard/seller");
  }
};
export default DashboardPage;
