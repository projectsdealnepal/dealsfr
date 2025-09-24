"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/redux/features/category/category";
import { getProducts } from "@/redux/features/product/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Package, ShoppingCart, Tag, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { object } from "zod";
import { setProductOnDiscount, setRowSelection } from "@/redux/features/product/productSlice";
import { updateDiscount } from "@/redux/features/discount/discount";
import { useSearchParams } from "next/navigation";
import ChildRouteHeader from "@/components/ChildRouteHeader";

const AddProducts = () => {
  const params = useSearchParams()
  const id = params.get("id")
  const dispatch = useAppDispatch();
  const { productList } = useAppSelector((s) => s.product);
  const { storeDetailData } = useAppSelector((s) => s.store);
  const { addedDisountProducts, rowSelection } = useAppSelector((s) => s.product);

  useEffect(() => {
    if (storeDetailData) {
      dispatch(getProducts(storeDetailData?.id));
      dispatch(getCategories());
    }
  }, [storeDetailData]);

  const handleRemoveSelectedItem = (id: number) => {
    //filter the removed product and modify the redux state
    let modifiedSelected: Record<string, boolean> = {}
    const modifiedArr = addedDisountProducts.filter(item => item.id != id)
    modifiedArr.forEach((item) => modifiedSelected[item.id.toString()] = true)

    dispatch(setRowSelection(modifiedSelected))
    dispatch(setProductOnDiscount(modifiedArr))
  }

  const handleAddProductToDiscount = () => {
    const payload = {
      product_ids: addedDisountProducts.map(i => i.id)
    }
    dispatch(updateDiscount({
      payload,
      s_id: storeDetailData?.id || 0,
      d_id: id ? Number(id) : 0
    }))
  }

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
