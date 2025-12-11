import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

export function StatusSelect({ value }: StatusSelectProps) {
  const handleChange = async (newValue: string) => {
    try {
      const res = await fetch(`/api/orders?status=${newValue}`);
      const data = await res.json();
      console.log("API result:", data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  return (
    <Select
      value={value}          // show parent value
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
