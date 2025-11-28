// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { useAppSelector } from "@/redux/hooks"
// import { TableProperties } from "lucide-react"
//
// interface AddedProductsDialogProp {
//   open: boolean;
//   onOpenChange: () => void;
// }
//
// const DiscountAppliedProductListDialog = ({ open, onOpenChange }: AddedProductsDialogProp) => {
//   const { offerAppliedProductsList } = useAppSelector((s) => s.product);
//
//
//   return (
//     <Dialog
//       open={open}
//       onOpenChange={onOpenChange}
//     >
//       <DialogTrigger asChild>
//         <Button variant="outline" className="gap-2">
//           <TableProperties className="h-4 w-4" />
//           Product List {offerAppliedProductsList.length}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl p-0">
//         {/* Sticky Header */}
//         <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
//           <div>
//             <DialogTitle className="text-lg font-semibold">
//               Discount Applied Products
//             </DialogTitle>
//             <DialogDescription className="text-sm text-muted-foreground">
//               List of product where offer is applied and live.
//             </DialogDescription>
//           </div>
//         </div>
//
//         {/* Scrollable Content */}
//         <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
//           {offerAppliedProductsList.map((product, index) => (
//             <Card
//               key={index.toString()}
//               className="p-4 flex items-center justify-between"
//             >
//               <div className="flex items-center gap-4">
//                 <div>
//                   <h3 className="font-medium">{product.store_product.name}</h3>
//                   <h3 className="font-medium">{product.store_product.price}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Price: ${product.value}
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           ))}
//
//           {offerAppliedProductsList.length === 0 && (
//             <p className="text-center text-muted-foreground py-8">
//               No products selected yet
//             </p>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
// export default DiscountAppliedProductListDialog;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TableProperties, Package, Percent, DollarSign, Gift } from "lucide-react";
import { OfferAppliedProducts } from "@/redux/features/discount/types";
import { useAppSelector } from "@/redux/hooks";


interface AddedProductsDialogProp {
  open: boolean;
  onOpenChange: () => void;
}

const getDiscountIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "percentage":
      return <Percent className="h-3 w-3" />;
    case "fixed":
      return <DollarSign className="h-3 w-3" />;
    case "bogo":
    case "buy_get":
      return <Gift className="h-3 w-3" />;
    default:
      return <Percent className="h-3 w-3" />;
  }
};

const formatDiscountValue = (product: OfferAppliedProducts) => {
  if (product.value_type === "percentage") {
    return `${product.value}% off`;
  }
  return `$${product.value} off`;
};

const DiscountAppliedProductListDialog = ({
  open,
  onOpenChange,
}: AddedProductsDialogProp) => {
  const { offerAppliedProductsList } = useAppSelector(p => p.product)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <TableProperties className="h-4 w-4" />
          Product List
          {offerAppliedProductsList?.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {offerAppliedProductsList?.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Header */}
        <div className="px-6 py-5 border-b">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Discount Applied Products
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {offerAppliedProductsList.length} product
            {offerAppliedProductsList.length !== 1 ? "s" : ""} with active offers
          </DialogDescription>
        </div>

        {/* Content */}
        <div className="max-h-[65vh] overflow-y-auto">
          {offerAppliedProductsList.length > 0 ? (
            <div className="divide-y">
              {offerAppliedProductsList.map((product) => (
                <div
                  key={product.id}
                  className="px-6 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="h-16 w-16 rounded-lg border bg-muted/30 flex-shrink-0 overflow-hidden">
                      {product.store_product.image ? (
                        <img
                          src={product.store_product.image}
                          alt={product.store_product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm leading-tight truncate">
                            {product.store_product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {product.store_product.store_name}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="flex-shrink-0 gap-1 text-xs font-normal"
                        >
                          {getDiscountIcon(product.value_type)}
                          {formatDiscountValue(product)}
                        </Badge>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-medium">
                          ${product.store_product.price}
                        </span>
                        {product.buy_quantity > 1 && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="text-xs text-muted-foreground">
                              Min qty: {product.buy_quantity}
                            </span>
                          </>
                        )}
                        {product.min_spend_amount && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="text-xs text-muted-foreground">
                              Min spend: ${product.min_spend_amount}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Reward Products */}
                      {product.reward_products.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <Gift className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            +{product.reward_products.length} reward product
                            {product.reward_products.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                No products with active discounts
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountAppliedProductListDialog;
