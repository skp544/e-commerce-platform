import React from "react";
import CategoryDetails from "@/components/dashboard/forms/category-details";
import { CLOUDINARY_CLOUD_KEY } from "@/lib/utils";

const AdminNewCategory = () => {
  if (!CLOUDINARY_CLOUD_KEY) {
    return null;
  }

  return (
    <div className={"w-full"}>
      <CategoryDetails />
    </div>
  );
};
export default AdminNewCategory;
