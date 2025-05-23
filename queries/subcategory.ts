"use server";

import { SubCategory } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { errorHandler } from "@/lib/utils";

/*
  @desc create and update category
  @body category
  @returns category
  @permission admin
 */

export const upsertSubCategory = async (subcategory: SubCategory) => {
  try {
    const user = await currentUser();

    if (!user) {
      return errorHandler("Unauthenticated");
    }

    if (user.privateMetadata.role !== "ADMIN") {
      return errorHandler(
        "Unauthorized Access: Admin privileges required for entry",
      );
    }

    if (!subcategory) {
      return errorHandler("Please provide category data");
    }

    const existingCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subcategory.name }, { url: subcategory.url }],
          },
          {
            NOT: { id: subcategory.id },
          },
        ],
      },
    });

    let errorMessage = "";
    if (existingCategory) {
      if (existingCategory.name === subcategory.name) {
        errorMessage = "A sub category with same name already exists";
      } else if (existingCategory.url === subcategory.url) {
        errorMessage = "A sub category with same url already exists";
      }
      return errorHandler(errorMessage);
    }

    return await db.subCategory.upsert({
      where: {
        id: subcategory.id,
      },
      update: subcategory,
      create: subcategory,
    });
  } catch (e) {
    return errorHandler(e);
  }
};

/*
  @desc get al categories
  @returns category[]
  @permission admin
 */

export const getAllSubCategories = async () => {
  try {
    return await db.subCategory.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (e) {
    return errorHandler(e);
  }
};

/*
  @desc get category by id
  @param categoryId
  @returns category
  @permission public
 */

export const getSubCategoryById = async (categoryId: string) => {
  try {
    return await db.subCategory.findUnique({
      where: { id: categoryId },
    });
  } catch (e) {
    return errorHandler(e);
  }
};

export const deleteSubCategory = async (categoryId: string) => {
  try {
    const user = await currentUser();

    if (!user) return;

    if (user.privateMetadata.role !== "ADMIN") {
      return errorHandler(
        "Unauthorized Access: Admin privileges required for entry",
      );
    }

    if (!categoryId) {
      return errorHandler("Please provide category id");
    }

    return await db.subCategory.delete({
      where: {
        id: categoryId,
      },
    });
  } catch (e) {
    return errorHandler(e);
  }
};
