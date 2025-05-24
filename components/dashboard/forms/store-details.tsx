"use client";

import React, { FC, useEffect } from "react";
import { Store } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { StoreFormSchema } from "@/lib/schemas";
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
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/dashboard/image-upload";
import { toast } from "sonner";
import { upsertCategory } from "@/queries/category";
import { v4 } from "uuid";

interface Props {
  data?: Store;
}

const StoreDetails: FC<Props> = ({ data }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      email: data?.email || "",
      phone: data?.phone || "",
      logo: data?.logo ? [{ url: data?.logo }] : [],
      cover: data?.cover ? [{ url: data?.cover }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      status: data?.status.toString() || "PENDING",
    },
  });

  // loading
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        description: data.description,
        email: data.email,
        phone: data.phone,
        logo: [{ url: data.logo }],
        cover: [{ url: data.cover }],
        url: data.url,
        featured: data.featured,
        status: data.status,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    console.log("Values", values);

    try {
      // const response = await upsertCategory({
      //   id: data?.id ? data.id : v4(),
      //   name: values.name,
      //   image: values.image[0].url,
      //   url: values.url,
      //   featured: values.featured,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // });

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
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} store information.`
              : " Lets create a store. You can edit store later from the settings page"}
          </CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className={"space-y-4"}
            >
              {/* cover and logo */}
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
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
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
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
              </div>

              {/* name */}
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

              {/* description */}
              <FormField
                control={form.control}
                name={"description"}
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>Store Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={"Write something about store..."}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* email and phone */}

              <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="store@example.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store Url</FormLabel>
                    <FormControl>
                      <Input placeholder="/store-url" {...field} />
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
                        This Store will appear on the home page.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type={"submit"}
                className={"cursor-pointer font-semibold"}
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : data?.id
                    ? "Save store information"
                    : "Create Store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};
export default StoreDetails;
