"use client";
import { DiscountDetailView } from "@/app/_components/discount/DiscountDetailView";
import { Button } from "@/components/ui/button";
import { getDiscountDetail } from "@/redux/features/discount/discount";
import { clearDiscountDetailState, } from "@/redux/features/discount/discountSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DiscountDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { storeDetailData } = useAppSelector((state) => state.store);
  const { discountDetailData, discountDetailLoading, discountError } = useAppSelector((state) => state.discount);

  useEffect(() => {
    if (storeDetailData?.id && id) {
      dispatch(getDiscountDetail({ s_id: storeDetailData.id, d_id: Number(id) }));
    }
    
    return () => {
       dispatch(clearDiscountDetailState());
    }
  }, [dispatch, storeDetailData?.id, id]);

  if (discountDetailLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (discountError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center min-h-[500px] gap-4">
        <p className="text-destructive font-medium">Error: {discountError}</p>
        <Button onClick={() => router.push("/dashboard/discounts")}>Go Back</Button>
      </div>
    );
  }

  if (!discountDetailData) {
    return null; 
  }

  return (
    <div className="p-4 md:p-6 h-full w-full bg-background overflow-y-auto">
       <DiscountDetailView data={discountDetailData} storeId={storeDetailData?.id || 0} />
    </div>
  );
};

export default DiscountDetailPage;
