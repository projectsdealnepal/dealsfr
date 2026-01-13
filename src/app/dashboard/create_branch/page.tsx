"use client";

import { Button } from "@/components/ui/button";
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
import { Toast } from "@/components/ui/toast";
import {
  createStoreBranch,
  getBranchDetails,
  getStoreDetail,
} from "@/redux/features/store/store";
import {
  clearBranchDetailsState,
  clearCreateBranchState,
} from "@/redux/features/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const branchFormSchema = z.object({
  id: z.number(),
  name: z.string().min(2, {
    message: "Branch name must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City name must be at least 2 characters.",
  }),
  district: z.string().min(2, {
    message: "District name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  location_link: z.string().url({
    message: "Please enter a valid URL.",
  }),
  latitude: z.string().regex(/^-?\d*\.?\d*$/, {
    message: "Please enter a valid latitude.",
  }),
  longitude: z.string().regex(/^-?\d*\.?\d*$/, {
    message: "Please enter a valid longitude.",
  }),
});

type BranchFormValues = z.infer<typeof branchFormSchema>;

export default function CreateBranchPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const action = params.get("action");
  const branch_id = params.get("branch_id");
  const store_id = params.get("store_id");
  const { userData } = useAppSelector((s) => s.userData);
  const { creteBranchData, branchDetailsData } = useAppSelector((s) => s.store);

  const defaultValues: Partial<BranchFormValues> = {
    id: 0,
    name: "",
    city: "",
    district: "",
    address: "",
    location_link: "",
    latitude: "",
    longitude: "",
  };

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues,
  });

  function onSubmit(data: BranchFormValues) {
    try {
      if (parseInt(data.longitude) > 180 || parseInt(data.longitude) < -180) {
        throw new Error("Logitude must be between -180 to 180.");
      }

      if (parseInt(data.latitude) > 90 || parseInt(data.latitude) < -90) {
        throw new Error("Latitude must be between -90 to 90.");
      }

      if (userData && data.id != 0 && action === "edit") {
        dispatch(
          createStoreBranch({
            payload: data,
            id: userData?.managed_stores[0],
            action: "edit",
            branch_id: data?.id,
          })
        );
      }
      if (userData && data.id == 0) {
        dispatch(
          createStoreBranch({
            payload: data,
            id: userData?.managed_stores[0],
            action: "create",
            branch_id: 0,
          })
        );
      }
    } catch (err: any) {
      toast.error(`${err}`, {
        dismissible: true,
        closeButton: true,
        richColors: true,
      });
    }
  }

  useEffect(() => {
    if (creteBranchData && userData) {
      Toast({ message: "successfully Created the branch" });
      dispatch(getStoreDetail(userData?.managed_stores[0]));
      router.replace("/dashboard/store_management");
    }

    return () => {
      dispatch(clearCreateBranchState());
      dispatch(clearBranchDetailsState());
    };
  }, [creteBranchData]);

  useEffect(() => {
    if (action === "edit" && branch_id && store_id) {
      dispatch(
        getBranchDetails({
          store_id: parseInt(store_id),
          branch_id: parseInt(branch_id),
        })
      );
    }
  }, [action, branch_id, store_id, dispatch]);

  useEffect(() => {
    if (action === "edit" && branchDetailsData) {
      form.reset({
        id: branchDetailsData.id,
        name: branchDetailsData.name,
        city: branchDetailsData.city,
        district: branchDetailsData.district,
        address: branchDetailsData.address,
        location_link: branchDetailsData.location_link,
        latitude: branchDetailsData.latitude,
        longitude: branchDetailsData.longitude,
      });
    }
  }, [branchDetailsData, action, form]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-card-foreground">
          {action === "edit" ? "Update Branch" : "Create New Branch"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-card-foreground">Branch Details</CardTitle>
          <CardDescription className="text-muted-foreground">
            Fill in the details for your new branch location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Branch Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter branch name"
                          className="bg-background text-foreground border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city"
                          className="bg-background text-foreground border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          placeholder="Enter district"
                          className="bg-background text-foreground border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Location Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Google Maps URL"
                          type="url"
                          className="bg-background text-foreground border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-muted-foreground">
                        Add a Google Maps link for your branch location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Latitude
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter latitude"
                          className="bg-background text-foreground border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Longitude
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter longitude"
                          className="bg-background text-foreground border-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter complete address"
                        className="bg-background text-foreground border-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {action === "edit" ? "Update Branch" : "Create Branch"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
