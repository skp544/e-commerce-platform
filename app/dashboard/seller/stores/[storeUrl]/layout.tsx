import React, { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

const SellerStoreDashboardLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const stores = await db.store.findMany({
    where: { userId: user.id },
  });

  return (
    <div className={"h-full w-full flex"}>
      <Sidebar stores={stores} />
      <div className={"w-full ml-[300px]"}>
        <Header />
        <div className={"w-full mt-[75px] p-4"}> {children}</div>
      </div>
    </div>
  );
};
export default SellerStoreDashboardLayout;
