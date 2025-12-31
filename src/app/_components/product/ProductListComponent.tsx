import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GenericProductItem, ProductItem } from "@/redux/features/product/types";
import { useAppSelector } from "@/redux/hooks";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface ProductListTableProps {
  products: ProductItem[] | GenericProductItem[];
  onView: (product: ProductItem | GenericProductItem) => void;
  onEdit: (product: ProductItem | GenericProductItem) => void;
  onDelete: (product: ProductItem | GenericProductItem) => void;
}

const ProductListTable: React.FC<ProductListTableProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
}) => {
  const { storeDetailData } = useAppSelector(s => s.store)
  // Type guard to check if product is ProductItem
  const isProductItem = (product: ProductItem | GenericProductItem): product is ProductItem => {
    return 'image' in product && typeof (product as ProductItem).image === 'string';
  };

  // Get image URL based on product type
  const getImageUrl = (product: ProductItem | GenericProductItem): string => {
    if (isProductItem(product)) {
      return product.image;
    } else {
      // GenericProductItem has images array
      return product.images && product.images.length > 0 && typeof product.images[0] != 'string'
        ? product.images[0].image
        : '/placeholder-image.png'; // fallback image
    }
  };

  // Get store name/id based on product type
  const getStore = (product: ProductItem | GenericProductItem): string => {
    if (isProductItem(product)) {
      return product.store;
    } else {
      // GenericProductItem has store_id (optional)
      return storeDetailData ? storeDetailData.name : 'N/A';
    }
  };

  // Get price based on product type
  const getPrice = (product: ProductItem | GenericProductItem): string | null => {
    if (isProductItem(product)) {
      return product.price;
    } else {
      // GenericProductItem has optional price
      return null;
    }
  };

  // Get availability status
  const getAvailability = (product: ProductItem | GenericProductItem): boolean => {
    if (isProductItem(product)) {
      return product.is_available;
    } else {
      // GenericProductItem has optional is_available
      return false;
    }
  };

  const formatPrice = (price: string) => `NPR. ${parseFloat(price).toFixed(2)}`;

  const getFinalPrice = (product: ProductItem) => {
    const basePrice = parseFloat(product.price);
    if (product.active_discount) {
      const discount = parseInt(product.active_discount.value);
      return (basePrice - (basePrice * discount) / 100).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  return (
    <div className="rounded-none border border-gray-200 overflow-hidden">
      <Table >
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Store</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody >
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const imageUrl = getImageUrl(product);
              const store = getStore(product);
              const price = getPrice(product);
              const isAvailable = getAvailability(product);

              return (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.description}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.brand.name}</TableCell>

                  <TableCell>
                    {price ? (
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatPrice(price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </TableCell>

                  <TableCell>{store}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onView(product)}
                        className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
                        title="View product"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDelete(product)}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductListTable;
