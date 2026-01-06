import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  deleteDiscount,
  updateDiscount,
} from "@/redux/features/discount/discount";
import {
  DiscountUpdatePayload,
  PreviewDiscountDetailResponse,
} from "@/redux/features/discount/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

interface DiscountCardProps {
  item: PreviewDiscountDetailResponse;
}

export const DiscountCard: React.FC<DiscountCardProps> = ({ item }) => {
  const router = useRouter();
  const { storeDetailData } = useAppSelector((s) => s.store);
  const dispatch = useAppDispatch();

  const handleDelete = (id: number) => {
    const payload = {
      s_id: storeDetailData?.id ?? 0,
      id,
    };
    dispatch(deleteDiscount(payload));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleGoLive = () => {
    if (storeDetailData) {
      const data: {
        payload: DiscountUpdatePayload;
        d_id: number;
        s_id: number;
      } = {
        payload: {
          status: "active",
        },
        d_id: item.id,
        s_id: storeDetailData?.id,
      };
      dispatch(updateDiscount(data));
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/discounts/create?id=${item.id}`);
  };

  return (
    <Card
      className="w-full h-full group hover:shadow-lg transition-all duration-300 border-[var(--border)] bg-gradient-to-br from-background to-muted/20 cursor-pointer hover:border-[var(--primary)]/50 flex flex-col"
      onClick={() => router.push(`/dashboard/discounts/${item.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-xl font-semibold text-foreground group-hover:text-[var(--primary)] transition-colors">
            {item.name}
          </CardTitle>
          <Badge
            className={`${
              item.status === "pending"
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
            } font-medium px-3 py-1 rounded-full shrink-0`}
          >
            {item.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
              Start
            </span>
            <span className="font-semibold text-foreground">
              {formatDate(item.start_date)}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--primary)] to-muted mx-2"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
              End
            </span>
            <span className="font-semibold text-foreground">
              {formatDate(item.end_date)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
