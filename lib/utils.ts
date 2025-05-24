import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Prisma } from "@/lib/generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CLOUDINARY_CLOUD_KEY =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const errorHandler = (e: unknown): never => {
  // Handle Prisma known request errors
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case "P2002":
        throw new Error("A record with this unique field already exists.");
      case "P2025":
        throw new Error("The requested record could not be found.");
      default:
        throw new Error(`Prisma error: ${e.message}`);
    }
  }

  // Handle Prisma validation errors
  if (e instanceof Prisma.PrismaClientValidationError) {
    throw new Error("Invalid input data. Please check your form fields.");
  }

  // Handle general JS errors
  if (e instanceof Error) {
    throw new Error(e.message);
  }

  // Handle string error messages
  if (typeof e === "string") {
    throw new Error(e);
  }

  // Log unknown errors for debugging
  console.error("Unexpected error:", e);
  throw new Error("An unexpected error occurred. Please try again.");
};
