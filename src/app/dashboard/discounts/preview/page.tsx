"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getDiscountDetail } from "@/redux/features/discount/discount";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import DealsBanner from "./compontnts/DealsBanner";
import DealsLayout from "./compontnts/DealsLayout";

const PreviewPage = () => {
  const dispatch = useAppDispatch()

  const { discountDetailData, discountDetailLoading } = useAppSelector((state) => state.discount);
  const { storeDetailData } = useAppSelector((state) => state.store);

  const searchParams = useSearchParams();
  const dealId = searchParams.get("id");

  useEffect(() => {
    if (storeDetailData && dealId) {
      const payload = {
        s_id: storeDetailData.id,
        d_id: parseInt(dealId, 10),
      }
      dispatch(getDiscountDetail(payload));
    }
  }, [dispatch, storeDetailData, dealId]);

  return (
    <section
      className="col-span-3 space-y-6 h-screen overflow-y-scroll px-4 py-8"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {discountDetailLoading ? (
        <Skeleton className="h-30 w-full bg-muted" />
      ) : (
        (discountDetailData && storeDetailData) && (
          <DealsBanner
            store={storeDetailData}
            name={discountDetailData.name}
            endDate={discountDetailData.end_date}
          />
        )
      )}


      {discountDetailLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton className="h-30 w-full bg-muted" key={i} />
          ))}
        </div>
      ) : discountDetailData?.discount_products?.length ? (
        <DealsLayout
          products={discountDetailData.discount_products}
          layout={[1, 2, 3, 4, 5]}
        />
      ) : (
        <p className="text-gray-500 text-sm">No products available.</p>
      )}
    </section>
  );
};

export default PreviewPage;
