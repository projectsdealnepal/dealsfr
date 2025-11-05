import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Pencil, Percent, Play, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { DiscountItem } from "@/redux/features/discount/types";
import { useRouter } from "next/navigation";
import { deleteDiscount } from "@/redux/features/discount/discount";

interface DiscountCardProps {
  item: DiscountItem;
}

export const DiscountCard: React.FC<DiscountCardProps> = ({
  item }) => {
  const router = useRouter()
  const { storeDetailData } = useAppSelector(s => s.store)
  const dispatch = useAppDispatch()

  const handleDelete = (id: number) => {
    const payload = {
      s_id: storeDetailData?.id ?? 0,
      id
    }
    dispatch(deleteDiscount(payload))
  }


  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddProductButtons = (id: number) => {

  }


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
            <p>{item.banner.name}</p>
          </div>
          <div>
            <p className="font-semibold">Layout:</p>
            <p>{item.layout.name}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter >
        <div className="flex flex-row flex-wrap gap-4 justify-between w-full p-4 ">
          <Button
            variant="outline"
            size="sm"
            className="min-w-30"
            onClick={() => router.push(`/dashboard/discounts/preview?id=${item.id}`)}
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
            onClick={() => router.push(`/dashboard/discounts/select_product?id=${item.id}`)}
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
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
