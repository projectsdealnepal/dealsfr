"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createStore,
  getStoresCategories,
  updateStore,
} from "@/redux/features/store/store";
import {
  clearStoreCreateState,
  clearStoreUpdateState,
} from "@/redux/features/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const storeTypes = ["DEPT", "SUPER", "LOCAL", "ONLINE"];

// VALIDATION SCHEMA
const storeFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Store name must be at least 2 characters." }),
  store_type: z.enum(["DEPT", "SUPER", "LOCAL", "ONLINE"], {
    required_error: "Please select a store type.",
  }),
  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters." }),
  district: z
    .string()
    .min(2, { message: "District name must be at least 2 characters." }),
  location_link: z.string().url().optional().or(z.literal("")),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  business_registration_number: z
    .string()
    .min(1, { message: "Business registration number is required." }),
  slogan: z.string().optional(),
  logo: z.any().optional(),
  cover_image: z.any().optional(),
  documents: z.any().optional(),
  store_category_ids: z.array(z.string()).optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

// MAIN COMPONENT
// ============================================================================
export default function StoreRegistrationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { userData } = useAppSelector((state) => state.userData);
  const {
    storeDetailData,
    storeCreateData,
    storeCreateError,
    storeUpdateData,
    storeUpdateError,
    storeCategoriesData,
  } = useAppSelector((state) => state.store);

  // Local State
  const [logoPreview, setLogoPreview] = useState<string | null>(
    storeDetailData?.logo || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    storeDetailData?.cover_image || null
  );
  const [success, setSuccess] = useState(false);

  // --------------------------------------------------------------------------
  // Memoized Values
  // --------------------------------------------------------------------------
  // Category Options for MultiSelect
  const categoryOptions = useMemo(() => {
    if (!storeCategoriesData) return [];
    const categories = storeCategoriesData.map((cat) => ({
      value: cat.id.toString(),
      label: cat.name,
    }));
    return [{ value: "all", label: "All Categories" }, ...categories];
  }, [storeCategoriesData]);

  // Default Form Values
  const defaultValues: Partial<StoreFormValues> = useMemo(
    () => ({
      name: storeDetailData?.name || "",
      store_type: (storeDetailData?.store_type as "DEPT") || "DEPT",
      city: storeDetailData?.city || "",
      district: storeDetailData?.district || "",
      location_link: storeDetailData?.location_link || "",
      address: storeDetailData?.address || "",
      phone: storeDetailData?.phone || "",
      email: storeDetailData?.email || "",
      business_registration_number:
        storeDetailData?.business_registration_number || "",
      slogan: storeDetailData?.slogan || "",
      store_category_ids:
        storeDetailData?.store_category?.map((cat) => cat.id.toString()) || [],
    }),
    [storeDetailData]
  );

  // --------------------------------------------------------------------------
  // Form Initialization
  // --------------------------------------------------------------------------
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues,
  });

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------
  // Fetch Store Categories on Mount
  useEffect(() => {
    dispatch(getStoresCategories());
  }, [dispatch]);

  // Reset Form When Store Detail Data Changes
  useEffect(() => {
    if (storeDetailData) {
      form.reset({
        name: storeDetailData?.name || "",
        store_type:
          (storeDetailData?.store_type as
            | "DEPT"
            | "SUPER"
            | "LOCAL"
            | "ONLINE") || "DEPT",
        city: storeDetailData?.city || "",
        district: storeDetailData?.district || "",
        location_link: storeDetailData?.location_link || "",
        address: storeDetailData?.address || "",
        phone: storeDetailData?.phone || "",
        email: storeDetailData?.email || "",
        business_registration_number:
          storeDetailData?.business_registration_number || "",
        slogan: storeDetailData?.slogan || "",
        store_category_ids:
          storeDetailData?.store_category?.map((cat) => cat.id.toString()) ||
          [],
      });
    }
  }, [storeDetailData, form]);

  // Handle Store Create/Update Success and Errors
  useEffect(() => {
    if (storeUpdateData) {
      toast.success("Successfully updated the store detail", {
        richColors: true,
      });
      router.back();
    }

    if (storeCreateData) {
      toast.success("Successfully created the store.", {
        richColors: true,
      });
      router.back();
    }

    if (storeCreateError) {
      toast.error(storeCreateError, {
        richColors: true,
      });
    }

    if (storeUpdateError) {
      toast.error(storeUpdateError, {
        richColors: true,
      });
    }

    return () => {
      dispatch(clearStoreUpdateState());
      dispatch(clearStoreCreateState());
    };
  }, [
    storeDetailData,
    storeCreateData,
    storeCreateError,
    storeUpdateData,
    storeUpdateError,
    dispatch,
    router,
  ]);

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  // Handle File Upload and Preview
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement> | null,
    fieldName: string
  ) => {
    if (!e?.target?.files) {
      if (fieldName === "logo") setLogoPreview(null);
      if (fieldName === "cover_image") setCoverPreview(null);
      return;
    }

    const files = Array.from(e.target.files);
    if (fieldName === "logo" || fieldName === "cover_image") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue(fieldName, file);
        if (fieldName === "logo") setLogoPreview(result);
        if (fieldName === "cover_image") setCoverPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission
  async function onSubmit(data: StoreFormValues) {
    const payload = new FormData();

    // Append all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((item) => payload.append(key, item));
        } else if (value instanceof File) {
          payload.append(key, value);
        } else if (typeof value === "string") {
          payload.append(key, value);
        }
      }
    });

    console.log({ payload });

    // Update store if user has one, otherwise create new store
    if (userData && userData?.managed_stores.length > 0) {
      dispatch(updateStore({ payload, id: userData?.managed_stores[0] }));
    } else {
      dispatch(createStore(payload));
    }
  }

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-5xl px-4">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 mt-8"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Back to Dashboard</span>
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-foreground mb-6 mt-8 text-center">
          {storeDetailData ? "Update Your Store" : "Register Your Store"}
        </h1>

        {/* Success Message or Form */}
        {success ? (
          <div className="text-green-600 dark:text-green-400 font-semibold text-center py-8">
            Store {storeDetailData ? "updated" : "registered"} successfully!
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-5xl mx-auto p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ========================================================== */}
                {/* Basic Information */}
                {/* ========================================================== */}

                {/* Store Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Store Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="e.g. My Awesome Store"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Store Type */}
                <FormField
                  control={form.control}
                  name="store_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Store Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select store type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {storeTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Store Categories */}
                <FormField
                  control={form.control}
                  name="store_category_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Categories</FormLabel>
                      <FormControl>
                        <MultiSelect
                          placeholder="Select categories..."
                          options={categoryOptions}
                          selected={field.value || []}
                          onChange={field.onChange}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ========================================================== */}
                {/* Location Information */}
                {/* ========================================================== */}

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">City</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter city"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* District */}
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        District
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter district"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location Link */}
                <FormField
                  control={form.control}
                  name="location_link"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground">
                        Location Link (Google Maps)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="https://maps.google.com/..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Address</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ========================================================== */}
                {/* Contact Information */}
                {/* ========================================================== */}

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Phone</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="bg-background text-foreground border-input"
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ========================================================== */}
                {/* Business Information */}
                {/* ========================================================== */}

                {/* Business Registration Number */}
                <FormField
                  control={form.control}
                  name="business_registration_number"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground">
                        Business Registration Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background text-foreground border-input"
                          placeholder="Enter registration number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ========================================================== */}
                {/* Media Upload */}
                {/* ========================================================== */}

                {/* Store Logo */}
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Store Logo
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="bg-background text-foreground border-input"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange(e, "logo");
                            const file = e.target.files?.[0] ?? null;
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                      {logoPreview && (
                        <div className="mt-2">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-20 w-auto object-contain rounded"
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cover Image */}
                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Cover Image
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="bg-background text-foreground border-input"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange(e, "cover_image");
                            const file = e.target.files?.[0] ?? null;
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                      {coverPreview && (
                        <div className="mt-2">
                          <img
                            src={coverPreview}
                            alt="Cover preview"
                            className="h-20 w-auto object-contain rounded"
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ========================================================== */}
                {/* Additional Information */}
                {/* ========================================================== */}

                {/* Slogan */}
                <FormField
                  control={form.control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground">Slogan</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="bg-background text-foreground border-input"
                          placeholder="Tell us about your store..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full mt-6">
                {userData && userData?.managed_stores?.length > 0
                  ? "Update"
                  : "Submit"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
