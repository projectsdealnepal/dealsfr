"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { OfferAppliedProduct } from "@/redux/features/discount/types";
import { useAppSelector } from "@/redux/hooks";
import {
  DollarSign,
  Gift,
  Package,
  Percent,
  Store,
  TableProperties,
  Tag,
} from "lucide-react";

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

const formatDiscountValue = (item: OfferAppliedProduct) => {
  if (item.discount_type === "PERCENTAGE") {
    return `${item.value}% off`;
  }
  return `$${item.value} off`;
};

const DiscountAppliedProductListDialog = ({
  open,
  onOpenChange,
}: AddedProductsDialogProp) => {
  const { offerAppliedProductsList } = useAppSelector((p) => p.product);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <TableProperties className="h-4 w-4" />
          Product List
          {offerAppliedProductsList.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {offerAppliedProductsList.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Header */}
        <div className="px-6 py-5 border-b">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Discount Coverage
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {offerAppliedProductsList.length} active discount
            {offerAppliedProductsList.length !== 1 ? "s" : ""}
          </DialogDescription>
        </div>

        {/* Content */}
        <div className="max-h-[65vh] overflow-y-auto">
          {offerAppliedProductsList.length > 0 ? (
            <div className="divide-y">
              {offerAppliedProductsList.map((item) => {
                const isProduct = !!item.store_product;
                const isBrand = !!item.brand;

                return (
                  <div
                    key={item.id}
                    className="px-6 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex gap-4">
                      {/* Left Visual */}
                      <div className="h-16 w-16 rounded-lg border bg-muted/30 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {isProduct && item.store_product?.image ? (
                          <img
                            src={item.store_product.image}
                            alt={item.store_product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : isBrand ? (
                          <Tag className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground/50" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-medium text-sm truncate">
                              {isProduct
                                ? item.store_product!.name
                                : item.brand!.name}
                            </h3>

                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              {isProduct ? (
                                <>
                                  <Store className="h-3 w-3" />
                                  {item.store_product!.store_name}
                                </>
                              ) : (
                                "Brand-wide discount"
                              )}
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className="gap-1 text-xs font-normal"
                          >
                            {getDiscountIcon(item.value_type)}
                            {formatDiscountValue(item)}
                          </Badge>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {isProduct && (
                            <span className="text-sm font-medium">
                              ${item.store_product!.price}
                            </span>
                          )}

                          {item.buy_quantity > 1 && (
                            <>
                              <Separator
                                orientation="vertical"
                                className="h-3"
                              />
                              <span className="text-xs text-muted-foreground">
                                Min qty: {item.buy_quantity}
                              </span>
                            </>
                          )}

                          {item.min_spend_amount && (
                            <>
                              <Separator
                                orientation="vertical"
                                className="h-3"
                              />
                              <span className="text-xs text-muted-foreground">
                                Min spend: ${item.min_spend_amount}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Rewards */}
                        {item.reward_products.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <Gift className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              +{item.reward_products.length} reward product
                              {item.reward_products.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                No active discounts found
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountAppliedProductListDialog;
