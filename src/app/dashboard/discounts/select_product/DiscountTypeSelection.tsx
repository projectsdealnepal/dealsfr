"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

const dummyBrands = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Sony" },
]

const dummyProducts = [
  { id: 101, name: "iPhone 15" },
  { id: 102, name: "Samsung Galaxy S24" },
  { id: 103, name: "Sony WH-1000XM5" },
]

export default function DiscountRow() {
  const [open, setOpen] = useState(false)
  const [discountType, setDiscountType] = useState("")
  const [targetType, setTargetType] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<{ id: number; name: string } | null>(null)
  const [rewardProduct, setRewardProduct] = useState("")

  const resetForm = () => {
    setDiscountType("")
    setTargetType("")
    setSelectedBrand(null)
    setRewardProduct("")
  }

  const handleSave = () => {
    // Add your save logic here
    console.log("Saving discount...")
    setOpen(false)
    resetForm()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center gap-3" >
        {/* Discount Type Dropdown */}
        <div className="flex-1 min-w-[180px]">
          <Select value={discountType} onValueChange={setDiscountType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Discount Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage Off</SelectItem>
              <SelectItem value="FIXED_AMOUNT">Fixed Amount Off</SelectItem>
              <SelectItem value="BOGO">Buy X Get Y</SelectItem>
              <SelectItem value="SPEND_GET">Spend X Get Y Off</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Target Type Dropdown */}
        <div className="flex-1 min-w-[180px]">
          <Select value={targetType} onValueChange={setTargetType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Target Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              disabled={!discountType || !targetType}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Discount
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-full sm:max-w-[480px] flex flex-col p-0">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle className="text-xl font-semibold">Add Discount Details</SheetTitle>
            </SheetHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-5">
                {/* Discount Type */}
                <div className="space-y-2">
                  <Label htmlFor="discount-type" className="text-sm font-medium">
                    Discount Type
                  </Label>
                  <Input
                    id="discount-type"
                    value={discountType}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                {/* Target Type */}
                <div className="space-y-2">
                  <Label htmlFor="target-type" className="text-sm font-medium">
                    Target Type
                  </Label>
                  <Input
                    id="target-type"
                    value={targetType}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                {/* 
                Target Selection 
                In case for the product type it will show the all the product on which discount will be applied
                In the case of barand it shows the name of brand
                */}

                <div className="space-y-2">
                  {targetType === "product" ? (
                    <div>
                      <Label className="text-sm font-medium">
                        {"Target Product ID"}
                      </Label>
                      <div>

                      </div>
                    </div>
                  ) : (

                    <>
                      <Label className="text-sm font-medium">
                        {"Target Brand"}
                      </Label>
                      <Select
                        value={selectedBrand?.id.toString()}
                        onValueChange={(id) => {
                          const brand = dummyBrands.find((b) => b.id.toString() === id)
                          setSelectedBrand(brand || null)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyBrands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                {/* Conditional Fields Based on Discount Type */}
                {discountType === "PERCENTAGE" && (
                  <div className="space-y-2">
                    <Label htmlFor="percentage-value" className="text-sm font-medium">
                      Discount Percentage (%)
                    </Label>
                    <Input
                      id="percentage-value"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 10"
                      min="0"
                      max="100"
                    />
                  </div>
                )}

                {discountType === "FIXED_AMOUNT" && (
                  <div className="space-y-2">
                    <Label htmlFor="fixed-amount" className="text-sm font-medium">
                      Discount Amount
                    </Label>
                    <Input
                      id="fixed-amount"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 500"
                      min="0"
                    />
                  </div>
                )}

                {discountType === "BOGO" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="buy-qty" className="text-sm font-medium">
                          Buy Quantity (X)
                        </Label>
                        <Input
                          id="buy-qty"
                          type="number"
                          placeholder="e.g., 1"
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="get-qty" className="text-sm font-medium">
                          Get Quantity (Y)
                        </Label>
                        <Input
                          id="get-qty"
                          type="number"
                          placeholder="e.g., 1"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reward-product-bogo" className="text-sm font-medium">
                        Reward Product
                      </Label>
                      <Select>
                        <SelectTrigger id="reward-product-bogo">
                          <SelectValue placeholder="Select reward product" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyProducts.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reward-value-bogo" className="text-sm font-medium">
                        Reward Value (%)
                      </Label>
                      <Input
                        id="reward-value-bogo"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 50 (for 50% off)"
                        min="0"
                        max="100"
                      />
                    </div>
                  </>
                )}

                {discountType === "SPEND_GET" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="min-spend" className="text-sm font-medium">
                        Minimum Spend Amount (X)
                      </Label>
                      <Input
                        id="min-spend"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 1000"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reward-qty" className="text-sm font-medium">
                        Reward Quantity
                      </Label>
                      <Input
                        id="reward-qty"
                        type="number"
                        placeholder="e.g., 1"
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reward-value-spend" className="text-sm font-medium">
                        Reward Value (Y)
                      </Label>
                      <Input
                        id="reward-value-spend"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 100"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reward-product-spend" className="text-sm font-medium">
                        Reward Product
                      </Label>
                      <Select value={rewardProduct} onValueChange={setRewardProduct}>
                        <SelectTrigger id="reward-product-spend">
                          <SelectValue placeholder="Select reward product" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyProducts.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Fixed Footer with Actions */}
            <div className="border-t px-6 py-4 bg-gray-50">
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Add To List
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
