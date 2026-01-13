import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  clearRowSelection,
  clearSelectedProductList,
  setRewardProductList,
  setRowSelection,
  setSelectedProductList,
  setTempProductList,
} from "@/redux/features/product/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Package, ShoppingCart, TableProperties, Trash2 } from "lucide-react";

interface AddedProductsDialogProp {
  mode: "default" | "reward";
  open: boolean;
  onOpenChange: () => void;
  closeProdctListDialog: () => void;
}

const AddedProductsDialog = ({
  mode = "default",
  open,
  onOpenChange,
  closeProdctListDialog,
}: AddedProductsDialogProp) => {
  const dispatch = useAppDispatch();
  const { selectedProductList: addedDisountProducts } = useAppSelector(
    (s) => s.product
  );

  const handleRemoveSelectedItem = (id: number) => {
    //filter the removed product and modify the redux state
    const modifiedSelected: Record<string, boolean> = {};
    const modifiedArr = addedDisountProducts.filter((item) => item.id != id);
    modifiedArr.forEach(
      (item) => (modifiedSelected[item.id.toString()] = true)
    );

    dispatch(setRowSelection(modifiedSelected));
    dispatch(setSelectedProductList(modifiedArr));
  };

  const handleAddToTempProductList = () => {
    if (mode == "default") {
      dispatch(setTempProductList());
    }
    if (mode == "reward") {
      dispatch(setRewardProductList());
    }
    onOpenChange();
    closeProdctListDialog();
    dispatch(clearSelectedProductList());
    dispatch(clearRowSelection());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <TableProperties className="h-4 w-4" />
          Selected Items
          {addedDisountProducts.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 min-w-[1.25rem] px-1 pointer-events-none"
            >
              {addedDisountProducts.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl flex flex-col max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Selected Products</DialogTitle>
              <DialogDescription>
                Review items to be added to the discount campaign.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className=" overflow-scroll overflow-x-hidden px-6">
          {addedDisountProducts.length > 0 ? (
            addedDisountProducts.map((product, index) => (
              <div key={product.id}>
                {index > 0 && <Separator className="my-2" />}
                <div className="flex items-center justify-between gap-4 min-w-0 group py-2 rounded-lg hover:bg-muted/50 transition-colors px-2 -mx-2">
                  <div className="flex items-center gap-4 overflow-hidden min-w-0">
                    <Avatar className="h-12 w-12 rounded-lg border bg-muted shrink-0">
                      <AvatarImage
                        src={product.image}
                        alt={product.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        NPR {product.price}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveSelectedItem(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <Package className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">No products selected</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Please select products from the list to add them to this
                  discount.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {addedDisountProducts.length} items selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onOpenChange}>
                Cancel
              </Button>
              <Button
                onClick={handleAddToTempProductList}
                disabled={addedDisountProducts.length === 0}
              >
                Add to Discount
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddedProductsDialog;
