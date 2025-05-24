import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Prisma } from "@/lib/generated/prisma";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CLOUDINARY_CLOUD_KEY =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const errorHandler = (e: unknown): never => {
  let errorMessage = "";
  // Handle Prisma known request errors
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case "P2002":
        errorMessage = "A record with this unique field already exists.";
        break;
      case "P2025":
        errorMessage = "The requested record could not be found.";
        break;
      default:
        errorMessage = `Prisma error: ${e.message}`;
    }
  }

  // Handle Prisma validation errors
  else if (e instanceof Prisma.PrismaClientValidationError) {
    errorMessage = "Invalid input data. Please check your form fields.";
  }

  // Handle general JS errors
  else if (e instanceof Error) {
    errorMessage = e.message;
  }

  // Handle string error messages
  else if (typeof e === "string") {
    errorMessage = e;
  } else {
    errorMessage = "An unexpected error occurred. Please try again.";
  }
  toast.error(errorMessage);
  throw new Error(errorMessage);
  // Log unknown errors for debugging
};
