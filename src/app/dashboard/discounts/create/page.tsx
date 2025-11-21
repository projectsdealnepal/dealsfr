"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Image, Layout, Tag } from "lucide-react";
import { createDiscount, updateDiscount } from "@/redux/features/discount/discount";
import { clearCreateDiscountState } from "@/redux/features/discount/discountSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ChildRouteHeader from "@/components/ChildRouteHeader";

// Define form data type
export interface DiscountFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT" | "BOGO" | "SPEND_GET";
  value: string;
  banner: string;
  layout: string;
}

export default function AddDiscountForm() {
  const dispatch = useAppDispatch();
  const param = useSearchParams()
  const id = param.get("id")
  const router = useRouter()

  const { layoutData } = useAppSelector((state) => state.layout);
  const { bannerData } = useAppSelector((state) => state.banner);
  const { storeDetailData } = useAppSelector(s => s.store)
  const { createDiscountData, discountData, discountError } = useAppSelector(
    (s) => s.discount
  );

  const isEditMode = Boolean(id)
  const currentDiscount = isEditMode
    ? discountData?.find((d) => d.id === Number(id))
    : null

  const form = useForm<DiscountFormData>({
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      banner: "",
      layout: "",
    },
  });

  useEffect(() => {
    if (isEditMode && currentDiscount) {
      form.reset({
        name: currentDiscount.name || "",
        description: currentDiscount.description || "",
        start_date: currentDiscount.start_date || "",
        end_date: currentDiscount.end_date || "",
        banner: String(currentDiscount.banner || ""),
        layout: String(currentDiscount.layout || ""),
      });
    }
  }, [isEditMode, currentDiscount]);

  const onSubmit = (data: DiscountFormData) => {
    const payload = {
      ...data,
      banner: Number(data.banner),
      layout: Number(data.layout),
      apply_to_all_branches: true,
    };

    if (isEditMode && currentDiscount) {
      dispatch(updateDiscount({
        payload,
        d_id: Number(id),
        s_id: storeDetailData?.id || 0
      }))
    } else {
      dispatch(createDiscount({
        payload,
        s_id: storeDetailData?.id || 0
      }));
    }
  };

  useEffect(() => {
    if (createDiscountData) {
      toast.success("Successfully created Discount", { richColors: true })
      router.back()
    }

    return () => {
      dispatch(clearCreateDiscountState())
    }

  }, [createDiscountData, discountError]);

  const getDiscountTypeColor = (type: string) => {
    switch (type) {
      case "main":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "secondary":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "special":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="">
      <div className="container mx-auto p-4">
        <div className="space-y-6">
          {/* Header Section */}
          <ChildRouteHeader
            title={isEditMode ? "Edit Discount" : "Create New Discount"}
            subtitle={isEditMode
              ? "Update your discount settings and promotional details"
              : "Configure your discount settings and promotional details"
            }
            backLink='/dashboard/discounts'
            backText='Back to discounts'
            titleIcon={<Tag className="h-5 w-5 text-primary" />}
          />

          <Separator className="my-6" />

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="space-y-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Basic Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      BASIC INFORMATION
                    </div>

                    <div className="grid gap-6">
                      {/* Title */}
                      <FormField
                        control={form.control}
                        name="name"
                        rules={{
                          required: "Title is required",
                          maxLength: { value: 100, message: "Title is too long" },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Discount Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Summer Sale 2024"
                                className="h-12 bg-background/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        rules={{
                          required: "Description is required",
                          maxLength: {
                            value: 500,
                            message: "Description is too long",
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your discount offer and terms..."
                                className="resize-none min-h-[100px] bg-background/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Date Configuration Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      DATE CONFIGURATION
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Start Date */}
                      <FormField
                        control={form.control}
                        name="start_date"
                        rules={{ required: "Start date is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Start Date & Time</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                className="h-12 bg-background/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* End Date */}
                      <FormField
                        control={form.control}
                        name="end_date"
                        rules={{ required: "End date is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">End Date & Time</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                className="h-12 bg-background/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />


                  {/* Display Settings Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Layout className="w-4 h-4" />
                      DISPLAY SETTINGS
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Banner */}
                      <FormField
                        control={form.control}
                        name="banner"
                        rules={{ required: "Banner is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center gap-2">
                              <Image className="w-4 h-4" />
                              Banner
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-background/50">
                                  <SelectValue placeholder="Select promotional banner" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bannerData &&
                                  bannerData.map((banner) => (
                                    <SelectItem
                                      key={banner.id}
                                      value={banner.id.toString()}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/30" />
                                        {banner.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Layout */}
                      <FormField
                        control={form.control}
                        name="layout"
                        rules={{ required: "Layout is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Layout Template</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-background/50">
                                  <SelectValue placeholder="Choose layout style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {layoutData &&
                                  layoutData.map((layout) => (
                                    <SelectItem
                                      key={layout.id}
                                      value={layout.id!.toString()}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-muted border" />
                                        {layout.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button type="submit">
                      {isEditMode ? "Update Discount" : "Create Discount Campaign"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
