import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addProductOnDiscount } from "@/redux/features/discount/discount"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { TableProperties, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface AddedProductsDialogProp {
  open: boolean;
  onOpenChange: () => void;
}

const DiscountAppliedProductListDialog = ({ open, onOpenChange }: AddedProductsDialogProp) => {
  const dispatch = useAppDispatch()
  const param = useSearchParams()
  const id = param.get("id")
  const { storeDetailData } = useAppSelector((s) => s.store);
  const { discountAppliedProductList, offerAppliedProductsList } = useAppSelector((s) => s.product);

  const handleRemoveSelectedItem = () => {
    console.log("tried to delete::")
  }

  const handleAddToTempProductList = () => {
    if (id && storeDetailData) {
      const payload = {
        d_id: parseInt(id, 10),
        s_id: storeDetailData.id,
        payload: discountAppliedProductList,
      }
      dispatch(addProductOnDiscount(payload))
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <TableProperties className="h-4 w-4" />
          Product List {offerAppliedProductsList.length}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold">
              Discount Applied Products
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              List of product where offer is applied and live.
            </DialogDescription>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
          {offerAppliedProductsList.map((product, index) => (
            <Card
              key={index.toString()}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium">{product.store_product.name}</h3>
                  <h3 className="font-medium">{product.store_product.price}</h3>
                  <p className="text-sm text-muted-foreground">
                    Price: ${product.value}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {offerAppliedProductsList.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No products selected yet
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default DiscountAppliedProductListDialog;
