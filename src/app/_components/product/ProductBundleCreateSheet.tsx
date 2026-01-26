"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";
import { ChevronDown, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { BrandSelector } from "../BrandSelector";
import { CategorySelectorSheet } from "../CategoriesSheet";
import BundleProductSelector from "./BundleProductSelector";

export interface BundleComboItem {
  component_product: number;
  quantity: number;
  // Local UI only
  name?: string;
  price?: string;
  image?: string;
}

export interface BundleCreateFormData {
  name: string;
  description: string;
  price: string;
  is_available: boolean;
  category: number;
  brand: number;
  product_type: "BUNDLE";
  combo_items: BundleComboItem[];
}

interface ProductBundleCreateSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: BundleCreateFormData, newImages: File[]) => void;
}

export function ProductBundleCreateSheet({
  open,
  onClose,
  onSave,
}: ProductBundleCreateSheetProps) {
  const { createProductLoading } = useAppSelector((s) => s.product);
  const { categoryData } = useAppSelector((s) => s.category);
  const [formData, setFormData] = useState<BundleCreateFormData>({
    name: "",
    description: "",
    price: "",
    is_available: true,
    category: 0,
    brand: 0,
    product_type: "BUNDLE",
    combo_items: [],
  });
  const [newImages, setNewImages] = useState<File[]>([]);

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
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter bundle name";
    if (!formData.description.trim()) return "Please enter bundle description";
    if (!formData.price) return "Please enter bundle price";
    return null;
  };

  const handleSave = () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    onSave(formData, newImages);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-3xl px-4 flex flex-col h-full">
        <SheetHeader className="px-0">
          <SheetTitle>Create Product Bundle</SheetTitle>
          <SheetDescription>
            Group multiple products together as a single item.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-2 px-2 overflow-y-auto">
          <div className="space-y-6 py-4">
            {/* Bundle Metadata */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bundle Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Weekend Breakfast Combo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what's included in this bundle"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Bundle Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Total price"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="flex items-center h-10 gap-2">
                    <Switch
                      checked={formData.is_available}
                      onCheckedChange={(checked) =>
                        setFormData((p) => ({ ...p, is_available: checked }))
                      }
                    />
                    <span className="text-sm">
                      {formData.is_available ? "Available" : "Hidden"}
                    </span>
                  </div>
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4 text-sm"> */}
              {/*   <div className="space-y-1.5"> */}
              {/*     <Label className="text-muted-foreground">Category *</Label> */}
              {/*     {categoryData && ( */}
              {/*       <CategorySelectorSheet */}
              {/*         open={catSheetOpen} */}
              {/*         onClose={() => setCatSheetOpen(false)} */}
              {/*         categories={categoryData} */}
              {/*         onSelect={(item) => { */}
              {/*           setSelectedCategory(item); */}
              {/*           setFormData((prev) => ({ ...prev, category: item.id })); */}
              {/*         }} */}
              {/*       /> */}
              {/*     )} */}
              {/*     <Button */}
              {/*       type="button" */}
              {/*       variant="outline" */}
              {/*       className="w-full justify-between" */}
              {/*       onClick={() => setCatSheetOpen(true)} */}
              {/*     > */}
              {/*       <span>{selectedCategory?.name || "Select Category"}</span> */}
              {/*       <ChevronDown className="h-4 w-4 opacity-50" /> */}
              {/*     </Button> */}
              {/*   </div> */}
              {/**/}
              {/*   <div className="space-y-1.5"> */}
              {/*     <Label className="text-muted-foreground">Brand *</Label> */}
              {/*     <BrandSelector */}
              {/*       value={selectedBrand} */}
              {/*       onSelect={(brand) => { */}
              {/*         setSelectedBrand(brand); */}
              {/*         setFormData((prev) => ({ */}
              {/*           ...prev, */}
              {/*           brand: brand?.id ?? 0, */}
              {/*         })); */}
              {/*       }} */}
              {/*     /> */}
              {/*   </div> */}
              {/* </div> */}
            </div>

            {/* Images Section */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Bundle Images *</Label>
              {newImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {newImages.map((file, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  id="bundle-image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="bundle-image-upload"
                  className="cursor-pointer flex flex-col items-center gap-1"
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Click to upload images
                  </span>
                </label>
              </div>
            </div>

            {/* Bundle Items (Combo Items) */}
            <div className="space-y-4 pt-4 border-t">
              <BundleProductSelector />
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="px-0 pt-4 border-t mt-auto">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={createProductLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createProductLoading}>
            {createProductLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Bundle"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
