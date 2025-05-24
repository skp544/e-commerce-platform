"use server";

import { Store } from "@/lib/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { errorHandler } from "@/lib/utils";
import db from "@/lib/db";

export const upsertStore = async (store: Partial<Store>) => {
  try {
    const user = await currentUser();

    console.log("data", store);

    if (!user) {
      return errorHandler("Unauthenticated");
    }

    if (user.privateMetadata.role !== "SELLER") {
      return errorHandler(
        "Unauthorized Access: Seller privileges required for entry",
      );
    }

    if (!store) {
      return errorHandler("Please provide store data");
    }

    const existingStore = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: store.name },
              { email: store.email },
              { phone: store.phone },
              { url: store.url },
            ],
          },
          {
            NOT: { id: store.id },
          },
        ],
      },
    });

    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage = "A store with same name already exists";
      } else if (existingStore.email === store.email) {
        errorMessage = "A store with same email already exists";
      } else if (existingStore.phone === store.phone) {
        errorMessage = "A store with same phone already exists";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with same url already exists";
      }
      return errorHandler(errorMessage);
    }

    return await db.store.upsert({
      where: {
        id: store.id,
      },
      update: store,
      create: {
        ...store,
        user: {
          connect: { id: user.id },
        },
      },
    });
  } catch (e) {
    return errorHandler(e);
  }
};
