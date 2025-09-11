"use client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";

interface InteractiveLayoutBuilderProps {
  positions: number[];
  setPositions: (positions: number[]) => void;
}

const MAX_ROWS = 4;
const MAX_ITEMS_PER_ROW = 5;

export default function InteractiveLayoutBuilder({
  positions = [2, 1, 3],
  setPositions,
}: InteractiveLayoutBuilderProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleAddItem = (rowIndex: number) => {
    const newPositions = [...positions];
    if (newPositions[rowIndex] < MAX_ITEMS_PER_ROW) {
      newPositions[rowIndex]++;
      setPositions(newPositions);
    }
  };

  const handleRemoveItem = (rowIndex: number) => {
    const newPositions = [...positions];
    if (newPositions[rowIndex] > 1) {
      newPositions[rowIndex]--;
      setPositions(newPositions);
    } else {
      if (positions.length > 1) {
        handleRemoveRow(rowIndex);
      }
    }
  };

  const handleAddRow = () => {
    if (positions.length < MAX_ROWS) {
      setPositions([...positions, 1]);
    }
  };

  const handleRemoveRow = (rowIndex: number) => {
    if (positions.length > 1) {
      const newPositions = positions.filter((_, index) => index !== rowIndex);
      setPositions(newPositions);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-sm border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">Layout Builder</h3>
          <p className="text-sm text-muted-foreground">Design your product layout with drag and drop simplicity</p>
        </div>

        <div className="space-y-4">
          {positions.map((itemCount, rowIndex) => (
            <div
              key={rowIndex}
              className="group relative"
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="flex items-center gap-3">
                {/* Row handle */}
                <div className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Row content */}
                <div className="flex-1 bg-muted/30 rounded-lg p-4 border transition-all duration-200 hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    {Array.from({ length: itemCount }).map((_, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="relative group/item flex-1 h-20 bg-card border rounded-lg flex items-center justify-center min-w-[70px] shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20"
                      >
                        <div className="text-center">
                          <div className="w-6 h-6 bg-muted rounded mx-auto mb-1"></div>
                          <span className="text-xs font-medium text-muted-foreground">Product</span>
                        </div>

                        {/* Remove item button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="absolute -top-2 -right-2 h-6 w-6 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-200 shadow-sm border border-destructive/20"
                          onClick={() => handleRemoveItem(rowIndex)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {/* Add item button */}
                    {itemCount < MAX_ITEMS_PER_ROW && (
                      <Button
                        variant="outline"
                        type="button"
                        className="h-20 w-20 flex-shrink-0 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 bg-card/50"
                        onClick={() => handleAddItem(rowIndex)}
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Remove row button */}
                {positions.length > 1 && (
                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    className={`w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 ${hoveredRow === rowIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    onClick={() => handleRemoveRow(rowIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Add row button */}
          {positions.length < MAX_ROWS && (
            <div className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={handleAddRow}
                className="w-full h-12 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 bg-muted/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Row
              </Button>
            </div>
          )}
        </div>

        {/* Layout summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{positions.length} row{positions.length !== 1 ? 's' : ''}</span>
            <span>{positions.reduce((sum, count) => sum + count, 0)} product{positions.reduce((sum, count) => sum + count, 0) !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
