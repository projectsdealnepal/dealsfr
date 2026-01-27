import { useState, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import {
  GenericProductItem,
  ProductItem
} from "@/redux/features/product/types";

interface ComboProductsListProps {
  products: ProductItem[];
  onEdit: (product: ProductItem | GenericProductItem) => void;
}

const ComboProductsList: React.FC<ComboProductsListProps> = ({
  products,
  onEdit,
}) => {
  const [openComboId, setOpenComboId] = useState<number | null>(null);


  const toggleCombo = (id: number) => {
    setOpenComboId((prev) => (prev === id ? null : id));
  };

  const formatPrice = (price: string) =>
    `NPR ${parseFloat(price).toFixed(2)}`;

  return (
    <div className="border rounded-none overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category / Items</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Store</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                No products found
              </TableCell>
            </TableRow>
          )}

          {products.map((product, id) => (
            <Fragment key={id.toString()}>
              <TableRow className="hover:bg-muted/50">
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                </TableCell>

                <TableCell>
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.description}
                  </p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    COMBO
                  </span>
                </TableCell>

                <TableCell>
                  {product.combo_items.length} items
                </TableCell>

                <TableCell>{formatPrice(product.price)}</TableCell>

                <TableCell>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${product.is_available
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {product.is_available ? "Available" : "Unavailable"}
                  </span>
                </TableCell>

                <TableCell>{product.store}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => toggleCombo(product.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {openComboId === product.id
                        ? "Hide items"
                        : "View items"}
                    </button>

                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 rounded-md text-blue-600 hover:bg-blue-50"
                      title="Edit product"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>

              {/* ===== Combo Items ===== */}
              {openComboId === product.id && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-muted/30">
                    <div className="rounded-md border bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {product.combo_items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <img
                                  src={item.image}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {item.name}
                              </TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.brand}</TableCell>
                              <TableCell>× {item.quantity}</TableCell>
                              <TableCell>
                                {formatPrice(item.price)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComboProductsList;
