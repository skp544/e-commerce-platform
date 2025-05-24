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
import { v4 } from "uuid";
import { upsertStore } from "@/queries/store";
import { errorHandler } from "@/lib/utils";

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
      logo: data?.logo ? [{ url: data.logo }] : [],
      cover: data?.cover ? [{ url: data.cover }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      status: data?.status || "PENDING",
    },
  });

  // loading
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        description: data.description || "",
        email: data.email || "",
        phone: data.phone || "",
        logo: data.logo ? [{ url: data.logo }] : [],
        cover: data.cover ? [{ url: data.cover }] : [],
        url: data.url || "",
        featured: data.featured || false,
        status: data.status || "PENDING",
      });
    }
  }, [data, form]);

  console.log("Watched values:", form.watch());
  console.log("Form values:", form.getValues());
  console.log("Form errors:", form.formState.errors);

  const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    // console.log("Values", values);

    const formValues = form.getValues();

    console.log("Form values:", form.getValues());

    try {
      const response = await upsertStore({
        id: data?.id ? data.id : v4(),
        name: formValues.name || values.name,
        description: formValues.description || values.description,
        email: formValues.email || values.email,
        phone: formValues.phone || values.phone,
        logo: formValues.logo[0].url || values.logo[0].url,
        cover: formValues.cover[0].url || values.cover[0].url,
        url: formValues.url || values.url,
        status: "PENDING",
        featured: formValues.featured || values.featured,
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
        router.push(`/dashboard/seller/stores/${response.url}`);
      }
    } catch (e) {
      return errorHandler(e);
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
              <div className="relative  py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-96">
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
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"Store Name"} />
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

              <div className={"flex flex-col md:flex-row gap-6"}>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name={"email"}
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>Store Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"store@example.com"}
                          type={"email"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name={"phone"}
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>Store Phone No.</FormLabel>
                      <FormControl>
                        <Input placeholder={"9876543210"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name={"url"}
                control={form.control}
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>Store Url</FormLabel>
                    <FormControl>
                      <Input placeholder={"/store-url"} {...field} />
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
