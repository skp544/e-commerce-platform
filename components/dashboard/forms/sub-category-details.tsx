"use client";

import React, { FC, useEffect } from "react";
import { Category, SubCategory } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { SubCategoryFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertSubCategory } from "@/queries/subcategory";
import { v4 } from "uuid";
import { toast } from "sonner";
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
import ImageUpload from "@/components/dashboard/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Props {
  data?: SubCategory;
  categories: Category[];
}

const SubCategoryDetails: FC<Props> = ({ data, categories }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      categoryId: data?.categoryId || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const formData = form.watch();
  console.log("FormData", formData);

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: data.image ? [{ url: data.image }] : [],
        url: data.url,
        featured: data.featured,
        categoryId: data.categoryId,
      });
    }
  }, [data, form]);

  console.log("Watched values:", form.watch());
  console.log("Form errors:", form.formState.errors);

  const handleSubmit = async (
    values: z.infer<typeof SubCategoryFormSchema>,
  ) => {
    console.log("Values", values);
    try {
      const response = await upsertSubCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        categoryId: values.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Response", response);

      // Displaying a success message
      toast(
        data?.id
          ? "Sub Category has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      );

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/sub-categories");
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
          <CardTitle>Sub Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} sub category information.`
              : " Lets create a sub category. You can edit sub category later from the sub categories table or the sub category page."}
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
                    <FormLabel>Sub Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"Sub Category Name"} />
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
                    <FormLabel>Sub Category Url</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"/sub-category-url"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isLoading || categories.length === 0}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger ref={field.ref}>
                          {" "}
                          {/* ✅ Add this */}
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    ? "Save Sub Category Information"
                    : "Create Sub Category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};
export default SubCategoryDetails;
