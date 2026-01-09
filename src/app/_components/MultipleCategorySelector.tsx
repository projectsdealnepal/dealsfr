"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CategoryItem } from "@/redux/features/category/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface MultipleCategorySelectorProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  value?: CategoryItem[];
  onSelect: (selectedCategory: CategoryItem[]) => void;
}

export function MultipleCategorySelector({
  open,
  onClose,
  categories,
  value,
  onSelect,
}: MultipleCategorySelectorProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(value?.map((c) => c.id) ?? [])
  );

  useEffect(() => {
    setSelectedIds(new Set(value?.map((c) => c.id) ?? []));
  }, [value, open]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Helper to recursively get all descendant IDs of a category
  const getDescendantIds = (cat: CategoryItem): number[] => {
    const ids: number[] = [];
    if (cat.children?.length) {
      for (const child of cat.children) {
        ids.push(child.id);
        ids.push(...getDescendantIds(child));
      }
    }
    return ids;
  };

  // Handles clicking a checkbox - toggles the category and all its children
  const toggleSelection = (cat: CategoryItem) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      const descendantIds = getDescendantIds(cat);
      // We toggle the clicked category AND all its descendants
      const idsToToggle = [cat.id, ...descendantIds];

      const isSelected = newSet.has(cat.id);

      if (isSelected) {
        // If already selected, deselect it and all descendants
        idsToToggle.forEach((id) => newSet.delete(id));
      } else {
        // If not selected, select it and all descendants
        idsToToggle.forEach((id) => newSet.add(id));
      }
      return newSet;
    });
  };

  // Helper to find a CategoryItem object by its ID from the tree
  const findCategoryById = (
    cats: CategoryItem[],
    id: number
  ): CategoryItem | undefined => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Called when "Apply Selection" is clicked
  const handleConfirm = () => {
    if (selectedIds) {
      // Convert Set of IDs back to CategoryItem objects
      const selectedCategories = Array.from(selectedIds)
        .map((id) => findCategoryById(categories, id))
        .filter((cat): cat is CategoryItem => cat !== undefined);

      onSelect(selectedCategories);
    }
    onClose();
  };

  // Clears all selected categories
  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Recursive tree node
  const TreeNode: React.FC<{ cat: CategoryItem; level?: number }> = ({
    cat,
    level = 0,
  }) => {
    const isExpanded = expandedIds.has(cat.id);
    const isSelected = selectedIds.has(cat.id);
    const hasChildren = cat.children && cat.children.length > 0;

    return (
      <div className="select-none">
        <div
          className="flex items-center gap-2 py-1.5 hover:bg-muted/50 rounded-sm pr-2 group"
          style={{ paddingLeft: level * 16 }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(cat.id);
              }}
              className="flex items-center justify-center h-6 w-6 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-6" /> // Spacer
          )}

          {/* Checkbox and Label */}
          <div className="flex items-center gap-2 flex-1 cursor-pointer">
            <Checkbox
              id={`cat-${cat.id}`}
              checked={isSelected}
              onCheckedChange={() => toggleSelection(cat)}
            />
            <label
              htmlFor={`cat-${cat.id}`}
              className="text-sm cursor-pointer flex-1 py-1"
            >
              {cat.name}
            </label>
          </div>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="animate-in slide-in-from-top-1 fade-in-0 duration-200">
            {cat.children.map((child) => (
              <TreeNode key={child.id} cat={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b space-y-1">
          <SheetTitle>Select Categories</SheetTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{selectedIds.size} selected</span>
            {selectedIds.size > 0 && (
              <button
                onClick={clearSelection}
                className="text-primary hover:underline text-xs"
              >
                Clear all
              </button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4 min-h-0">
          <div className="space-y-1">
            {categories.map((cat) => (
              <TreeNode key={cat.id} cat={cat} />
            ))}
            {categories.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No categories found.
              </p>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t bg-muted/10 sm:justify-between flex-row items-center gap-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            Apply Selection
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
