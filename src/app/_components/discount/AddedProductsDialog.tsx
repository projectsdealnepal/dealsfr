import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { updateDiscount } from "@/redux/features/discount/discount"
import { setSelectedProductList, setRowSelection, setTempProductList, clearSelectedProductList, clearRowSelection, setRewardProductList } from "@/redux/features/product/productSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { TableProperties, Trash2 } from "lucide-react"

interface AddedProductsDialogProp {
  mode: "default" | "reward"
  open: boolean;
  onOpenChange: () => void;
  closeProdctListDialog: () => void;
}

const AddedProductsDialog = ({ mode = "default", open, onOpenChange, closeProdctListDialog }: AddedProductsDialogProp) => {
  const dispatch = useAppDispatch()
  const { storeDetailData } = useAppSelector((s) => s.store);
  const { selectedProductList: addedDisountProducts } = useAppSelector((s) => s.product);


  const handleRemoveSelectedItem = (id: number) => {
    //filter the removed product and modify the redux state
    const modifiedSelected: Record<string, boolean> = {}
    const modifiedArr = addedDisountProducts.filter(item => item.id != id)
    modifiedArr.forEach((item) => modifiedSelected[item.id.toString()] = true)

    dispatch(setRowSelection(modifiedSelected))
    dispatch(setSelectedProductList(modifiedArr))
  }

  const handleAddToTempProductList = () => {
    // const payload = {
    //   product_ids: addedDisountProducts.map(i => i.id)
    // }
    // dispatch(updateDiscount({
    //   payload,
    //   s_id: storeDetailData?.id || 0,
    //   d_id: id ? Number(id) : 0
    // }))
    if (mode == 'default') {
      dispatch(setTempProductList())
    }
    if (mode == "reward") {
      dispatch(setRewardProductList())
    }
    onOpenChange()
    closeProdctListDialog()
    dispatch(clearSelectedProductList())
    dispatch(clearRowSelection())
  }
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <TableProperties className="h-4 w-4" />
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
          <Button size="sm" variant="default" onClick={handleAddToTempProductList}>
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
  )
}
export default AddedProductsDialog;
