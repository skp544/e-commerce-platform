import React from "react";
import Logo from "@/components/common/logo";
import { currentUser } from "@clerk/nextjs/server";
import UserInfo from "@/components/dashboard/user-info";
import NavAdmin from "@/components/dashboard/nav-admin";
import {
  adminDashboardSidebarOptions,
  sellerDashboardSidebarOptions,
} from "@/constants/data";
import { Store } from "@/lib/generated/prisma";
import NavSeller from "@/components/dashboard/nav-seller";

interface Props {
  isAdmin?: boolean;
  stores?: Store[];
}

const Sidebar = async ({ isAdmin }: Props) => {
  const user = await currentUser();

  return (
    <div
      className={
        "w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0"
      }
    >
      <Logo width={"100%"} height={"180px"} />
      <span className={"mt-3"} />
      {user && <UserInfo user={user} />}
      {isAdmin ? (
        <NavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <NavSeller menuLinks={sellerDashboardSidebarOptions} />
      )}
    </div>
  );
};
export default Sidebar;
