"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown } from "lucide-react";
import { CategoryItem } from "@/redux/features/category/types";


interface CategorySelectorModalProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onSelect: (selectedIds: CategoryItem[]) => void;
}

export function CategorySelectorModal({
  open,
  onClose,
  categories,
  onSelect,
}: CategorySelectorModalProps) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [clickedItem, setClickedItem] = React.useState<CategoryItem[]>([]);
  const [expandedIds, setExpandedIds] = React.useState<Set<number>>(new Set());

  const getAllChildIds = (cat: CategoryItem): number[] => {
    let ids: number[] = [cat.id];
    for (const child of cat.children) {
      ids = ids.concat(getAllChildIds(child));
    }
    return ids;
  };

  const toggleSelection = (cat: CategoryItem) => {
    const allIds = getAllChildIds(cat);

    setSelectedIds((prev) => {
      const isSelected = prev.includes(cat.id);
      if (isSelected) {
        // remove parent + all children
        return prev.filter((id) => !allIds.includes(id));
      } else {
        // add parent + all children
        return [...prev, ...allIds];
      }
    });

    setClickedItem((prev) =>
      prev.includes(cat)
        ? prev.filter((item) => item.id !== cat.id)
        : [...prev, cat]
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Recursive tree node
  const TreeNode: React.FC<{ cat: CategoryItem; level?: number }> = ({
    cat,
    level = 0,
  }) => {
    const isExpanded = expandedIds.has(cat.id);

    return (
      <div>
        <div
          className="flex items-center gap-2 py-1 cursor-pointer"
          style={{ paddingLeft: level * 16 }}
        >
          {cat.children.length > 0 && (
            <button
              onClick={() => toggleExpand(cat.id)}
              className="flex items-center justify-center w-4 h-4"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
          {cat.children.length === 0 && <span className="w-4" />}{" "}
          {/* empty spacer for leaf nodes */}
          <Checkbox
            checked={selectedIds.includes(cat.id)}
            onCheckedChange={() => toggleSelection(cat)}
          />
          <button
            className="cursor-pointer"
            onClick={() => toggleExpand(cat.id)}
          >
            <span>{cat.name}</span>
          </button>
        </div>
        {isExpanded &&
          cat.children.map((child) => (
            <TreeNode key={child.id} cat={child} level={level + 1} />
          ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-4">
        <DialogHeader>
          <DialogTitle>Select Categories</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] w-full border rounded-md p-2">
          {categories.map((cat) => (
            <TreeNode key={cat.id} cat={cat} />
          ))}
        </ScrollArea>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSelect(clickedItem); // return only clicked items
              onClose();
            }}
          >
            Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
