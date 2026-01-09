"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const discountTypeOptions = [
  { value: "PERCENTAGE", label: "Percentage Off" },
  { value: "FIXED_AMOUNT", label: "Fixed Amount Off" },
  { value: "BOGO", label: "Buy X Get Y" },
  { value: "SPEND_GET", label: "Spend X Get Y Off" },
  // { value: "BUNDLE", label: "Buy Combo of Products to Get Discount" },
];

interface TypeSelectionComponentProps {
  dataId: number;
  selectedDiscountType: string;
  setSelectedDiscountType: (value: string) => void;
  selectedDiscountOn: string;
  setSelectedDiscountOn: (value: string) => void;
  setOpenFieldSheet: (value: boolean) => void;
}
export const TypeSelectionComponent: React.FC<TypeSelectionComponentProps> = ({
  selectedDiscountType,
  setSelectedDiscountType,
  selectedDiscountOn,
  setSelectedDiscountOn,
  setOpenFieldSheet,
}) => {
  const router = useRouter();
  let discountOnOptions: { value: string, label: string }[] = []


  // const discountOnOptions = [
  //   { value: "storeproduct", label: "Products" },
  //   { value: "brand", label: "Brands" },
  //   { value: "category", label: "Categories" },
  //   { value: "store", label: "Store" },
  // ];
  //
  switch (selectedDiscountType) {
    case "PERCENTAGE":
      discountOnOptions = [
        { value: "storeproduct", label: "Products" },
        { value: "brand", label: "Brands" },
        { value: "category", label: "Categories" },
        { value: "store", label: "Store" },
      ];
      break;
    case "FIXED_AMOUNT":
      discountOnOptions = [
        { value: "storeproduct", label: "Products" },
        { value: "brand", label: "Brands" },
        { value: "category", label: "Categories" },
        { value: "store", label: "Store" },
      ];
      break;
    case "BOGO":
      discountOnOptions = [
        { value: "storeproduct", label: "Products" },
        { value: "brand", label: "Brands" },
        { value: "category", label: "Categories" },
        { value: "store", label: "Store" },
      ];
      break;
    case "SPEND_GET":
      discountOnOptions = [
        { value: "brand", label: "Brands" },
        { value: "category", label: "Categories" },
        { value: "store", label: "Store" },
      ];
      break;
    default:
      discountOnOptions = [
        { value: "storeproduct", label: "Products" },
        { value: "brand", label: "Brands" },
        { value: "category", label: "Categories" },
        { value: "store", label: "Store" },
      ];
      break;

  }

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
        {/* Discount Type Select */}
        <div className="flex-1 min-w-[150px]">
          <Label className="mb-1 text-sm font-medium text-gray-700">
            Discount Type
          </Label>
          <Select
            value={selectedDiscountType}
            onValueChange={setSelectedDiscountType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Discount Type" />
            </SelectTrigger>
            <SelectContent>
              {discountTypeOptions.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Discount On Select */}
        <div className="flex-1 min-w-[150px]">
          <Label className="mb-1 text-sm font-medium text-gray-700">
            Discount On
          </Label>
          <Select
            value={selectedDiscountOn}
            onValueChange={setSelectedDiscountOn}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Discount on" />
            </SelectTrigger>
            <SelectContent>
              {discountOnOptions.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Products Button */}
        <div className="flex-shrink-0">
          <Button
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => setOpenFieldSheet(true)}
          >
            Add Products <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
