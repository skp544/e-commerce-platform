import React from "react";
import CategoryDetails from "@/components/dashboard/forms/category-details";

const AdminNewCategory = () => {
  const CLOUDINARY_CLOUD_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  if (!CLOUDINARY_CLOUD_KEY) {
    return null;
  }

  return (
    <div className={"w-full"}>
      <CategoryDetails cloudinary_key={CLOUDINARY_CLOUD_KEY} />
    </div>
  );
};
export default AdminNewCategory;
