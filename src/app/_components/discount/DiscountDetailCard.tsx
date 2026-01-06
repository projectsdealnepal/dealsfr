import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PreviewDiscountDetailResponse } from "@/redux/features/discount/types";
import { Calendar } from "lucide-react";
interface DiscountDetailCardProps {
  data: PreviewDiscountDetailResponse;
}

export const DiscountDetailCard: React.FC<DiscountDetailCardProps> = ({
  data,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">
            Description
          </h4>
          <p className="text-sm">
            {data.description || "No description provided."}
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Start Date
            </h4>
            <p className="text-sm">{formatDate(data.start_date)}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <Calendar className="h-3 w-3" /> End Date
            </h4>
            <p className="text-sm">{formatDate(data.end_date)}</p>
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">
            Terms & Conditions
          </h4>
          <p className="text-sm whitespace-pre-wrap">
            {data.terms_conditions || "No terms specified."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
