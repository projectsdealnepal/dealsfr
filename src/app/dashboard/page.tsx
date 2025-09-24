"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { userData, userStateLoading, userError } = useAppSelector(
    (state) => state.userData
  );
  const { storeDetailData } = useAppSelector((state) => state.store);

  // Load store details and branches if user has managed stores
  // useEffect(() => {
  //   if (userData && userData.managed_stores.length > 0) {
  //     dispatch(getStoreDetail(userData.managed_stores[0]));
  //     dispatch(getBranchesList(userData.managed_stores[0]));
  //   }
  // }, []);

  // Loading skeleton
  if (userStateLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    );
  }

  // Error state
  if (userError || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert className="max-w-md border-destructive">
          <AlertDescription className="text-destructive-foreground">
            {userError || "Failed to load dashboard data"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Alerts */}
      {storeDetailData && storeDetailData.branches?.length < 1 && (
        <Link href="/dashboard/create_branch">
          <div className="cursor-pointer flex justify-between items-center px-5 py-3 rounded-md bg-primary/10 text-foreground hover:bg-primary/20 transition-colors">
            You need to setup at least one store branch to publish Discounts.
            <ChevronRight />
          </div>
        </Link>
      )}

      {!storeDetailData && (
        <Link href="/dashboard/store_setup">
          <div className="cursor-pointer flex justify-between items-center px-5 py-3 rounded-md bg-primary/10 text-foreground hover:bg-primary/20 transition-colors">
            Complete your store registration process.
            <ChevronRight />
          </div>
        </Link>
      )}

      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {userData.first_name}!
        </h1>
        <p className="text-muted-foreground">
          {` Here's what's happening with your store today. `}
        </p>
      </div>

      {/* TODO: Add dashboard widgets, stats, etc. here */}
    </div>
  );
}
