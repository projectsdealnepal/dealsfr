import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiscountType } from "@/redux/features/product/types";

interface DiscountedProductFilterProps {
  currentFilter: DiscountType | "ALL";
  onFilterChange: (value: DiscountType | "ALL") => void;
}

export const DiscountedProductFilter = ({
  currentFilter,
  onFilterChange,
}: DiscountedProductFilterProps) => {
  const discountTypes: (DiscountType | "ALL")[] = [
    "ALL",
    "PERCENTAGE",
    "FIXED_AMOUNT",
    "BOGO",
    "SPEND_GET",
    "BUNDLE",
  ];

  return (
    <Tabs
      value={currentFilter}
      onValueChange={(value) => onFilterChange(value as DiscountType | "ALL")}
      className="w-full"
    >
      <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
        {discountTypes.map((type) => (
          <TabsTrigger
            key={type}
            value={type}
            className=" border border-muted bg-background px-4 py-1 capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {type === "ALL"
              ? "All Products"
              : type.replace("_", " ").toLowerCase()}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
