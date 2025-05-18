"use client";

import React, { FC, useEffect } from "react";
import { Category } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CategoryFormSchema } from "@/lib/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/dashboard/image-upload";
import { toast } from "sonner";
import { upsertCategory } from "@/queries/category";
import { v4 } from "uuid";

interface Props {
  data?: Category;
}

const CategoryDetails: FC<Props> = ({ data }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
    },
  });

  // loading
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: data.image ? [{ url: data.image }] : [],
        url: data.url,
        featured: data.featured,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    console.log("Values", values);

    try {
      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Response", response);

      // Displaying a success message
      toast(
        data?.id
          ? "Category has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      );

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <AlertDialog>
      <Card className={"w-full"}>
        {/* Card Header */}
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} category information.`
              : " Lets create a category. You can edit category later from the categories table or the category page."}
          </CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className={"space-y-4"}
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url,
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"Category Name"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"url"}
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>Category Url</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"/category-url"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"featured"}
                render={({ field }) => (
                  <FormItem
                    className={
                      "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                    }
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className={"space-y-1 leading-none"}>
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This category will appear on the home page
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type={"submit"}
                className={"cursor-pointer"}
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving..."
                  : data?.id
                    ? "Save Category Information"
                    : "Create Category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};
export default CategoryDetails;
