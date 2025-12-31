"use client";
import { CategorySelectorSheet } from "@/app/_components/CategoriesSheet";
import ProductListTable from "@/app/_components/product/ProductListComponent";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryItem } from "@/redux/features/category/types";
import { getProducts } from "@/redux/features/product/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChevronDown, Search } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";

export default function ProductsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { productList } = useAppSelector(s => s.product);
  const { storeDetailData } = useAppSelector(s => s.store);
  const { categoryData } = useAppSelector(s => s.category)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const pageSize = 10

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1) // Reset to first page on new search
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch products when search or page changes
  useEffect(() => {
    const queryParams = new URLSearchParams()
    if (debouncedSearch) queryParams.append('search', debouncedSearch)
    queryParams.append('page', currentPage.toString())
    queryParams.append('page_size', pageSize.toString())

    if (storeDetailData) {
      dispatch(getProducts({ s_id: storeDetailData?.id, filter: queryParams.toString() }));
    }
  }, [debouncedSearch, currentPage, dispatch, storeDetailData, pageSize])

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-7xl space-y-8">
        {/* Header */}
        <PageHeader
          title="Products"
          subtitle="Manage and review your store products."
          buttonText="Add New Product"
          herf="/dashboard/product/add-product"
        />

        {/* Search and Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative max-w-4xl flex-4 ">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={handleSearchInput}
              placeholder="Search for products by name, description..."
              className="pl-12 py-5 max-w-xl text-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent "
            />
          </div>

          {/* <div className="flex flex-2 md:justify-end">
            <Button onClick={() => setCatSheetOpen(true)} variant={"ghost"}>
              Categories
              <ChevronDown />
            </Button>
            {categoryData && (
              <CategorySelectorSheet
                open={catSheetOpen}
                onClose={() => setCatSheetOpen(false)}
                categories={categoryData}
                onSelect={(item) => {
                  setSelectedCategory(item.id)
                  console.log("Selected category:", item);
                  console.log("Selected category IDs:", item);
                }}
              />
            )}
          </div> */}
        </div>

        {/* Form */}
        <div className="">
          {productList && (
            <ProductListTable
              products={productList}
              onView={(product) => console.log("View product:", product)}
              onEdit={(product) => console.log("Edit product:", product)}
              onDelete={(product) => console.log("Delete product:", product)}
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
