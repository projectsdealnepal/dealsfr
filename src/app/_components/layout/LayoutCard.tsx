'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutItem } from '@/redux/features/layout/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Trash2, Edit } from 'lucide-react';

interface LayoutCardProps {
  layout: LayoutItem;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function LayoutCard({ layout, onDelete, isDeleting }: LayoutCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(layout.id);
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{layout.name}</CardTitle>
        <CardDescription>
          Pattern: [{layout.array.join(', ')}]
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-md">
          {layout.array.map((count, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-0.5">
              {Array.from({ length: count }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="w-4 h-4 bg-primary/30 border border-primary/50 rounded-sm"
                />
              ))}
              {rowIndex < layout.array.length - 1 && (
                <div className="w-px h-4 bg-border mx-1 self-center" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/layout/edit/${layout.id}`}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                {
                  `This action cannot be undone. This will permanently delete the layout
named "${layout.name}".`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
