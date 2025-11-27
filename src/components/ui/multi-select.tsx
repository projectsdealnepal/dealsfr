"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, selected, onChange, className, placeholder = "Select..." }, ref) => {
    const [open, setOpen] = React.useState(false);

    const allValue = "all";
    const allOption = options.find(o => o.value === allValue);
    const normalOptions = options.filter(o => o.value !== allValue);

    const handleSelect = (value: string) => {
      if (value === allValue) {
        if (selected.length === normalOptions.length) {
          onChange([]);
        } else {
          onChange(normalOptions.map(o => o.value));
        }
        return;
      }

      const newSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(newSelected);
    };

    const handleRemove = (value: string) => {
      onChange(selected.filter((item) => item !== value));
    }

    const selectedOptions = selected
      .map((value) => normalOptions.find((option) => option.value === value))
      .filter(Boolean) as Option[];

    const isAllSelected = allOption ? selected.length === normalOptions.length && selected.length > 0 : false;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between h-auto", className)}
            ref={ref}
            onClick={() => setOpen(!open)}
          >
            <div className="flex gap-1 flex-wrap">
              {isAllSelected && allOption ? (
                <Badge
                  variant="secondary"
                  key={allOption.value}
                  className="mr-1"
                >
                  {allOption.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onChange([]);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => onChange([])}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ) : selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1"
                  >
                    {option.label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(option.value);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(option.value)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {allOption && (
                  <CommandItem
                    key={allOption.value}
                    onSelect={() => handleSelect(allOption.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isAllSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {allOption.label}
                  </CommandItem>
                )}
                {normalOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };


