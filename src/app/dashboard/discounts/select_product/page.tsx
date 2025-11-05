"use client";
import ChildRouteHeader from "@/components/ChildRouteHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProducts } from "@/redux/features/product/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Package } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import DiscountProductManager from "./Components/DiscountProductManager";
import { getDiscountProductList } from "@/redux/features/discount/discount";

const AddProducts = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const dispatch = useAppDispatch();
  const { storeDetailData } = useAppSelector((s) => s.store);

  useEffect(() => {
    if (storeDetailData) {
      dispatch(getProducts(storeDetailData?.id));
      //get the already added discount list
      dispatch(getDiscountProductList({ d_id: parseInt(id ?? "0", 10), s_id: storeDetailData?.id }));
    }
  }, [storeDetailData, id]);

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <ChildRouteHeader
        title="Choose Discounted Products or Brands"
        subtitle="Select the products or brands offering current discounts."
        backLink="/dashboard/discounts"
        backText="Back to discounts"
        titleIcon={<Package className="h-5 w-5 text-primary" />}
      />
      <Separator className="my-6" />

      <Card className=" border-0 p-0  bg-card/50 rounded-none">
        <CardContent className="p-0">
          <DiscountProductManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProducts;
