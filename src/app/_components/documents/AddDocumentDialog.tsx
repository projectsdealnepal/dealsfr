"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface AddDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: { name: string; file: File }) => void;
  isLoading?: boolean;
}

const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    file: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (formData.file && formData.file.type.startsWith("image/")) {
      const url = URL.createObjectURL(formData.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [formData.file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.file) {
      toast.error("Please fill in all fields");
      return;
    }
    onSubmit({ name: formData.name, file: formData.file });
    setFormData({ name: "", file: null });
  };

  const handleClose = () => {
    setFormData({ name: "", file: null });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="text-foreground">
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogDescription>
            Upload a new document to your store. Supported formats: PDF, JPG,
            PNG, GIF, WebP
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter document name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <div className="relative">
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                onChange={handleFileChange}
                required
              />
              <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background text-sm text-muted-foreground px-3 truncate">
                {formData.file?.name ?? "Choose file"}
              </div>
            </div>
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-20 w-auto rounded object-contain"
                />
              </div>
            )}
            <p className="text-sm text-gray-500">
              Maximum file size: 10MB. Supported formats: PDF, JPG, PNG, GIF,
              WebP
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name || !formData.file || isLoading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;
