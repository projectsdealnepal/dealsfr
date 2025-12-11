"use client";

import { Button } from "@/components/ui/button";

interface FilterTabsProps {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

const FilterTabs = ({ activeFilter, setActiveFilter }: FilterTabsProps) => {
  const filters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Ready", value: "ready_for_pickup" },
    { label: "Picked Up", value: "picked_up" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveFilter(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default FilterTabs;
