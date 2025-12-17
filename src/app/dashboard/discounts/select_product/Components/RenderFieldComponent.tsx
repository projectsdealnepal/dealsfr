import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TargetType,
  ValueType,
} from "@/redux/features/product/types";
import React, { Dispatch, SetStateAction } from "react";
import SelectRewardDialog from "./SelectRewardDialog";
import { BOGODiscount, BundleDiscount, FixedAmountDiscount, PartialDiscountItem, PercentageDiscount, SpendGetDiscount } from "./types";

interface RenderDiscountFieldsProps {
  currentItem: PartialDiscountItem,
  setCurrentItem: Dispatch<SetStateAction<PartialDiscountItem>>,
  errors: Record<string, string>,
}

export const RenderDiscountFields = (
  {
    errors,
    currentItem,
    setCurrentItem,
  }: RenderDiscountFieldsProps) => {
  console.log("currentItem", currentItem)
  switch (currentItem.discountType) {
    case "PERCENTAGE":
      return (
        <div className="flex w-full justify-between gap-2">
          <div className="space-y-2 flex-1" >
            <Label htmlFor="percentageValue">Percentage Value (%)</Label>
            <Input
              id="percentageValue"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 9"
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

          <div className="space-y-2 flex-1">
            <Label htmlFor="maximumDiscount">Maximum Discount</Label>
            <Input
              id="maximumDiscount"
              type="number"
              min="0"
              placeholder="e.g., 200"
              value={(currentItem as PercentageDiscount).maximumDiscount || ""}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  maximumDiscount: parseFloat(e.target.value) || 0,
                })
              }
            />
            {/* {errors.maximumDiscount && ( */}
            {/*   <p className="text-sm text-red-500">{errors.maximumDiscount}</p> */}
            {/* )} */}
          </div>
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
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-1">
              <Label htmlFor="buyQuantity">Buy Quantity</Label>
              <Input
                id="buyQuantity"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 2"
                value={(currentItem as BOGODiscount).buyQuantity || ""}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    buyQuantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.buyQuantity && (
                <p className="text-sm text-red-500">{errors.buyQuantity}</p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="targetType">Discount Value Type</Label>
              <Tabs
                defaultValue="PERCENTAGE"
                className="w-full bg-accent"
                onValueChange={(v) => {
                  setCurrentItem({
                    ...currentItem,
                    discountType: currentItem.discountType,
                    valueType: v as ValueType,
                  });
                }}
              >
                <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
                  <TabsTrigger
                    value="PERCENTAGE"
                    style={{
                      boxShadow: "none",
                    }}
                    className="relative rounded-none border-none bg-transparent 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
                 data-[state=active]:after:opacity-100"
                  >
                    Percentage
                  </TabsTrigger>

                  <TabsTrigger
                    value="FIXED_AMOUNT"
                    style={{
                      boxShadow: "none",
                    }}
                    className="relative rounded-none border-none bg-transparent 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
                 data-[state=active]:after:opacity-100"
                  >
                    Fixed Value
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="PERCENTAGE" className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <Label htmlFor="discountValue">Discount Value (%)</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="e.g., 100 for free"
                      value={(currentItem as BOGODiscount).percentageValue || ""}
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

                  <div className="flex-1">
                    <Label htmlFor="maximumDiscount">Maximum Discount</Label>
                    <Input
                      id="maximumDiscount"
                      type="number"
                      min="0"
                      placeholder="e.g., 200"
                      value={(currentItem as BOGODiscount).maximumDiscount || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          maximumDiscount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="FIXED_AMOUNT" className="mt-4">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    step="1"
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
                </TabsContent>
              </Tabs>
            </div >
          </div >
          <div className="space-y-2">
            <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
            <div>
              <SelectRewardDialog />
            </div>
          </div>
        </div >
      );

    case "SPEND_GET":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-1">
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
            <div className="space-y-2 col-span-2">
              <Label htmlFor="targetType">Discount Value Type</Label>
              <Tabs
                defaultValue="PERCENTAGE"
                className="w-full bg-accent"
                onValueChange={(v) => {
                  setCurrentItem({
                    ...currentItem,
                    valueType: v as ValueType,
                    discountType: currentItem.discountType,
                  });
                }}
              >
                <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
                  <TabsTrigger
                    value="PERCENTAGE"
                    style={{
                      boxShadow: "none",
                    }}
                    className="relative rounded-none border-none bg-transparent 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
                 data-[state=active]:after:opacity-100"
                  >
                    Percentage
                  </TabsTrigger>

                  <TabsTrigger
                    value="FIXED_AMOUNT"
                    style={{
                      boxShadow: "none",
                    }}
                    className="relative rounded-none border-none bg-transparent 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
                 data-[state=active]:after:opacity-100"
                  >
                    Fixed Value
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="PERCENTAGE" className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <Label htmlFor="discountValue">Discount Value (%)</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="e.g., 100 for free"
                      value={(currentItem as SpendGetDiscount).percentageValue || ""}
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

                  <div className="flex-1">
                    <Label htmlFor="maximumDiscount">Maximum Discount</Label>
                    <Input
                      id="maximumDiscount"
                      type="number"
                      min="0"
                      placeholder="e.g., 200"
                      value={(currentItem as SpendGetDiscount).maximumDiscount || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          maximumDiscount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="FIXED_AMOUNT" className="mt-4">
                  <Label htmlFor="discountValue">Discount Value (%)</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g., 100 for free"
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
                </TabsContent>
              </Tabs>
            </div >
          </div>
          <div className="space-y-2">
            <Label htmlFor="rewardItems">Reward Items (Optional)</Label>{" "}
            <div>
              <SelectRewardDialog />
            </div>
          </div>
        </div>
      );

    case "BUNDLE":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="targetType">Discount Value Type</Label>
              <Tabs
                defaultValue="storeproduct"
                className="w-full bg-accent"
                onValueChange={(v) => {
                  setCurrentItem({
                    discountType: currentItem.discountType,
                    targetType: v as TargetType,
                  });
                }}
              >
                <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
                  <TabsTrigger
                    value="storeproduct"
                    style={{
                      boxShadow: "none",
                    }}
                    className="relative rounded-none border-none bg-transparent 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
                 data-[state=active]:after:opacity-100"
                  >
                    Percentage
                  </TabsTrigger>

                  <TabsTrigger
                    value="brand"
                    style={{
                      boxShadow: "none",
                    }}
                    className="relative rounded-none border-none bg-transparent 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
                 data-[state=active]:after:opacity-100"
                  >
                    Fixed Value
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="storeproduct" className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <Label htmlFor="discountValue">Discount Value (%)</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="e.g., 100 for free"
                      value={(currentItem as BundleDiscount).percentageValue || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          percentageValue: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    {errors.discountValue && (
                      <p className="text-sm text-red-500">{errors.discountValue}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="maximumDiscount">Maximum Discount</Label>
                    <Input
                      id="maximumDiscount"
                      type="number"
                      min="0"
                      placeholder="e.g., 200"
                      value={(currentItem as BundleDiscount).maximumDiscount || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          maximumDiscount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="brand" className="mt-4">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 100 for free"
                    value={(currentItem as BundleDiscount).discountValue || ""}
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
                </TabsContent>
              </Tabs>

            </div >
          </div >
          <div className="space-y-2">
            <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
            <div>
              <SelectRewardDialog />
            </div>
          </div>
        </div >
      )

    default:
      return null;
  }
};

//old version if in the case we need it 

// const renderDiscountFields = () => {
//   console.log("currentItem", currentItem)
//   switch (currentItem.discountType) {
//     case "PERCENTAGE":
//       return (
//         <div className="flex w-full justify-between gap-2">
//           <div className="space-y-2 flex-1" >
//             <Label htmlFor="percentageValue">Percentage Value (%)</Label>
//             <Input
//               id="percentageValue"
//               type="number"
//               min="0"
//               max="100"
//               step="0.1"
//               placeholder="e.g., 9"
//               value={(currentItem as PercentageDiscount).percentageValue || ""}
//               onChange={(e) =>
//                 setCurrentItem({
//                   ...currentItem,
//                   percentageValue: parseFloat(e.target.value) || 0,
//                 })
//               }
//             />
//             {errors.percentageValue && (
//               <p className="text-sm text-red-500">{errors.percentageValue}</p>
//             )}
//           </div>
//
//           <div className="space-y-2 flex-1">
//             <Label htmlFor="maximumDiscount">Maximum Discount</Label>
//             <Input
//               id="maximumDiscount"
//               type="number"
//               min="0"
//               placeholder="e.g., 200"
//               value={(currentItem as PercentageDiscount).maximumDiscount || ""}
//               onChange={(e) =>
//                 setCurrentItem({
//                   ...currentItem,
//                   maximumDiscount: parseFloat(e.target.value) || 0,
//                 })
//               }
//             />
//             {/* {errors.maximumDiscount && ( */}
//             {/*   <p className="text-sm text-red-500">{errors.maximumDiscount}</p> */}
//             {/* )} */}
//           </div>
//         </div>
//       );
//
//     case "FIXED_AMOUNT":
//       return (
//         <div className="space-y-2">
//           <Label htmlFor="amountValue">Discount Amount</Label>
//           <Input
//             id="amountValue"
//             type="number"
//             min="0"
//             step="0.01"
//             placeholder="e.g., 50"
//             value={(currentItem as FixedAmountDiscount).amountValue || ""}
//             onChange={(e) =>
//               setCurrentItem({
//                 ...currentItem,
//                 amountValue: parseFloat(e.target.value) || 0,
//               })
//             }
//           />
//           {errors.amountValue && (
//             <p className="text-sm text-red-500">{errors.amountValue}</p>
//           )}
//         </div>
//       );
//
//     case "BOGO":
//       return (
//         <div className="space-y-4">
//           <div className="grid grid-cols-3 gap-4">
//             <div className="space-y-2 col-span-1">
//               <Label htmlFor="buyQuantity">Buy Quantity</Label>
//               <Input
//                 id="buyQuantity"
//                 type="number"
//                 min="1"
//                 step="1"
//                 placeholder="e.g. 2"
//                 value={(currentItem as BOGODiscount).buyQuantity || ""}
//                 onChange={(e) =>
//                   setCurrentItem({
//                     ...currentItem,
//                     buyQuantity: parseFloat(e.target.value) || 0,
//                   })
//                 }
//               />
//               {errors.buyQuantity && (
//                 <p className="text-sm text-red-500">{errors.buyQuantity}</p>
//               )}
//             </div>
//
//             <div className="space-y-2 col-span-2">
//               <Label htmlFor="targetType">Discount Value Type</Label>
//               <Tabs
//                 defaultValue="PERCENTAGE"
//                 className="w-full bg-accent"
//                 onValueChange={(v) => {
//                   // setSelectedTargetType(v as TargetType)
//                   setCurrentItem({
//                     ...currentItem,
//                     discountType: currentItem.discountType,
//                     valueType: v as ValueType,
//                   });
//                 }}
//               >
//                 <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
//                   <TabsTrigger
//                     value="PERCENTAGE"
//                     style={{
//                       boxShadow: "none",
//                     }}
//                     className="relative rounded-none border-none bg-transparent
//                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
//                data-[state=active]:after:opacity-100"
//                   >
//                     Percentage
//                   </TabsTrigger>
//
//                   <TabsTrigger
//                     value="FIXED_AMOUNT"
//                     style={{
//                       boxShadow: "none",
//                     }}
//                     className="relative rounded-none border-none bg-transparent
//                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
//                data-[state=active]:after:opacity-100"
//                   >
//                     Fixed Value
//                   </TabsTrigger>
//                 </TabsList>
//
//                 <TabsContent value="PERCENTAGE" className="flex gap-2 mt-4">
//                   <div className="flex-1">
//                     <Label htmlFor="discountValue">Discount Value (%)</Label>
//                     <Input
//                       id="discountValue"
//                       type="number"
//                       min="0"
//                       max="100"
//                       step="0.01"
//                       placeholder="e.g., 100 for free"
//                       value={(currentItem as BOGODiscount).percentageValue || ""}
//                       onChange={(e) =>
//                         setCurrentItem({
//                           ...currentItem,
//                           percentageValue: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                     />
//                     {errors.percentageValue && (
//                       <p className="text-sm text-red-500">{errors.percentageValue}</p>
//                     )}
//                   </div>
//
//                   <div className="flex-1">
//                     <Label htmlFor="maximumDiscount">Maximum Discount</Label>
//                     <Input
//                       id="maximumDiscount"
//                       type="number"
//                       min="0"
//                       placeholder="e.g., 200"
//                       value={(currentItem as BOGODiscount).maximumDiscount || ""}
//                       onChange={(e) =>
//                         setCurrentItem({
//                           ...currentItem,
//                           maximumDiscount: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                     />
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="FIXED_AMOUNT" className="mt-4">
//                   <Label htmlFor="discountValue">Discount Value</Label>
//                   <Input
//                     id="discountValue"
//                     type="number"
//                     min="0"
//                     step="1"
//                     placeholder="e.g., 100 for free"
//                     value={(currentItem as BOGODiscount).discountValue || ""}
//                     onChange={(e) =>
//                       setCurrentItem({
//                         ...currentItem,
//                         discountValue: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                   />
//                   {errors.discountValue && (
//                     <p className="text-sm text-red-500">{errors.discountValue}</p>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </div >
//           </div >
//           <div className="space-y-2">
//             <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
//             <div>
//               <SelectRewardDialog />
//             </div>
//           </div>
//         </div >
//       );
//
//     case "SPEND_GET":
//       return (
//         <div className="space-y-4">
//           <div className="grid grid-cols-3 gap-4">
//             <div className="space-y-2 col-span-1">
//               <Label htmlFor="spendAmount">Minimum Spend Amount</Label>
//               <Input
//                 id="spendAmount"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 placeholder="e.g., 100"
//                 value={(currentItem as SpendGetDiscount).spendAmount || ""}
//                 onChange={(e) =>
//                   setCurrentItem({
//                     ...currentItem,
//                     spendAmount: parseFloat(e.target.value) || 0,
//                   })
//                 }
//               />
//               {errors.spendAmount && (
//                 <p className="text-sm text-red-500">{errors.spendAmount}</p>
//               )}
//             </div>
//             <div className="space-y-2 col-span-2">
//               <Label htmlFor="targetType">Discount Value Type</Label>
//               <Tabs
//                 defaultValue="PERCENTAGE"
//                 className="w-full bg-accent"
//                 onValueChange={(v) => {
//                   // setSelectedTargetType(v as TargetType)
//                   setCurrentItem({
//                     ...currentItem,
//                     valueType: v as ValueType,
//                     discountType: currentItem.discountType,
//                   });
//                 }}
//               >
//                 <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
//                   <TabsTrigger
//                     value="PERCENTAGE"
//                     style={{
//                       boxShadow: "none",
//                     }}
//                     className="relative rounded-none border-none bg-transparent
//                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
//                data-[state=active]:after:opacity-100"
//                   >
//                     Percentage
//                   </TabsTrigger>
//
//                   <TabsTrigger
//                     value="FIXED_AMOUNT"
//                     style={{
//                       boxShadow: "none",
//                     }}
//                     className="relative rounded-none border-none bg-transparent
//                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
//                data-[state=active]:after:opacity-100"
//                   >
//                     Fixed Value
//                   </TabsTrigger>
//                 </TabsList>
//
//                 <TabsContent value="PERCENTAGE" className="flex gap-2 mt-4">
//                   <div className="flex-1">
//                     <Label htmlFor="discountValue">Discount Value (%)</Label>
//                     <Input
//                       id="discountValue"
//                       type="number"
//                       min="0"
//                       max="100"
//                       step="0.01"
//                       placeholder="e.g., 100 for free"
//                       value={(currentItem as SpendGetDiscount).percentageValue || ""}
//                       onChange={(e) =>
//                         setCurrentItem({
//                           ...currentItem,
//                           percentageValue: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                     />
//                     {errors.percentageValue && (
//                       <p className="text-sm text-red-500">{errors.percentageValue}</p>
//                     )}
//                   </div>
//
//                   <div className="flex-1">
//                     <Label htmlFor="maximumDiscount">Maximum Discount</Label>
//                     <Input
//                       id="maximumDiscount"
//                       type="number"
//                       min="0"
//                       placeholder="e.g., 200"
//                       value={(currentItem as SpendGetDiscount).maximumDiscount || ""}
//                       onChange={(e) =>
//                         setCurrentItem({
//                           ...currentItem,
//                           maximumDiscount: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                     />
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="FIXED_AMOUNT" className="mt-4">
//                   <Label htmlFor="discountValue">Discount Value (%)</Label>
//                   <Input
//                     id="discountValue"
//                     type="number"
//                     min="0"
//                     max="100"
//                     step="0.01"
//                     placeholder="e.g., 100 for free"
//                     value={(currentItem as SpendGetDiscount).discountValue || ""}
//                     onChange={(e) =>
//                       setCurrentItem({
//                         ...currentItem,
//                         discountValue: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                   />
//                   {errors.discountValue && (
//                     <p className="text-sm text-red-500">{errors.discountValue}</p>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </div >
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="rewardItems">Reward Items (Optional)</Label>{" "}
//             <div>
//               <SelectRewardDialog />
//             </div>
//           </div>
//         </div>
//       );
//
//     case "BUNDLE":
//       return (
//         <div className="space-y-4">
//           <div className="grid grid-cols-1">
//             <div className="space-y-2">
//               <Label htmlFor="targetType">Discount Value Type</Label>
//               <Tabs
//                 defaultValue="storeproduct"
//                 className="w-full bg-accent"
//                 onValueChange={(v) => {
//                   // setSelectedTargetType(v as TargetType)
//                   setCurrentItem({
//                     discountType: currentItem.discountType,
//                     targetType: v as TargetType,
//                   });
//                 }}
//               >
//                 <TabsList className="flex w-full justify-start gap-6 border-b border-primary/10  rounded-none p-0">
//                   <TabsTrigger
//                     value="storeproduct"
//                     style={{
//                       boxShadow: "none",
//                     }}
//                     className="relative rounded-none border-none bg-transparent
//                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
//                data-[state=active]:after:opacity-100"
//                   >
//                     Percentage
//                   </TabsTrigger>
//
//                   <TabsTrigger
//                     value="brand"
//                     style={{
//                       boxShadow: "none",
//                     }}
//                     className="relative rounded-none border-none bg-transparent
//                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary after:opacity-0
//                data-[state=active]:after:opacity-100"
//                   >
//                     Fixed Value
//                   </TabsTrigger>
//                 </TabsList>
//
//                 <TabsContent value="storeproduct" className="flex gap-2 mt-4">
//                   <div className="flex-1">
//                     <Label htmlFor="discountValue">Discount Value (%)</Label>
//                     <Input
//                       id="discountValue"
//                       type="number"
//                       min="0"
//                       max="100"
//                       step="0.01"
//                       placeholder="e.g., 100 for free"
//                       value={(currentItem as BundleDiscount).percentageValue || ""}
//                       onChange={(e) =>
//                         setCurrentItem({
//                           ...currentItem,
//                           percentageValue: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                     />
//                     {errors.discountValue && (
//                       <p className="text-sm text-red-500">{errors.discountValue}</p>
//                     )}
//                   </div>
//
//                   <div className="flex-1">
//                     <Label htmlFor="maximumDiscount">Maximum Discount</Label>
//                     <Input
//                       id="maximumDiscount"
//                       type="number"
//                       min="0"
//                       placeholder="e.g., 200"
//                       value={(currentItem as BundleDiscount).maximumDiscount || ""}
//                       onChange={(e) =>
//                         setCurrentItem({
//                           ...currentItem,
//                           maximumDiscount: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                     />
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="brand" className="mt-4">
//                   <Label htmlFor="discountValue">Discount Value</Label>
//                   <Input
//                     id="discountValue"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     placeholder="e.g., 100 for free"
//                     value={(currentItem as BundleDiscount).discountValue || ""}
//                     onChange={(e) =>
//                       setCurrentItem({
//                         ...currentItem,
//                         discountValue: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                   />
//                   {errors.discountValue && (
//                     <p className="text-sm text-red-500">{errors.discountValue}</p>
//                   )}
//                 </TabsContent>
//               </Tabs>
//
//             </div >
//           </div >
//           <div className="space-y-2">
//             <Label htmlFor="rewardItems">Reward Items (Optional)</Label>
//             <div>
//               <SelectRewardDialog />
//             </div>
//           </div>
//         </div >
//       )
//
//     default:
//       return null;
//   }
// };
