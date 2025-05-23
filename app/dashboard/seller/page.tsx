import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

const SellerDashboard = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  //
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  if (stores.length === 0) {
    return redirect("/dashboard/seller/stores/new");
  }

  redirect(`/dashboard/seller/stores/${stores[0].url}`);
};
export default SellerDashboard;
