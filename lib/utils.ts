import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CLOUDINARY_CLOUD_KEY =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const errorHandler = (e: any) => {
  if (e instanceof Error) {
    throw new Error(e.message);
  } else {
    throw new Error("An unknown error occurred");
  }
};
