"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import {
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import QuickAction from "../_components/dashboardComp/QuickActions";
import StoreInsight from "../_components/dashboardComp/StoreInsights";

const DashboardPage = () => {
  const {
    userData,
    userStateLoading,
    userError
  } = useAppSelector((s) => s.userData);
  const { storeDetailData } = useAppSelector((s) => s.store);


  // Loading skeleton
  if (userStateLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-4xl">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
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
          Welcome back, {userData.first_name}
        </h1>
        <p className="text-muted-foreground">
          {`Here's what's happening with your store today.`}
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <QuickAction />
      </div>

      {/* Store Insights */}
      <div>
        <StoreInsight />
      </div>
    </div>
  );
};

export default DashboardPage;
