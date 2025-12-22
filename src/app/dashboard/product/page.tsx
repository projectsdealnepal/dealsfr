"use client";
import { getSubCategory } from "@/redux/features/category/category";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import { JSX } from "react/jsx-runtime";
import { DataTable } from "../discounts/select_product/Components/data-table";
import { columns } from "../discounts/select_product/Components/columns";

export default function ProductsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { productList } = useAppSelector(s => s.product);

  useEffect(() => {
    dispatch(getSubCategory());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Products
          </h1>
        </header>

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
        </div>

      </div>
    </div>
  );
}
