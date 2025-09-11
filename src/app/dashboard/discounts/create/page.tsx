"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Percent, Image, Layout, Tag } from "lucide-react";
import { getBanner } from "@/redux/features/banner/banner";
import { createDiscount } from "@/redux/features/discount/discount";
import { clearCreateDiscountState } from "@/redux/features/discount/discountSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


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
  const router = useRouter()
  const { layoutData } = useAppSelector((state) => state.layout);
  const { bannerData } = useAppSelector((state) => state.banner);
  const { storeDetailData } = useAppSelector(s => s.store)
  const { createDiscountData, discountError } = useAppSelector(
    (s) => s.discount
  );

  useEffect(() => {
    dispatch(getBanner(1));
  }, [dispatch]);

  const form = useForm<DiscountFormData>({
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      discount_type: "PERCENTAGE",
      value: "",
      banner: "",
      layout: "",
    },
  });

  const onSubmit = (data: DiscountFormData) => {
    dispatch(createDiscount({
      payload: {
        ...data,
        banner: Number(data.banner),
        layout: Number(data.layout)
      },
      s_id: storeDetailData?.id || 0
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create New Discount
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Set up promotional discounts to boost sales and engage customers
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Discount Details</CardTitle>
                  <CardDescription className="text-sm">
                    Configure your discount settings and promotional details
                  </CardDescription>
                </div>
              </div>
              <Separator />
            </CardHeader>

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

                  {/* Discount Settings Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Percent className="w-4 h-4" />
                      DISCOUNT SETTINGS
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Discount Type */}
                      <FormField
                        control={form.control}
                        name="discount_type"
                        rules={{ required: "Discount type is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Discount Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-background/50">
                                  <SelectValue placeholder="Choose discount type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PERCENTAGE">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={getDiscountTypeColor("main")}>
                                      PERCENTAGE
                                    </Badge>
                                    <span>Percentage Off</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="BOGO">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={getDiscountTypeColor("secondary")}>
                                      BOGO
                                    </Badge>
                                    <span>Buy X Get Y</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="SPEND_GET">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={getDiscountTypeColor("special")}>
                                      SPEND_GET
                                    </Badge>
                                    <span> Spend X Get Y Off</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Discount Percent */}
                      <FormField
                        control={form.control}
                        name="value"
                        rules={{
                          required: "Discount percent is required",
                          pattern: {
                            value: /^-?\d*(\.\d+)?$/,
                            message: "Invalid discount percentage",
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Discount Percentage</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="15"
                                  className="h-12 bg-background/50 pr-8"
                                  {...field}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  %
                                </div>
                              </div>
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
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Create Discount Campaign
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
