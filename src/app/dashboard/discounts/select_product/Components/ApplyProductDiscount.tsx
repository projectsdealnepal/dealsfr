import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/redux/hooks";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { columns } from "./columns";
import { toast } from "sonner";
import TargetSelector from "./Select-Target";

// Types
type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "BOGO" | "SPEND_GET";
type TargetType = "PRODUCT" | "BRAND";

interface BaseDiscountItem {
  id: string;
  discountType: DiscountType;
  targetType: TargetType;
}

interface PercentageDiscount extends BaseDiscountItem {
  discountType: "PERCENTAGE";
  target: number;
  percentageValue: number;
}

interface FixedAmountDiscount extends BaseDiscountItem {
  discountType: "FIXED_AMOUNT";
  target: number;
  amountValue: number;
}

interface BOGODiscount extends BaseDiscountItem {
  discountType: "BOGO";
  target: number;
  buyQuantity: number;
  getQuantity: number;
  discountValue: number;
  rewardItems?: string;
}

interface SpendGetDiscount extends BaseDiscountItem {
  discountType: "SPEND_GET";
  target: number;
  spendAmount: number;
  getQuantity: number;
  discountValue: number;
  rewardItems?: string;
}

type DiscountItem =
  | PercentageDiscount
  | FixedAmountDiscount
  | BOGODiscount
  | SpendGetDiscount;

// Validation schemas
const percentageSchema = z.object({
  percentageValue: z.number().min(0).max(100),
});

const fixedAmountSchema = z.object({
  amountValue: z.number().min(0),
});

const bogoSchema = z.object({
  buyQuantity: z.number().int().min(1),
  getQuantity: z.number().int().min(1),
  discountValue: z.number().min(0).max(100),
  rewardItems: z.string().optional(),
});

const spendGetSchema = z.object({
  spendAmount: z.number().min(0),
  getQuantity: z.number().int().min(1),
  discountValue: z.number().min(0).max(100),
  rewardItems: z.string().optional(),
});

const DiscountManager: React.FC = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const [discountItems, setDiscountItems] = useState<DiscountItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<DiscountItem>>({
    discountType: "PERCENTAGE",
    targetType: "PRODUCT",
  });
  const { productList, tempDiscountProductList } = useAppSelector(
    (s) => s.product
  );
  const [selectedTargetType, setSelectedTargetType] =
    useState<TargetType>("PRODUCT");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const discountTypeOptions = [
    { value: "PERCENTAGE", label: "Percentage Off" },
    { value: "FIXED_AMOUNT", label: "Fixed Amount Off" },
    { value: "BOGO", label: "Buy X Get Y" },
    { value: "SPEND_GET", label: "Spend X Get Y Off" },
  ];

  const targetTypeOptions = [
    { value: "PRODUCT", label: "Product" },
    { value: "BRAND", label: "Brand" },
  ];

  const validateCurrentItem = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentItem.discountType) {
      newErrors.discountType = "Discount type is required";
      setErrors(newErrors);
      return false;
    }

    if (!currentItem.targetType) {
      newErrors.targetType = "Application scope is required";
      setErrors(newErrors);
      return false;
    }

    //check if there are any product selected or not 
    if (tempDiscountProductList.length === 0) {
      toast.info("At least one product is required", { richColors: true })
      return false;
    }

    try {
      switch (currentItem.discountType) {
        case "PERCENTAGE":
          percentageSchema.parse({
            percentageValue: (currentItem as PercentageDiscount)
              .percentageValue,
          });
          break;
        case "FIXED_AMOUNT":
          fixedAmountSchema.parse({
            amountValue: (currentItem as FixedAmountDiscount).amountValue,
          });
          break;
        case "BOGO":
          bogoSchema.parse({
            buyQuantity: (currentItem as BOGODiscount).buyQuantity,
            getQuantity: (currentItem as BOGODiscount).getQuantity,
            discountValue: (currentItem as BOGODiscount).discountValue,
            rewardItems: (currentItem as BOGODiscount).rewardItems,
          });
          break;
        case "SPEND_GET":
          spendGetSchema.parse({
            spendAmount: (currentItem as SpendGetDiscount).spendAmount,
            getQuantity: (currentItem as SpendGetDiscount).getQuantity,
            discountValue: (currentItem as SpendGetDiscount).discountValue,
            rewardItems: (currentItem as SpendGetDiscount).rewardItems,
          });
          break;
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const addDiscountItem = () => {
    if (validateCurrentItem()) {
      const newItem: DiscountItem = {
        ...currentItem,
        id: Date.now().toString(),
      } as DiscountItem;

      setDiscountItems([...discountItems, newItem]);
      setCurrentItem({
        discountType: "PERCENTAGE",
        targetType: "PRODUCT",
      });
      setErrors({});
    }
  };

  const removeDiscountItem = (id: string) => {
    setDiscountItems(discountItems.filter((item) => item.id !== id));
  };

  const handleDiscountTypeChange = (value: DiscountType) => {
    setCurrentItem({
      discountType: value,
      targetType: currentItem.targetType || "PRODUCT",
    });
    setErrors({});
  };

  const renderDiscountFields = () => {
    switch (currentItem.discountType) {
      case "PERCENTAGE":
        return (
          <div className="space-y-2">
            <Label htmlFor="percentageValue">Percentage Value (%)</Label>
            <Input
              id="percentageValue"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g., 25"
              value={(currentItem as PercentageDiscount).percentageValue || ""}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  percentageValue: parseFloat(e.target.value) || 0,
                })
              }
            />
            {errors.percentageValue && (
              <p className="text-sm text-red-500">{errors.percentageValue}</p>
            )}
          </div>
        );

      case "FIXED_AMOUNT":
        return (
          <div className="space-y-2">
            <Label htmlFor="amountValue">Discount Amount</Label>
            <Input
              id="amountValue"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 50"
              value={(currentItem as FixedAmountDiscount).amountValue || ""}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  amountValue: parseFloat(e.target.value) || 0,
                })
              }
            />
            {errors.amountValue && (
              <p className="text-sm text-red-500">{errors.amountValue}</p>
            )}
          </div>
        );

      case "BOGO":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyQuantity">Buy Quantity</Label>
                <Input
                  id="buyQuantity"
                  type="number"
                  min="1"
                  placeholder="e.g., 2"
                  value={(currentItem as BOGODiscount).buyQuantity || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      buyQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                />
                {errors.buyQuantity && (
                  <p className="text-sm text-red-500">{errors.buyQuantity}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="getQuantity">Get Quantity</Label>
                <Input
                  id="getQuantity"
                  type="number"
                  min="1"
                  placeholder="e.g., 1"
                  value={(currentItem as BOGODiscount).getQuantity || ""}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      getQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                />
                {errors.getQuantity && (
                  <p className="text-sm text-red-500">{errors.getQuantity}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value (%)</Label>
              <Input
                id="discountValue"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 100 for free"
                value={(currentItem as BOGODiscount).discountValue || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    discountValue: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.discountValue && (
                <p className="text-sm text-red-500">{errors.discountValue}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
              <Input
                id="rewardItems"
                type="text"
                placeholder="Specify eligible reward items"
                value={(currentItem as BOGODiscount).rewardItems || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    rewardItems: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );

      case "SPEND_GET":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spendAmount">Minimum Spend Amount</Label>
              <Input
                id="spendAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 100"
                value={(currentItem as SpendGetDiscount).spendAmount || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    spendAmount: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.spendAmount && (
                <p className="text-sm text-red-500">{errors.spendAmount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="getQuantity">Get Quantity</Label>
              <Input
                id="getQuantity"
                type="number"
                min="1"
                placeholder="e.g., 1"
                value={(currentItem as SpendGetDiscount).getQuantity || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    getQuantity: parseInt(e.target.value) || 0,
                  })
                }
              />
              {errors.getQuantity && (
                <p className="text-sm text-red-500">{errors.getQuantity}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value (%)</Label>
              <Input
                id="discountValue"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 50"
                value={(currentItem as SpendGetDiscount).discountValue || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    discountValue: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.discountValue && (
                <p className="text-sm text-red-500">{errors.discountValue}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
              <Input
                id="rewardItems"
                type="text"
                placeholder="Specify eligible reward items"
                value={(currentItem as SpendGetDiscount).rewardItems || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    rewardItems: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDiscountSummary = (item: DiscountItem) => {
    switch (item.discountType) {
      case "PERCENTAGE":
        return `${item.percentageValue}% off`;
      case "FIXED_AMOUNT":
        return `$${item.amountValue.toFixed(2)} off`;
      case "BOGO":
        return `Buy ${item.buyQuantity}, Get ${item.getQuantity} at ${item.discountValue}% off`;
      case "SPEND_GET":
        return `Spend $${item.spendAmount}, Get ${item.getQuantity} at ${item.discountValue}% off`;
    }
  };

  return (
    <div className=" space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Discount Item</CardTitle>
          <CardDescription>
            Configure discount rules for products or brands
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/*Choose the discount type, based on this different fields will show up*/}
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={currentItem.discountType}
                  onValueChange={(value) =>
                    handleDiscountTypeChange(value as DiscountType)
                  } >
                  <SelectTrigger id="discountType" className="w-full">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    {discountTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.discountType && (
                  <p className="text-sm text-red-500">{errors.discountType}</p>
                )}
              </div>

              {/*Select targets type (products/brands)*/}
              <div className="space-y-2">
                <Label htmlFor="targetType">Target Type</Label>
                <Select
                  value={selectedTargetType}
                  onValueChange={(value) => {
                    setSelectedTargetType(value as TargetType);
                    setCurrentItem({
                      ...currentItem,
                      targetType: value as TargetType,
                    });
                  }}
                >
                  <SelectTrigger id="targetType" className="w-full">
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.targetType && (
                  <p className="text-sm text-red-500">{errors.targetType}</p>
                )}
              </div>
            </div>

            {/*Select targets (products/brands) where discount will be applied*/}
            <TargetSelector
              selectedTargetType={selectedTargetType}
              errors={errors}
            />

          </div>

          {renderDiscountFields()}

          <Button onClick={addDiscountItem} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add to list
          </Button>
        </CardContent>
      </Card>

      {discountItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Discount Items</CardTitle>
            <CardDescription>
              {discountItems.length} discount{" "}
              {discountItems.length === 1 ? "rule" : "rules"} configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {discountItems.map((item) => (
              <Alert key={item.id} className="relative">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">
                      {
                        discountTypeOptions.find(
                          (opt) => opt.value === item.discountType
                        )?.label
                      }
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {renderDiscountSummary(item)} • Applies to:{" "}
                      {item.targetType.toLowerCase()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDiscountItem(item.id)}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiscountManager;
