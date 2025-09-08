"use client";

import StorePreviewModal from "@/app/_components/previewModel/store_preview_modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchWithAuth } from "@/lib/auth";
import { LayoutCreatePayload } from "@/redux/features/layout/types";
import { useAppSelector } from "@/redux/hooks";
import { Monitor, Smartphone } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface LayoutResponse extends LayoutCreatePayload {
  id: number;
}

export default function StoreLayoutCreatePayload() {
  const storeId = useAppSelector((state) => state.store?.storeDetailData?.id);
  const [layouts, setLayouts] = useState<LayoutResponse[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<number | undefined>(
    undefined
  );
  const [name, setName] = useState("");
  const [positions, setPositions] = useState<number[]>([1, 1, 1]);
  const [selectedView, setSelectedView] = useState<"web" | "mobile">("web");
  const [showPreview, setShowPreview] = useState(false);

  const fetchLayouts = useCallback(async () => {
    if (!storeId) return;
    try {
      const allLayouts: LayoutResponse[] = [];
      const data = await fetchWithAuth<LayoutResponse[]>(`/api/layouts/`);
      allLayouts.push(...data.filter((layout) => layout.store === storeId));
      setLayouts(allLayouts);
    } catch (error) {
      console.error("Failed to fetch layouts", error);
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      fetchLayouts();
    }
  }, []);

  const handleLayoutSelect = (value: string) => {
    const layout = layouts.find((l) => l.id === Number(value));
    if (layout) {
      setSelectedLayoutId(layout.id);
      setName(layout.name);
      setPositions(layout.layout_array as number[]);
    }
  };

  const resetForm = () => {
    setSelectedLayoutId(undefined);
    setName("");
    setPositions([1, 1, 1]);
  };

  const handleSave = async () => {
    if (!storeId) return;
    const payload: LayoutCreatePayload = {
      name,
      layout_array: positions as LayoutCreatePayload["layout_array"],
      store: storeId,
    };
    try {
      if (selectedLayoutId) {
        const updated = await fetchWithAuth<LayoutResponse>(
          `/api/layouts/${selectedLayoutId}`,
          {
            method: "PUT",
            data: payload,
          }
        );
        setLayouts((prev) =>
          prev.map((l) => (l.id === updated.id ? updated : l))
        );
      } else {
        const created = await fetchWithAuth<LayoutResponse>("/api/layouts/", {
          method: "POST",
          data: payload,
        });
        setLayouts((prev) => [...prev, created]);
        setSelectedLayoutId(created.id);
      }
    } catch (error) {
      console.error("Failed to save layout", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedLayoutId) return;
    try {
      await fetchWithAuth(`/api/layouts/${selectedLayoutId}/`, {
        method: "DELETE",
      });
      setLayouts((prev) => prev.filter((l) => l.id !== selectedLayoutId));
      resetForm();
    } catch (error) {
      console.error("Failed to delete layout", error);
    }
  };

  const handlePreviewSubmit = () => {
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <StorePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        selectedView={selectedView}
        pattern={positions}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Store Layout Preview
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Configure how your products will be displayed to customers
            </p>
          </div>
        </header>
        <div className="space-y-8">
          <Card className="p-4 sm:p-6 space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">
              Product Display Layout
            </h2>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Saved Layouts</Label>
              <Select
                value={selectedLayoutId ? selectedLayoutId.toString() : ""}
                onValueChange={handleLayoutSelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a layout" />
                </SelectTrigger>
                <SelectContent>
                  {layouts.map((layout) => (
                    <SelectItem key={layout.id} value={layout.id.toString()}>
                      {layout.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Layout Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Layout name"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Layout Pattern</Label>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                {positions.map((pos, idx) => (
                  <div key={idx} className="text-center">
                    <Label className="block text-sm mb-3 text-muted-foreground">
                      Position {idx + 1}
                    </Label>
                    <RadioGroup
                      value={pos.toString()}
                      onValueChange={(v) => {
                        const copy = [...positions];
                        copy[idx] = Number(v);
                        setPositions(copy);
                      }}
                      className="flex gap-2"
                    >
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="flex flex-col items-center">
                          <RadioGroupItem
                            value={num.toString()}
                            id={`pos${idx}-${num}`}
                            className="mb-2"
                          />
                          <Label
                            htmlFor={`pos${idx}-${num}`}
                            className="text-sm"
                          >
                            {num}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted rounded-lg gap-4 sm:gap-0">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Current Pattern:
                </Label>
                <code className="ml-2 text-sm font-mono bg-background px-2 py-1 rounded">
                  [{positions.join(", ")}]
                </code>
              </div>
              <div className="flex gap-1">
                {positions.map((count, rowIndex) => (
                  <div key={rowIndex} className="flex gap-0.5">
                    {Array.from({ length: count }).map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="w-4 h-4 bg-primary/30 border border-primary/50 rounded-sm"
                      />
                    ))}
                    {rowIndex < positions.length - 1 && (
                      <div className="w-px h-4 bg-border mx-2 self-center" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSave} className="w-full sm:w-auto">
                {selectedLayoutId ? "Update Layout" : "Save Layout"}
              </Button>
              {selectedLayoutId && (
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  Delete Layout
                </Button>
              )}
              <Button
                onClick={resetForm}
                variant="outline"
                className="w-full sm:w-auto"
              >
                New Layout
              </Button>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Preview Options
            </h2>
            <div className="space-y-4">
              <Label className="text-sm font-medium">Select View Type:</Label>
              <RadioGroup
                value={selectedView}
                onValueChange={(value: string) =>
                  setSelectedView(value as "web" | "mobile")
                }
                className="flex flex-col sm:flex-row gap-4 sm:gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="web" id="web" />
                  <Label
                    htmlFor="web"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Monitor className="h-4 w-4" />
                    <span className="text-xs sm:text-sm lg:text-base">
                      Web Version
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label
                    htmlFor="mobile"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="h-4 w-4" />
                    <span className="text-xs sm:text-sm lg:text-base">
                      Mobile Version
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button
                onClick={handlePreviewSubmit}
                className="w-full"
                size="lg"
              >
                Preview Customer Store Layout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
