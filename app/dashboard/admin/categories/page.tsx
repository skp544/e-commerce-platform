import React from "react";
import { getAllCategories } from "@/queries/category";
import DataTable from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/forms/category-details";
import { columns } from "@/app/dashboard/admin/categories/columns";

const AdminCategories = async () => {
  const categories = await getAllCategories();

  if (!categories || categories.length <= 0) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Category
        </>
      }
      modalChildren={<CategoryDetails />}
      filterValue={"name"}
      data={categories}
      searchPlaceholder={"Search category name..."}
      columns={columns}
    />
  );
};
export default AdminCategories;
