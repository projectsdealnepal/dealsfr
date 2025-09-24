"use client";
import { DiscountCard } from "@/app/_components/discount/DiscountCard";
import PageHeader from "@/components/PageHeader";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";

const StoreManager = () => {
  const { discountData, discountStateLoading: discountLoading } = useAppSelector((s) => s.discount);

  useEffect(() => {
  }, []);

  console.log("discount", discountData);

  return (
    <div className="container mx-auto p-4">
      <>
        <PageHeader
          title='Discounts'
          subtitle='Discount will be shown to the user along with the banner layout and products on it.'
          herf={"/dashboard/discounts/create"}
        />
      </>

      <div className="w-full my-8">
        {discountData && !discountLoading
          ? discountData?.map((item, index) => {
            return (
              <div className="my-8" key={index.toString()}>
                <DiscountCard item={item} />
              </div>
            );
          })
          : null}
      </div>
    </div>
  );
};

export default StoreManager;
