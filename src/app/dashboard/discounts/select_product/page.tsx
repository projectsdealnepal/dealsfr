"use client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/redux/features/category/category";
import { getProducts } from "@/redux/features/product/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Package } from "lucide-react";
import { useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useSearchParams } from "next/navigation";
import ChildRouteHeader from "@/components/ChildRouteHeader";

const AddProducts = () => {
  const params = useSearchParams()
  const id = params.get("id")
  const dispatch = useAppDispatch();
  const { productList } = useAppSelector((s) => s.product);
  const { storeDetailData } = useAppSelector((s) => s.store);

  useEffect(() => {
    if (storeDetailData) {
      dispatch(getProducts(storeDetailData?.id));
      dispatch(getCategories());
    }
  }, [storeDetailData]);



  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <ChildRouteHeader
        title='Select Products'
        subtitle={"Choose products to apply discounts and create special offers"}
        backLink='/dashboard/discounts'
        backText='Back to discounts'
        titleIcon={<Package className="h-5 w-5 text-primary" />}
      />

      <Separator className="my-6" />

      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">

        <CardContent>
          {productList && <DataTable columns={columns} data={productList} id={id} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProducts;
