import React from "react";
import SubCategoryDetails from "@/components/dashboard/forms/sub-category-details";
import { getAllCategories } from "@/queries/category";

const NewSubCategoriesPage = async () => {
  const categories = await getAllCategories();

  return <SubCategoryDetails categories={categories} />;
};
export default NewSubCategoriesPage;
