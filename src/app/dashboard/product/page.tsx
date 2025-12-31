"use client";
import { EditFormData, ProductEditSheet } from "@/app/_components/product/ProductEditSheet";
import ProductListTable from "@/app/_components/product/ProductListComponent";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { filterProducts, updateBulkProducts } from "@/redux/features/product/product";
import { ProductItem } from "@/redux/features/product/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Search } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";

export default function ProductsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { productList } = useAppSelector(s => s.product);
  const { storeDetailData } = useAppSelector(s => s.store);
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
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
      dispatch(filterProducts({ s_id: storeDetailData?.id, filter: queryParams.toString() }));
    }
  }, [debouncedSearch, currentPage, dispatch, storeDetailData, pageSize])

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }


  const handleEdit = (formData: EditFormData, productId: number, newImages: File[], imageUrls: string[]) => {
    const form = new FormData()
    console.log("productId", formData)
    form.append("id", productId.toString());
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("brand", formData.brand_id.toString());
    form.append("category", formData.category_id.toString());
    if (formData.is_available != undefined) {
      form.append("is_available", formData.is_available.toString());
    }

    newImages.forEach((image) => {
      form.append("images", image);
    });

    imageUrls.forEach((url) => {
      form.append("image_urls", url);
    });

    if (storeDetailData) {
      const payload = {
        store_pk: storeDetailData.id,
        userData: form,
      }
      dispatch(updateBulkProducts(payload))
    }
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
            <>
              <ProductListTable
                products={productList}
                onView={(product) => console.log("View product:", product)}
                onEdit={(product) => {
                  console.log("Edit product:", product)
                  setIsEditSheetOpen(true)
                  setSelectedProduct(product as ProductItem)
                }}
              />

            </>
          )}
          {productList?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No products available.
            </p>
          )}
        </div>

        <ProductEditSheet
          title={"Edit Product"}
          description="Make changes to the product details below."
          buttonText={"Save Changes"}
          product={selectedProduct}
          open={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          onSave={(formData, productId, newImages, imageUrls) => {
            handleEdit(formData, productId, newImages, imageUrls)
            console.timeLog("formData", formData)
          }}
        />
      </div>
    </div>
  );
}
