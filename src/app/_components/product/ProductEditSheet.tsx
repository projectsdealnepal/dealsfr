"use client";

import { ProductImageFile } from "@/app/dashboard/product/add-product/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { GenericProductItem, ProductItem } from "@/redux/features/product/types";
import { useAppSelector } from "@/redux/hooks";
import { ChevronDown, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandSelector } from "../BrandSelector";
import { CategorySelectorSheet } from "../CategoriesSheet";

export interface EditFormData {
  name: string;
  description: string;
  price: string;
  brand_id: number;
  category_id: number;
}

interface ProductEditSheetProps {
  title: string;
  description: string;
  buttonText: string;
  product: ProductItem | GenericProductItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedProduct: EditFormData, productId: number, newImages: File[], imageUrls: string[]) => void;
}

export function ProductEditSheet({
  product,
  open,
  onClose,
  onSave,
  title,
  description,
  buttonText,
}: ProductEditSheetProps) {
  const [formData, setFormData] = useState<EditFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: (product && product.price?.toString()) ?? "",
    brand_id: product?.brand.id || 0,
    category_id: product?.category.id || 0,
  });
  const [catSheetOpen, setCatSheetOpen] = useState(false);
  const [brand, setBrand] = useState(product?.brand)
  const [category, setCategory] = useState(product?.category)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { createProductLoading, bulkProductUpdateLoading } = useAppSelector((s) => s.product)
  const { categoryData } = useAppSelector((s) => s.category)

  // Type guard to check if product is ProductItem
  const isProductItem = (
    product: ProductItem | GenericProductItem | null
  ): product is ProductItem => {
    return (
      product !== null &&
      typeof product === "object" &&
      "image" in product &&
      typeof product.image === "string"
    );
  };

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: isProductItem(product) ? product.price : product.price?.toString() || "",
        brand_id: product.brand.id || 0,
        category_id: product.category.id || 0,
      });
      setCategory(product.category)
      setBrand(product.brand)

      // Set existing images
      if (isProductItem(product)) {
        setExistingImages([product.image]);
      } else {
        setExistingImages(
          product.images?.map((img) =>
            typeof img === 'string' ? img : img.image
          ) || []
        );
      }

      // Clear new images when product changes
      setNewImages([]);
      setImagePreviews([]);
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setNewImages((prev) => [...prev, ...fileArray]);

    // Create previews for new images
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSave = () => {
    if (!product) return;

    console.log(formData)
    console.log(product.id)
    console.log(newImages)
    console.log(existingImages)
    console.log("===============")

    if (!validateForm()) {
      return;
    }
    onSave(formData, product.id, newImages, existingImages);
  };

  const hasChanges = () => {
    if (!product) return false;

    const hasNewImages = newImages.length > 0;
    const nameChanged = formData.name !== product.name;
    const descChanged = formData.description !== product.description;
    const priceChanged = isProductItem(product)
      ? formData.price !== product.price
      : formData.price !== (product.price || "");

    return nameChanged || descChanged || priceChanged || hasNewImages;
  };

  const validateForm = () => {
    if (formData.name.trim() === "") {
      toast.error("Please enter product name")
      return false;
    }
    if (formData.description.trim() === "") {
      toast.error("Please enter product description")
      return false;
    }
    if (!formData.price) {
      toast.error("Please enter product price")
      return false;
    }
    if (formData.brand_id === 0) {
      toast.error("Please select product brand")
      return false;
    }
    if (formData.category_id === 0) {
      toast.error("Please select product category")
      return false;
    }
    return true;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-3xl  px-4 ">
        <SheetHeader className="px-0">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {description}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Price *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step="0.1"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                required={isProductItem(product!)}
              />
            </div>

            {/* Images Section */}
            <div className="space-y-3">
              <Label>Product Images</Label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Current Images
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {existingImages.map((url, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {newImages?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">New Images</p>
                  <div className="grid grid-cols-5 gap-2">
                    {newImages.map((preview, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-green-200"
                      >
                        <Image
                          src={URL.createObjectURL(preview)}
                          alt={`New image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Upload Images
                    </p>
                    <p className="text-xs text-gray-500">
                      Click to browse or drag and drop
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Product Info (Read-only) */}
            {product && (
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700">
                  Product Information
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    {/* Category sheet */}
                    {categoryData && (
                      <CategorySelectorSheet
                        open={catSheetOpen}
                        onClose={() => setCatSheetOpen(false)}
                        categories={categoryData}
                        onSelect={(item) => {
                          setCategory(item)
                          setFormData((prev) => {
                            return {
                              ...prev,
                              category_id: item.id
                            }
                          })
                        }}
                      />
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setCatSheetOpen(true)}
                    >
                      {category?.name || "Select Category"}
                      <ChevronDown />
                    </Button>

                  </div>
                  <div>
                    <span className="text-muted-foreground">Brand:</span>
                    <BrandSelector
                      value={brand}
                      onSelect={(brand) => {
                        setBrand(brand)
                        setFormData((prev) => {
                          return {
                            ...prev,
                            brand_id: brand?.id ?? 0
                          }
                        })
                      }} />
                  </div>
                  {isProductItem(product) && (
                    <>
                      <div>
                        <span className="text-muted-foreground">Store:</span>
                        <p className="font-medium">{product.store}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-medium">
                          {product.is_available ? "Available" : "Unavailable"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="flex flex-row justify-end space-x-2 px-0 ">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges() || !formData.name || !formData.description}
          >
            {bulkProductUpdateLoading || createProductLoading && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {buttonText}

          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
