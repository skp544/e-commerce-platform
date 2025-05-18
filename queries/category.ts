"use server";

import { Category } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { errorHandler } from "@/lib/utils";

/*
  @desc create and update category
  @body category
  @returns category
  @permission admin
 */

export const upsertCategory = async (category: Category) => {
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

    if (!category) {
      return errorHandler("Please provide category data");
    }

    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: { id: category.id },
          },
        ],
      },
    });

    let errorMessage = "";
    if (existingCategory) {
      if (existingCategory.name === category.name) {
        errorMessage = "A category with same name already exists";
      } else if (existingCategory.url === category.url) {
        errorMessage = "A category with same url already exists";
      }
      return errorHandler(errorMessage);
    }

    return await db.category.upsert({
      where: {
        id: category.id,
      },
      update: category,
      create: category,
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

export const getAllCategories = async () => {
  try {
    return await db.category.findMany({
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

export const getCategoryById = async (categoryId: string) => {
  try {
    return await db.category.findUnique({
      where: { id: categoryId },
    });
  } catch (e) {
    return errorHandler(e);
  }
};

export const deleteCategory = async (categoryId: string) => {
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

    return await db.category.delete({
      where: {
        id: categoryId,
      },
    });
  } catch (e) {
    return errorHandler(e);
  }
};
