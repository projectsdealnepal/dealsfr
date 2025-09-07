"use client";

import { DashboardNav } from "@/app/_components/dashboardComp/dashboard-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { getBanner } from "@/redux/features/banner/banner";
import { getDiscount } from "@/redux/features/discount/discount";
import { getLayout } from "@/redux/features/layout/layout";
import { getBranchesList, getSocialMediaList, getStoreDetail, getStoreDocumentsList } from "@/redux/features/store/store";
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

  useEffect(() => {
    dispatch(getUser());
  }, []);

  //get the storedetail and branch list on page render 
  useEffect(() => {
    if (userData && userData.managed_stores.length > 0) {
      const storeId = userData.managed_stores[0]
      dispatch(getStoreDetail(storeId))
      dispatch(getBranchesList(storeId))
      dispatch(getStoreDocumentsList(storeId))
      dispatch(getSocialMediaList(storeId))
      dispatch(getDiscount(storeId));
      dispatch(getLayout(storeId));
      dispatch(getBanner(storeId));
    }
  }, [userData])

  // Show loading skeleton while fetching user data
  if (userStateLoading && !userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full bg-gray-800" />
          <Skeleton className="h-8 w-3/4 bg-gray-800" />
          <Skeleton className="h-8 w-1/2 bg-gray-800" />
        </div>
      </div>
    );
  }

  // Show error state
  if (userError && !userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-400 mb-4">{userError}</p>
          <button
            onClick={() => router.push("/loginUser")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Don't render anything if still loading or no user
  if (!userData) {
    return null
  }

  return <DashboardNav>{children}</DashboardNav>;
}
