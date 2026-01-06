import { OfferAppliedProduct } from "@/redux/features/discount/types";
import React from "react";
import DealsCard from "./DealsCard";

interface DealsLayoutProps {
  products: OfferAppliedProduct[];
  layout: number[];
}

const DealsLayout: React.FC<DealsLayoutProps> = ({
  products,
  layout = [1, 2, 3, 4, 5],
}) => {
  if (!products?.length || !layout?.length) return null;

  const rows = [];
  let startIndex = 0;
  let layoutIndex = 0;

  while (startIndex < products.length) {
    const cols = layout[layoutIndex % layout.length];
    const rowItems = products.slice(startIndex, startIndex + cols);

    rows.push(rowItems);

    startIndex += cols;
    layoutIndex++;
  }

  return (
    <div className="space-y-4">
      {rows.map((rowItems, rowIndex) => (
        <div
          key={rowIndex}
          className="md:grid gap-4 flex flex-col"
          style={{
            gridTemplateColumns: `repeat(${rowItems.length}, minmax(0, 1fr))`,
          }}
        >
          {rowItems.map((item) => (
            <DealsCard key={item.id} product={item} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default DealsLayout;
