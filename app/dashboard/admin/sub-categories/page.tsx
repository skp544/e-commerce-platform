import React from "react";
import { getAllSubCategories } from "@/queries/subcategory";
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import SubCategoryDetails from "@/components/dashboard/forms/sub-category-details";
import { columns } from "@/app/dashboard/admin/sub-categories/columns";

const AdminSubCategory = async () => {
  const subCategory = await getAllSubCategories();

  if (!subCategory) {
    return null;
  }

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Sub Category
        </>
      }
      modalChildren={<SubCategoryDetails categories={subCategory} />}
      filterValue={"name"}
      data={subCategory}
      searchPlaceholder={"Search Sub Category by name..."}
      columns={columns}
      newTabLink={"/dashboard/admin/sub-categories/new"}
    />
  );
};
export default AdminSubCategory;
