"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import CustomerWebView from "./customer_view_web";
import CustomerMobileView from "./customer_view_mobile";

interface StorePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedView: "web" | "mobile";
  pattern: number[];
}

export default function StorePreviewModal({ isOpen, onClose, selectedView, pattern }: StorePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!fixed !inset-0 !w-screen !h-screen !max-w-none !max-h-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !shadow-none !p-0 !m-0 bg-white flex flex-col"
        showCloseButton={false}
      >
        <DialogHeader className="p-4 bg-white flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-bold text-center">
            Customer Store Preview - {selectedView === "web" ? "Web" : "Mobile"} Version
          </DialogTitle>
          <Button variant="ghost" className="cursor-pointer" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-muted">
          {selectedView === "web" ? (
            <div className="h-full overflow-auto">
              <CustomerWebView pattern={pattern} />
            </div>
          ) : (
            <div className="h-full flex justify-center items-start pt-8 overflow-hidden">
              <div className="w-full max-w-sm h-full rounded-lg shadow-xl overflow-y-auto">
                <CustomerMobileView pattern={pattern} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
