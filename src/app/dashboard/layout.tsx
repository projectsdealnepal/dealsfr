"use client";

import { DashboardNav } from "@/app/_components/dashboardComp/dashboard-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { getBanner } from "@/redux/features/banner/banner";
import { getDiscount } from "@/redux/features/discount/discount";
import { getLayout } from "@/redux/features/layout/layout";
import {
  getBranchesList,
  getSocialMediaList,
  getStoreDetail,
  getStoreDocumentsList,
} from "@/redux/features/store/store";
import { getUser } from "@/redux/features/user/user";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userData, userStateLoading, userError } = useAppSelector(
    (state) => state.userData
  );

  // Fetch user data
  useEffect(() => {
    dispatch(getUser());
  }, []);

  // Fetch store-related data if user has managed stores
  useEffect(() => {
    if (userData && userData.managed_stores.length > 0) {
      const storeId = userData.managed_stores[0];
      dispatch(getStoreDetail(storeId));
      dispatch(getBranchesList(storeId));
      dispatch(getStoreDocumentsList(storeId));
      dispatch(getSocialMediaList(storeId));
      dispatch(getDiscount(storeId));
      dispatch(getLayout(storeId));
      dispatch(getBanner(storeId));
    }
  }, [userData]);

  // Loading skeleton
  if (userStateLoading && !userData) {
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
  if (userError && !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-xl font-semibold text-foreground">Authentication Error</h2>
          <p className="text-muted-foreground">{userError}</p>
          <button
            onClick={() => router.push("/loginUser")}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render dashboard if user exists
  if (!userData) return null;

  return <DashboardNav>{children}</DashboardNav>;
}
