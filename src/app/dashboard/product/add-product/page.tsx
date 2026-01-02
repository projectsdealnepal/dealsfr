"use client";
import { CategorySelectorSheet } from "@/app/_components/CategoriesSheet";
import { EditFormData, ProductEditSheet } from "@/app/_components/product/ProductEditSheet";
import ProductListPagination from "@/app/_components/product/ProductListPagination";
import { AppBreadcrumbs } from "@/components/PageBreadcumbs";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryItem } from "@/redux/features/category/types";
import {
  createProduct,
  getAllProducts,
} from "@/redux/features/product/product";
import { GenericProductItem } from "@/redux/features/product/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  ArrowRight,
  ChevronDown,
  Package,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const { categoryData } = useAppSelector((s) => s.category);
  const {
    allProductList,
    tempAddedProductList,
    allProductPagination,
    productLoading,
    addProductToStoreData,
  } = useAppSelector((state) => state.product);
  const { storeDetailData } = useAppSelector((s) => s.store);

  const [catSheetOpen, setCatSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<GenericProductItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    null
  );
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const pageSize = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products when search or category or page changes
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (debouncedSearch) queryParams.append("search", debouncedSearch);
    queryParams.append("page", currentPage.toString());
    queryParams.append("page_size", pageSize.toString());
    queryParams.append("category", selectedCategory?.id.toString() ?? "");

    dispatch(getAllProducts(queryParams.toString()));
  }, [debouncedSearch, currentPage, selectedCategory, dispatch]);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category: CategoryItem) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  //actions for selecting and removing temp added products(products to be added to the
  //store)

  const isProductSelected = (productId: number) => {
    return tempAddedProductList.some((p) => p.id === productId);
  };


  const handleAddToStore = (p: GenericProductItem) => {
    setSelectedProduct(p)
    setIsEditSheetOpen(true)
  };

  const handleSave = (formData: EditFormData, newImages: File[], imageUrls: string[]) => {
    const form = new FormData()
    form.append("name", formData.name)
    form.append("description", formData.description)
    form.append("price", formData.price)
    form.append("brand", formData.brand_id.toString())
    form.append("category", formData.category_id.toString())
    newImages.forEach((image) => {
      form.append("images", image)
    })
    imageUrls.forEach((image) => {
      form.append("image_urls", image)
    })

    if (storeDetailData) {
      const payload = {
        store_pk: storeDetailData.id,
        userData: form,
      }
      dispatch(createProduct(payload))
    }
  }

  useEffect(() => {
    if (addProductToStoreData) {
      toast.success("Product added to store successfully");
    }
  }, [addProductToStoreData]);

  // useEffect(() => {
  //   if (createProductData) {
  //     toast.success("Product created successfully");
  //   }
  //   if (createProductError) {
  //     toast.error("Failed to create product");
  //   }
  //   return () => {
  //     dispatch(clearProductCreadteState())
  //   }
  // }, [createProductData, createProductError]);

  // useEffect(() => {
  //   if (bulkProductUpdateData) {
  //     toast.success("Products updated successfully");
  //   }
  //   if (bulkProductUpdateError) {
  //     toast.error("Failed to update products");
  //   }
  //   return () => {
  //     dispatch(clearBulkProductUpdateState())
  //   }
  // }, [bulkProductUpdateData, bulkProductUpdateError]);


  return (
    <div className="flex flex-1 flex-col min-h-screen p-6">
      <div className="w-full max-w-7xl  space-y-6">
        {/* Header */}
        <PageHeader
          title="Add Products"
          subtitle="Search and select products to add to your store"
          buttonText="Create New product "
          onClick={() => setIsAddSheetOpen(true)}
        />

        {/* //sheet for adding new product to the store (manually) */}
        <ProductEditSheet
          title={"Add New Product"}
          description="Enter the product details to add a new product to your store"
          buttonText={"Add to store"}
          product={null}
          open={isAddSheetOpen}
          onClose={() => setIsAddSheetOpen(false)}
          onSave={(formData, _, newImages, imageUrls) => {
            handleSave(formData, newImages, imageUrls)
            console.timeLog("formData", formData)
          }}
        />


        {/* Search + Category selector (compact, inline) */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-7xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={handleSearchInput}
              placeholder="Search products by name, description..."
              className="pl-12 pr-44 py-6 text-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                onClick={() => setCatSheetOpen(true)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 rounded-md"
              >
                <span className="text-sm">
                  {selectedCategory ? selectedCategory.name : "All Categories"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              {/* Clear selected category button (icon only) */}
              {selectedCategory && (
                <button
                  aria-label="Clear selected category"
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 border-none inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              )}
            </div>

            {/* Category sheet */}
            {categoryData && (
              <CategorySelectorSheet
                open={catSheetOpen}
                onClose={() => setCatSheetOpen(false)}
                categories={categoryData}
                onSelect={(item) => {
                  handleCategorySelect(item);
                }}
              />
            )}
          </div>
        </div>

        {/* Selected category info (as a compact tag shown under input on small screens) */}
        {selectedCategory && (
          <div className="mt-3 md:mt-2">
            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
              <span className="text-slate-700">Category:</span>
              <span className="text-slate-900">{selectedCategory.name}</span>
              <button
                aria-label="Clear selected category"
                onClick={() => setSelectedCategory(null)}
                className="ml-2 inline-flex items-center justify-center p-1 rounded-full border-none hover:bg-slate-200"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <Card className="p-0 rounded-none">
          <CardContent className="p-2">
            {productLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : allProductList && allProductList.length > 0 ? (
              <>
                <Table>
                  <TableHeader className="px-2">
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      {/* <TableHead className="w-12"> */}
                      {/*   <div className="flex items-center justify-center"> */}
                      {/*     <span className="text-slate-600 font-semibold"> */}
                      {/*       Select */}
                      {/*     </span> */}
                      {/*   </div> */}
                      {/* </TableHead> */}
                      <TableHead className="font-semibold text-slate-700 w-20">
                        Image
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Product Name
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Category
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Brand
                      </TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allProductList.map((product: GenericProductItem) => (
                      <TableRow
                        key={product.id}
                        className={`hover:bg-blue-50/50 transition-colors ${isProductSelected(product.id) ? "bg-blue-50/70" : ""
                          }`}
                      >
                        {/* <TableCell> */}
                        {/*   <div className="flex items-center justify-center"> */}
                        {/*     <Checkbox */}
                        {/*       checked={isProductSelected(product.id)} */}
                        {/*       onCheckedChange={(checked) => */}
                        {/*         handleSelectProduct(product, checked as boolean) */}
                        {/*       } */}
                        {/*       className="w-5 h-5" */}
                        {/*     /> */}
                        {/*   </div> */}
                        {/* </TableCell> */}
                        <TableCell>
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                            {product.images.length ? (
                              <Image
                                src={
                                  typeof product.images[0] === 'string'
                                    ? product.images[0]
                                    : product.images[0].image
                                }
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          <div className="flex flex-col">
                            <span className="truncate max-w-xs">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {product.category.name}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {product.brand.name}
                        </TableCell>
                        <TableCell className="h-full text-slate-600">
                          <Button
                            onClick={() => handleAddToStore(product)}
                            variant="default"
                            size="sm"
                            className="flex items-center gap-2 ml-auto rounded-md"
                          >
                            <span className="">Add to store</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <ProductListPagination
                  currentPage={currentPage}
                  totalProducts={allProductPagination}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Package className="w-16 h-16 mb-4 text-slate-300" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}

            <ProductEditSheet
              title={"Add Product to your store "}
              description="Edit the detail and add to your store"
              buttonText={"Add to store"}
              product={selectedProduct}
              open={isEditSheetOpen}
              onClose={() => setIsEditSheetOpen(false)}
              onSave={(formData, _, newImages, imageUrls) => {
                handleSave(formData, newImages, imageUrls)
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
