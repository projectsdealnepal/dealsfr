"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown, Check } from "lucide-react";
import { CategoryItem } from "@/redux/features/category/types";


interface CategorySelectorModalProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onSelect: (selectedIds: CategoryItem) => void;
}

export function CategorySelectorSheet({
  open,
  onClose,
  categories,
  onSelect,
}: CategorySelectorModalProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const getAllChildIds = (cat: CategoryItem): number[] => {
    let ids: number[] = [cat.id];
    for (const child of cat.children) {
      ids = ids.concat(getAllChildIds(child));
    }
    return ids;
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
    const handleCategorySelect = () => {
      console.log("cat", cat)
      onSelect(cat)
      // dispatch(filterProducts({ s_id: storeDetailData?.id || 0, filter: `category=${cat.id}` }))
      onClose()
    }
    return (
      <div>
        <div
          className="flex items-center gap-2 py-1 cursor-pointer hover:bg-accent"
          style={{ paddingLeft: level * 16 }}
        >
          {cat.children.length > 0 && (
            <button
              onClick={() => toggleExpand(cat.id)}
              className="flex items-center justify-center w-4 h-4 cursor-pointer"
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
          <button
            className="cursor-pointer hover:bg-accent"
            onClick={handleCategorySelect}
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl p-4">
        <SheetHeader>
          <SheetTitle>Select Categories</SheetTitle>
        </SheetHeader>

        {/* Only show ScrollArea if search is empty */}
        <ScrollArea className="max-h-[500px] w-full border-none">
          {categories.map((cat) => (
            <TreeNode key={cat.id} cat={cat} />
          ))}
        </ScrollArea>

        {/* <div className="mt-4 flex justify-end gap-2"> */}
        {/*   <Button variant="outline" onClick={onClose}> */}
        {/*     Cancel */}
        {/*   </Button> */}
        {/*   <Button */}
        {/*     onClick={() => { */}
        {/*       onSelect(clickedItem); // return only clicked items */}
        {/*       onClose(); */}
        {/*     }} */}
        {/*   > */}
        {/*     Select */}
        {/*   </Button> */}
        {/* </div> */}
      </SheetContent>
    </Sheet>
  );
}
