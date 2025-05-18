"use server";

import { Category } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

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
      throw new Error("Unauthenticated");
    }

    if (user.privateMetadata.role !== "ADMIN") {
      throw new Error(
        "Unauthorized Access: Admin privileges required for entry",
      );
    }

    if (!category) {
      throw new Error("Please provide category data");
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
      throw new Error(errorMessage);
    }

    return await db.category.upsert({
      where: {
        id: category.id,
      },
      update: category,
      create: category,
    });
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("An unknown error occurred");
    }
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
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
