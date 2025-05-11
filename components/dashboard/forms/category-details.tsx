"use client";

import React, { useEffect } from "react";
import { Category } from "@/lib/generated/prisma";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { CategoryFormSchema } from "@/lib/schemas";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/dashboard/image-upload";

interface Props {
  data?: Category;
  cloudinary_key: string;
}

const CategoryDetails = ({ data, cloudinary_key }: Props) => {
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(CategoryFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      image: data?.image ? [{ url: data?.image }] : [],
      url: data?.url,
      featured: data?.featured,
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Reset formdata

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
      });
    }
  }, [data, form]);

  // submit handler
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    console.log(values);
  };

  return (
    <AlertDialog>
      <Card className={"w-full"}>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update  ${data?.name} category information`
              : "Lets create a category. You can edit category later from the categories table or the category page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name={"image"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        disabled={isLoading}
                        type={"profile"}
                        cloudinary_key={cloudinary_key}
                        value={field.value.map((image) => image.url)}
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
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder={"Category Name"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name={"url"}
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>Category Url</FormLabel>
                    <FormControl>
                      <Input placeholder={"/category-url"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
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
                        This category will appear on the homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type={"submit"} disabled={isLoading}>
                {isLoading
                  ? "Loading..."
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
