import Image from "next/image";
import React from "react";
import { RewardBadge } from "./RewardBadge";
import { capitalizeName } from "./utils";
import { PreviewDiscountedProduct } from "@/redux/features/discount/types";

interface DealsCardProps {
  product: PreviewDiscountedProduct;
}

const DealsCard: React.FC<DealsCardProps> = ({ product }) => {

  const discountType = product.discount_type?.toLowerCase();
  const value = Math.round(Number(product.value));
  const minSpend = Math.round(Number(product.min_spend_amount));
  const valueType = product.value_type?.toLowerCase();

  return (
    <>
      {product.store_product ? (
        <div
          className="relative shadow-sm rounded-3xl bg-card cursor-pointer"
        >
          <div className="relative rounded-t-3xl overflow-hidden">
            <Image
              src={product.store_product.image}
              alt="product image"
              className="w-full h-44 object-cover"
              height={999}
              width={999}
            />

            <div className="absolute top-2 left-3 bg-primary text-white font-semibold text-[10px] py-1 px-2 rounded-full w-fit">
              {discountType === "bogo" && (
                <p>
                  Buy {product.buy_quantity},{" "}
                  {valueType === "fixed_amount"
                    ? `Get Rs. ${value} OFF`
                    : `Get ${value}% OFF`}
                </p>
              )}

              {discountType === "percentage" && <p>{value}% OFF</p>}

              {discountType === "fixed_amount" && <p>Rs. {value} OFF</p>}

              {discountType === "spend_get" && (
                <p>
                  Spend Rs. {minSpend}, Get{" "}
                  {valueType === "percentage"
                    ? `${value}% OFF`
                    : `Rs. ${value} OFF`}
                </p>
              )}

              {discountType === "bundle" && <p>Bundle Offer Available</p>}
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="w-full flex items-center gap-2">
              <div className="w-[60%]">
                <p className="line-clamp-1 font-bold text-lg">
                  {product.store_product.name}
                </p>
                {product?.brand?.name ? (
                  <p className="line-clamp-1 text-sm opacity-70">
                    {capitalizeName(product?.brand?.name)}
                  </p>
                ) : (
                  <p className="text-sm opacity-70">No Brand</p>
                )}
              </div>
              <div className="w-[40%] flex flex-col items-end">
                <p className="text-sm opacity-70 line-through">Rs. 450</p>
                <p className="text-lg font-extrabold text-primary">
                  Rs. {product.store_product.price}
                </p>
              </div>
            </div>
            {product.reward_products &&
              product.reward_products.length > 0 && (
                <RewardBadge rewards={product.reward_products} />
              )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-md shadow-gray-400">
          <h1 className="h-44 bg-green-100 text-green-600 font-bold text-3xl flex items-center justify-center">
            This is Brand
          </h1>

          <div className="space-y-2 p-4">
            <h2 className="font-semibold text-sm line-clamp-2">
              {product.brand?.name}
            </h2>

            <p className="text-sm font-bold bg-red-100 text-red-600 w-fit py-1 px-2 rounded-full">
              {valueType === "percentage"
                ? `${value}% OFF`
                : valueType === "fixed_amount"
                  ? `Rs. ${value} OFF`
                  : ""}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default DealsCard;
