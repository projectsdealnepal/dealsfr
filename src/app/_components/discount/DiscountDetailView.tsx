import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscountDetailResponse } from "@/redux/features/discount/types";
import { getProducts } from "@/redux/features/product/product";
import { DiscountType, TargetType } from "@/redux/features/product/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DiscountDetailCard } from "./DiscountDetailCard";
import { DiscountDetailHeader } from "./DiscountDetailHeader";
import DiscountFieldsSheet from "./DiscountFieldsSheet";
import { DiscountProductsList } from "./DiscountProductsList";
import { TypeSelectionComponent } from "./TypeSelectionComponent";

interface DiscountDetailViewProps {
  data: DiscountDetailResponse;
  storeId: number;
}

export const DiscountDetailView = ({
  data,
  storeId,
}: DiscountDetailViewProps) => {
  const dispatch = useAppDispatch();

  const [selectedDiscountType, setSelectedDiscountType] =
    useState("PERCENTAGE");
  const [selectedDiscountOn, setSelectedDiscountOn] = useState("storeproduct");
  const [openFieldSheet, setOpenFieldSheet] = useState(false);

  useEffect(() => {
    dispatch(getProducts(storeId));
  }, [storeId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <DiscountDetailHeader data={data} storeId={storeId} />

      {/* Info Card */}
      <div>
        <DiscountDetailCard data={data} />
      </div>

      {/* type select and add button component */}
      <div>
        <TypeSelectionComponent
          selectedDiscountType={selectedDiscountType}
          setSelectedDiscountType={setSelectedDiscountType}
          selectedDiscountOn={selectedDiscountOn}
          setSelectedDiscountOn={setSelectedDiscountOn}
          setOpenFieldSheet={setOpenFieldSheet}
          dataId={data.id}
        />
      </div>
      {/* Products Section */}
      <Card>
        <CardContent>
          <DiscountProductsList
            products={data.discount_products}
            storeId={storeId}
            discountId={data.id}
          />
        </CardContent>
      </Card>
      <DiscountFieldsSheet
        discountType={selectedDiscountType as DiscountType}
        targetType={selectedDiscountOn as TargetType}
        open={openFieldSheet}
        onClose={() => setOpenFieldSheet(false)}
      />
    </div>
  );
};
