"use client";

import { Button } from "@/components/ui/button";
// import { useAppDispatch } from "@/redux/hooks";
import { GetOrderListParams } from "../page";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface FilterTabsProps {
  activeFilter: string;
  query: GetOrderListParams,
  setQuery: (value: GetOrderListParams) => void;
  setActiveFilter: (value: string) => void;
}
const filters = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Ready", value: "ready_for_pickup" },
  { label: "Picked Up", value: "picked_up" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

const FilterTabs = ({
  activeFilter,
  setQuery,
  query,
  setActiveFilter }: FilterTabsProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery({
        ...query,
        search: searchTerm,
        page: 1,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterClick = (value: string) => {
    setQuery({
      ...query,
      page: 1,
      status: value
    })
    setActiveFilter(value)
  }

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterClick(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
        <Input
          id="percentageValue"
          type="text"
          placeholder="Type something to search... "
          className="pl-9 h-11 bg-muted/5 border-muted-foreground/20  max-w-2xl focus:bg-background focus:border-primary/50 transition-all font-medium text-lg"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>
    </div>

  );
};

export default FilterTabs;
