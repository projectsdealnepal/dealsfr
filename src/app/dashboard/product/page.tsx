"use client";
import { getCategories, getSubCategory } from "@/redux/features/category/category";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import { JSX } from "react/jsx-runtime";
import { DataTable } from "../discounts/select_product/Components/data-table";
import { columns } from "../discounts/select_product/Components/columns";
import PageHeader from "@/components/PageHeader";
import { getProducts } from "@/redux/features/product/product";

export default function ProductsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { productList } = useAppSelector(s => s.product);
  const { storeDetailData } = useAppSelector(s => s.store);

  useEffect(() => {
    if (storeDetailData) {
      dispatch(getProducts(storeDetailData?.id));
    }
  }, [storeDetailData]);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-7xl space-y-8">
        {/* Header */}
        <PageHeader
          title="Products"
          subtitle="Manage and review your store products."
          hasButton={false}
        />

        {/* Form */}
        <div className="">
          {productList && (
            <DataTable
              mode="reward"
              setSelectProductDialog={() => console.log("a")}
              columns={columns}
              data={productList}
            />
          )}
          {productList?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No products available.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
