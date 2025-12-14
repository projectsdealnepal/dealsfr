import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/redux/features/order/order";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useState } from "react";

const ORDER_STATES = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Ready", value: "ready_for_pickup" },
  { label: "Picked Up", value: "picked_up" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

interface StatusSelectProps {
  value: string;
  id: number;
}

export function StatusSelect({ value, id }: StatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState(value);
  const dispatch = useAppDispatch();
  const { storeDetailData } = useAppSelector((s) => s.store);

  const handleChange = async (newValue: string) => {
    setSelectedStatus(newValue)
    storeDetailData &&
      dispatch(
        updateOrderStatus({
          s_id: storeDetailData?.id,
          o_id: id,
          status: newValue,
        })
      );
  };

  return (
    <Select
      value={selectedStatus} // show parent value
      onValueChange={handleChange} // internal API call
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>

      <SelectContent>
        {ORDER_STATES.map((state) => (
          <SelectItem key={state.value} value={state.value}>
            {state.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
