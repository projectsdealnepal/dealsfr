import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deleteDiscount,
  updateDiscount,
} from "@/redux/features/discount/discount";
import { DiscountDetailResponse } from "@/redux/features/discount/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface DiscountDetailHeaderProps {
  data: DiscountDetailResponse;
  storeId: number;
}

export const DiscountDetailHeader: React.FC<DiscountDetailHeaderProps> = ({
  data,
  storeId,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  //   const { storeDetailData } = useAppSelector((state) => state.store);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const handleEdit = () => {
    router.push(`/dashboard/discounts/create?id=${data.id}`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteDiscount({ s_id: storeId, id: data.id })).unwrap();
      setIsDeleteDialogOpen(false);
      router.push("/dashboard/discounts");
      toast.success("Discount deleted successfully");
    } catch (error) {
      // Error handled by thunk/toast usually
    }
  };

  const handleToggleStatus = () => {
    const newStatus = data.status === "active" ? "inactive" : "active";
    dispatch(
      updateDiscount({
        payload: { status: newStatus },
        s_id: storeId,
        d_id: data.id,
      })
    );
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
          <Badge
            className={`${data.status === "active"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-700 border-amber-500/20"
              } capitalize flex items-center gap-1.5`}
          >
            {data.status === "active" ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5" />
            )}
            {data.status}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          Created on {formatDate(data.created_at)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleToggleStatus}>
          {data.status === "active" ? (
            <>
              <PowerOff className="mr-2 h-4 w-4" /> Deactivate
            </>
          ) : (
            <>
              <Power className="mr-2 h-4 w-4" /> Go Live
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                discount {`"${data.name}"`}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const handleEdit = () => {
//     router.push(`/dashboard/discounts/create?id=${data.id}`);
//   };

//   const handleDelete = async () => {
//     try {
//       await dispatch(deleteDiscount({ s_id: storeId, id: data.id })).unwrap();
//       setIsDeleteDialogOpen(false);
//       router.push("/dashboard/discounts");
//       toast.success("Discount deleted successfully");
//     } catch (error) {
//       // Error handled by thunk/toast usually
//     }
//   };

//   const handleToggleStatus = () => {
//     const newStatus = data.status === "active" ? "inactive" : "active";
//     dispatch(
//       updateDiscount({
//         payload: { status: newStatus },
//         s_id: storeId,
//         d_id: data.id,
//       })
//     );
//   };
