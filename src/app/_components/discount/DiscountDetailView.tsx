import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  deleteDiscount,
  updateDiscount,
} from "@/redux/features/discount/discount";
import { PreviewDiscountDetailResponse } from "@/redux/features/discount/types";
import { getProducts } from "@/redux/features/product/product";
import { DiscountType, TargetType } from "@/redux/features/product/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Calendar, Edit, Power, PowerOff, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DiscountDetailCard } from "./DiscountDetailCard";
import { DiscountDetailHeader } from "./DiscountDetailHeader";
import DiscountFieldsSheet from "./DiscountFieldsSheet";
import { DiscountProductsList } from "./DiscountProductsList";
import { TypeSelectionComponent } from "./TypeSelectionComponent";

interface DiscountDetailViewProps {
  data: PreviewDiscountDetailResponse;
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
