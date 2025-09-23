"use client";
import { Button } from "@/components/ui/button";
import { deleteBanner } from "@/redux/features/banner/banner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { BannerCard } from "@/app/_components/banner/BannerCard";
import PageHeader from "@/components/SectionHeader";

const BannerPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { bannerData, bannerStateLoading, bannerError } = useAppSelector((state) => state.banner);
  const { storeDetailData } = useAppSelector(s => s.store)

  const handleDelete = async (id: number) => {
    if (storeDetailData) {
      if (window.confirm("Are you sure you want to delete this banner?")) {
        try {
          await dispatch(deleteBanner({ s_id: storeDetailData.id, b_id: id }));
          toast.success("Banner deleted successfully!");
        } catch (err) {
          await dispatch(deleteBanner({ s_id: storeDetailData.id, b_id: id }));
        }
      }
    }
  };

  return (
    <div className="container  mx-auto p-4">
      <>
        <PageHeader
          title="Banner"
          subtitle="Banner will be shown at the top of the discount detail."
          herf="/dashboard/banner/create"
        />
      </>
      {bannerStateLoading && <p>Loading...</p>}
      {bannerError && <p className="text-red-500">{bannerError}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bannerData && bannerData.map((banner) => (
          <BannerCard key={banner.id} banner={banner} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default BannerPage;
