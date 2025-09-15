import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Pencil, Percent, Play, Plus, Trash2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { DiscountItem } from "@/redux/features/discount/types";
import { useRouter } from "next/navigation";

interface DiscountCardProps {
  item: DiscountItem;
  // onEdit: () => void;
  // onGoLive: () => void;
  // onDelete: () => void;
  // onPreview: () => void;
  // onAddProduct: () => void;
}

export const DiscountCard: React.FC<DiscountCardProps> = ({
  item }) => {
  const router = useRouter()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const { bannerData } = useAppSelector((s) => s.banner)
  const { layoutData } = useAppSelector((s) => s.layout)

  return (
    <Card className="w-full ">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-[var(--primary)]">
            {item.name}
          </CardTitle>
          <Badge
            className={`${item.status === "pending"
              ? "bg-[var(--toast-loading-bg)] text-[var(--toast-loading-color)]"
              : "bg-[var(--toast-success-bg)] text-[var(--toast-success-color)]"
              }`}
          >
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[var(--muted-foreground)] line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 " />
          <span className="text-[var(--foreground)]">
            {item.value}% Discount
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="">
            {formatDate(item.start_date)} - {formatDate(item.end_date)}
          </span>
        </div>
        <div className="text-sm text-[var(--muted-foreground)]">
          <p className="font-semibold">Terms & Conditions:</p>
          <p>{item.terms_conditions}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-[var(--muted-foreground)]">
          <div>
            <p className="font-semibold">Banner:</p>
            <p>{bannerData?.find((i) => i.id === item.banner.id)?.name}</p>
          </div>
          <div>
            <p className="font-semibold">Layout:</p>
            <p>{layoutData?.find((i) => i.id === item.layout.id)?.name}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter >
        <div className="flex flex-row flex-wrap gap-4 justify-between w-full p-4 ">
          <Button
            variant="outline"
            size="sm"
            className="min-w-30"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-w-30"
          >
            <Play className="h-4 w-4 mr-2" />
            Go Live
          </Button>
          <Button
            onClick={() => router.push("/dashboard/discounts/select_product")}
            variant="outline"
            size="sm"
            className="min-w-30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button
            variant="outline"
            size="sm"
            className=" min-w-30"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="min-w-30"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
