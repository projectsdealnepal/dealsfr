"use client";
import CustomerMobileView from "@/app/_components/previewModel/customer_view_mobile";
import CustomerWebView from "@/app/_components/previewModel/customer_view_web";
import ChildRouteHeader from "@/components/ChildRouteHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiscountItem } from "@/redux/features/discount/types";
import { useAppSelector } from "@/redux/hooks";
import { Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DiscountPreviewPage = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const { discountData } = useAppSelector((s) => s.discount);
  const [discount, setDiscount] = useState<DiscountItem | null>(null);

  useEffect(() => {
    if (id && discountData) {
      const foundDiscount = discountData.find((d) => d.id === parseInt(id));
      if (foundDiscount) {
        setDiscount(foundDiscount);
      }
    }
  }, [id, discountData]);

  if (!discount) {
    return (
      <div className="container mx-auto p-4">
        <ChildRouteHeader
          title="Discount Preview"
          subtitle="Preview how your discount will appear to customers."
          backLink="/dashboard/discounts"
          backText="Back to discounts"
          titleIcon={<Eye className="h-5 w-5 text-primary" />}
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Discount not found.</p>
        </div>
      </div>
    );
  }

  const layoutPattern = discount.layout.array;

  return (
    <div className="container mx-auto p-4">
      <ChildRouteHeader
        title="Discount Preview"
        subtitle="Preview how your discount will appear to customers."
        backLink="/dashboard/discounts"
        backText="Back to discounts"
        titleIcon={<Eye className="h-5 w-5 text-primary" />}
      />

      <Tabs defaultValue="web" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="web">Web Preview</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="web">
          <div className="border rounded-lg mt-4">
            <CustomerWebView pattern={layoutPattern} />
          </div>
        </TabsContent>
        <TabsContent value="mobile">
          <div className="border rounded-lg mt-4">
            <div className="flex justify-center p-4 bg-background">
              <div className="w-[375px] h-[812px] border-[14px] border-black rounded-[40px] overflow-hidden shadow-lg">
                <CustomerMobileView pattern={layoutPattern} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscountPreviewPage;
