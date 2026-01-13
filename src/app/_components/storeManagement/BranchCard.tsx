import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/interceptor";
import { getBranchDetails, getStoreDetail } from "@/redux/features/store/store";
import { Branch } from "@/redux/features/store/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Building, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface BranchCardTypes {
  branch: Branch;
}

const BranchCard = ({ branch }: BranchCardTypes) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { storeDetailData } = useAppSelector((s) => s.store);

  const handleBranchEdit = (b_id: number, s_id: number) => {
    router.push(
      `/dashboard/create_branch/?action=edit&branch_id=${b_id}&store_id=${s_id}`
    );
  };

  const handleBranchDelete = async (b_id: number, s_id: number) => {
    await api.delete(`/api/stores/${s_id}/branches/${b_id}/`);
    dispatch(getStoreDetail(s_id));
  };

  return (
    <Card>
      <CardContent className="px-4,py-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <span className="font-medium text-card-foreground">
                {branch.name}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {branch.address}, {branch.city}
            </div>
          </div>
          {storeDetailData && (
            <div className="flex gap-1">
              <Button
                onClick={() => handleBranchEdit(branch.id, storeDetailData.id)}
                variant="ghost"
                size="icon"
              >
                <Edit />
              </Button>
              <Button
                onClick={() =>
                  handleBranchDelete(branch.id, storeDetailData.id)
                }
                variant="destructive"
                size="icon"
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default BranchCard;
