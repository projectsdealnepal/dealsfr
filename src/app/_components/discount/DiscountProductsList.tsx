import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProductOnDiscount } from "@/redux/features/discount/discount";
import { OfferAppliedProduct } from "@/redux/features/discount/types";
import { useAppDispatch } from "@/redux/hooks";
import { Pencil, Trash2 } from "lucide-react";

interface DiscountProductsListProps {
  products: OfferAppliedProduct[];
  storeId: number;
}

export const DiscountProductsList = ({
  products,
  storeId,
}: DiscountProductsListProps) => {
  const dispatch = useAppDispatch();
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-dashed">
        <p className="text-muted-foreground">
          No products added to this discount yet.
        </p>
      </div>
    );
  }

  const handleDeleteProductOnDiscount = (id: number) => {
    dispatch(deleteProductOnDiscount({ s_id: storeId, d_id: id, pd_id: id }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Discounted Products ({products.length})
      </h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              {/* <TableHead>Category</TableHead> */}
              <TableHead>Discount Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Spend</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.store_product ? (
                    <>
                      <div
                        className="font-medium max-w-[200px] truncate"
                        title={item.store_product.name}
                      >
                        {item.store_product.name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                        {item.store_product.description}
                      </div>
                    </>
                  ) : item.brand ? (
                    <div
                      className="font-medium max-w-[200px] truncate"
                      title={item.brand.name}
                    >
                      Brand: {item.brand.name}
                    </div>
                  ) : item.category ? (
                    <div
                      className="font-medium max-w-[200px] truncate"
                      title={item.category.name}
                    >
                      Category: {item.category.name}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                {/* <TableCell>{item.category?.name || "N/A"}</TableCell> */}
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.discount_type.replace("_", " ").toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.value_type === "PERCENTAGE"
                    ? `${item.value}%`
                    : `NPR ${item.value}`}
                </TableCell>
                <TableCell>
                  {item.min_spend_amount ? `NPR ${item.min_spend_amount}` : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteProductOnDiscount(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
