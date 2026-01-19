"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GenericProductItem,
  ProductItem,
} from "@/redux/features/product/types";
import {
  Calendar,
  CheckCircle2,
  Info,
  Package,
  Store,
  Tag,
  XCircle,
} from "lucide-react";
import Image from "next/image";

interface ProductViewSheetProps {
  product: ProductItem | GenericProductItem | null;
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function ProductViewSheet({
  product,
  open,
  onClose,
  title = "Product Details",
  description = "View complete information about this product.",
}: ProductViewSheetProps) {
  if (!product) return null;

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

  const getImages = () => {
    if (isProductItem(product)) {
      return [product.image];
    }
    return (
      product.images?.map((img) =>
        typeof img === "string" ? img : img.image
      ) || []
    );
  };

  const images = getImages();

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl px-0">
        <SheetHeader className="px-6 pb-6 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant={product.is_available ? "default" : "secondary"}
              className={
                product.is_available
                  ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                  : ""
              }
            >
              {product.is_available ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Available
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Unavailable
                </span>
              )}
            </Badge>
            <Badge variant="outline" className="text-gray-500 border-gray-200">
              ID: #{product.id}
            </Badge>
          </div>
          <SheetTitle className="text-2xl font-bold text-gray-900 leading-tight">
            {title}
          </SheetTitle>
          <SheetDescription className="text-gray-500 mt-1">
            {description}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] px-6">
          <div className="space-y-8 py-6 pb-12">
            {/* Name Section */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Product Name
              </Label>
              <h3 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h3>
            </div>

            {/* Images Grid */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Product Visuals
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {images.length > 0 ? (
                  images.map((url, index) => (
                    <div
                      key={`image-${index}`}
                      className={`relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm ${
                        index === 0 && images.length % 2 !== 0
                          ? "col-span-2 aspect-[16/9]"
                          : ""
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`${product.name} visual ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 aspect-video rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-dashed border-gray-200">
                    <Package className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">No images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price section */}
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-primary/60 font-medium">
                  List Price
                </p>
                <p className="text-3xl font-bold text-primary tracking-tight">
                  {isProductItem(product)
                    ? product.price
                    : product.price || "N/A"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-gray-400">
                  <Package className="w-4 h-4" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">
                    Category
                  </Label>
                </div>
                <p className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  {product.category.name}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-gray-400">
                  <Store className="w-4 h-4" />
                  <Label className="text-xs font-semibold uppercase tracking-wider">
                    Brand
                  </Label>
                </div>
                <p className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  {product.brand.name}
                </p>
              </div>

              {isProductItem(product) && (
                <div className="space-y-1.5 col-span-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Store className="w-4 h-4" />
                    <Label className="text-xs font-semibold uppercase tracking-wider">
                      Available at Store
                    </Label>
                  </div>
                  <p className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    {product.store}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Info className="w-4 h-4" />
                <Label className="text-xs font-semibold uppercase tracking-wider">
                  Description
                </Label>
              </div>
              <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {product.description ||
                  "No description provided for this product."}
              </div>
            </div>

            {/* Extra Metadata */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <div className="flex items-center gap-1.5 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {formatDate(product.created_at)}</span>
                </div>
                <div className="uppercase tracking-widest">
                  {isProductItem(product) &&
                    `Updated: ${formatDate(product.updated_at)}`}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
