"use client";

import {
  BundleCreateFormData,
  ProductBundleCreateSheet,
} from "@/app/_components/product/ProductBundleCreateSheet";
import {
  EditFormData,
  ProductEditSheet,
} from "@/app/_components/product/ProductEditSheet";
import ProductListTable from "@/app/_components/product/ProductListComponent";
import { ProductViewSheet } from "@/app/_components/product/ProductViewSheet";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createProduct,
  filterProducts,
  updateBulkProducts,
} from "@/redux/features/product/product";
import { ProductItem } from "@/redux/features/product/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Group, Search } from "lucide-react";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { JSX } from "react/jsx-runtime";
import { toast } from "sonner";

export default function ProductsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { productList, bundleProductList } = useAppSelector((s) => s.product);
  const { storeDetailData } = useAppSelector((s) => s.store);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isBundleSheetOpen, setIsBundleSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );
  const pageSize = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products when search or page changes
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (debouncedSearch) queryParams.append("search", debouncedSearch);
    queryParams.append("page", currentPage.toString());
    queryParams.append("page_size", pageSize.toString());

    if (storeDetailData) {
      dispatch(
        filterProducts({
          s_id: storeDetailData?.id,
          filter: queryParams.toString(),
        })
      );
    }
  }, [debouncedSearch, currentPage, dispatch, storeDetailData, pageSize]);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddBundle = () => {
    setIsBundleSheetOpen(true);
  };

  const handleCreateBundle = (
    formData: BundleCreateFormData,
    newImages: File[]
  ) => {
    if (!storeDetailData) return;

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    // form.append("brand", formData.brand.toString());
    // form.append("category", formData.category.toString());
    form.append("is_available", formData.is_available.toString());
    form.append("product_type", "COMBO");

    // Append combo items
    bundleProductList.forEach((item, index) => {
      form.append(`combo_items[${index}]component_product`, item.id.toString());
      form.append(`combo_items[${index}]quantity`, item.quantity.toString());
    });
    newImages.forEach((image) => {
      form.append("images", image);
    });

    dispatch(
      createProduct({ store_pk: storeDetailData.id, userData: form })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setIsBundleSheetOpen(false);
      }
    });
  };

  const handleEdit = (
    formData: EditFormData,
    productId: number,
    newImages: File[],
    imageUrls: string[]
  ) => {
    const form = new FormData();
    console.log("productId", formData);
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
      };
      dispatch(updateBulkProducts(payload));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-7xl space-y-8">
        {/* Header */}

        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center  text-foreground mb-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold mb-2">Products</h1>
            <h3 className="text-xs md:text-sm text-muted-foreground">
              Manage and review your store products.
            </h3>
          </div>
          <div className="flex flex-row gap-2 ">
            <Button
              variant="default"
              className="flex-1 md:flex-none px-8 cursor-pointer"
              onClick={handleAddBundle}
            >
              <span className="flex-row flex items-center gap-2">
                Create Bundle
                <Group />
              </span>
            </Button>
            <Button
              variant="default"
              className="flex-1 md:flex-none px-8"
              asChild
            >
              <Link href={"/dashboard/product/add-product"}>
                Add New Product
              </Link>
            </Button>
          </div>
        </div>

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
        </div>

        {/* Form */}
        <div className="">
          {productList && (
            <>
              <ProductListTable
                products={productList}
                onView={(product) => {
                  console.log("View product:", product);
                  setSelectedProduct(product as ProductItem);
                  setIsViewSheetOpen(true);
                }}
                onEdit={(product) => {
                  console.log("Edit product:", product);
                  setIsEditSheetOpen(true);
                  setSelectedProduct(product as ProductItem);
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
            handleEdit(formData, productId, newImages, imageUrls);
            console.timeLog("formData", formData);
          }}
        />

        <ProductViewSheet
          product={selectedProduct}
          open={isViewSheetOpen}
          onClose={() => setIsViewSheetOpen(false)}
          title="Product Details"
          description="View complete information about this product."
        />

        <ProductBundleCreateSheet
          open={isBundleSheetOpen}
          onClose={() => setIsBundleSheetOpen(false)}
          onSave={handleCreateBundle}
        />
      </div>
    </div>
  );
}
