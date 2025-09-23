"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/redux/features/category/category";
import { getProducts } from "@/redux/features/product/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Package, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { object } from "zod";
import { setProductOnDiscount, setRowSelection } from "@/redux/features/product/productSlice";
import { updateDiscount } from "@/redux/features/discount/discount";
import { useSearchParams } from "next/navigation";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Select Products
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Choose products to apply discounts and create special offers
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">
                    Products Selection
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Select products to add to your discount campaign
                  </CardDescription>
                </div>
              </div>


              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Selected Items ({addedDisountProducts.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl p-0">
                  {/* Sticky Header */}
                  <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-lg font-semibold">
                        Selected Products
                      </DialogTitle>
                      <DialogDescription className="text-sm text-muted-foreground">
                        Products that will be included in the discount campaign
                      </DialogDescription>
                    </div>
                    <Button size="sm" variant="default" onClick={handleAddProductToDiscount}>
                      Add to discount.
                    </Button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
                    {addedDisountProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Price: ${product.price}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveSelectedItem(product?.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </Card>
                    ))}

                    {addedDisountProducts.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No products selected yet
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

            </div>
            <Separator />
          </CardHeader>

          <CardContent>
            {productList && <DataTable columns={columns} data={productList} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProducts;
