"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BrandItem } from "@/redux/features/product/types";
import { useAppSelector } from "@/redux/hooks";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";

interface BrandSelectorProps {
  value?: BrandItem;
  onSelect?: (brand: BrandItem | undefined) => void;
}

export function BrandSelector({ value, onSelect }: BrandSelectorProps) {
  const [open, setOpen] = useState(false);
  const { brandListData } = useAppSelector((state) => state.product);
  const filteredBrands = useMemo(() => brandListData ?? [], [brandListData]);


  const handleBrandSelect = (brand: BrandItem) => {

    const newValue = value?.id === brand.id ? undefined : brand;
    onSelect?.(newValue);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between py-5"
        >
          {value?.name || "Select Brand..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search brands..." className="h-9" />
          <CommandEmpty>No brand found.</CommandEmpty>
          <CommandGroup>
            <div style={{ height: "300px", minHeight: "300px" }}>
              <Virtuoso
                style={{ height: "300px" }}
                totalCount={filteredBrands.length}
                itemContent={(index) => {
                  const brand = filteredBrands[index];
                  return (
                    <CommandItem
                      key={brand.id}
                      value={brand.name}
                      onSelect={() => handleBrandSelect(brand)}
                    >
                      {brand.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value?.name === brand.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                }}
              />
            </div>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
