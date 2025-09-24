'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { getLayout, deleteLayout, } from '@/redux/features/layout/layout';
import { clearLayoutDeleteState, clearLayoutState, } from '@/redux/features/layout/layoutSlice';
import LayoutCard from '@/app/_components/layout/LayoutCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';

export default function LayoutsPage() {
  const dispatch = useAppDispatch();
  const storeId = useAppSelector((state) => state.store?.storeDetailData?.id);
  const {
    layoutData: layouts,
    layoutStateLoading: isLoading,
    layoutError: error,
    layoutDeleteData,
    layoutDeleteError,
  } = useAppSelector((state) => state.layout);

  // useEffect(() => {
  //   if (storeId) {
  //     dispatch(getLayout(storeId));
  //   }
  //   return () => {
  //     dispatch(clearLayoutState());
  //   }
  // }, [dispatch, storeId]);

  useEffect(() => {
    if (layoutDeleteData) {
      toast.success("Layout deleted successfully.", { richColors: true })
      dispatch(clearLayoutDeleteState());
    }
    if (layoutDeleteError) {
      toast.error(layoutDeleteError, { richColors: true })
      dispatch(clearLayoutDeleteState());
    }
  }, [layoutDeleteData, layoutDeleteError, dispatch, storeId]);

  const handleDelete = (id: number) => {
    if (storeId) {
      dispatch(deleteLayout({ s_id: storeId, l_id: id }));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-destructive text-center">{error}</p>;
    }

    if (!layouts || layouts.length === 0) {
      return (
        <div className="text-center py-12 border-dashed border-2 rounded-lg">
          <h3 className="text-xl font-semibold">No Layouts Available</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Get started by creating a new layout for your store.
          </p>
          <Button asChild>
            <Link href="/dashboard/layout/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Layout
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {layouts.map((layout) => (
          <LayoutCard
            key={layout.id}
            layout={layout}
            onDelete={handleDelete}
            isDeleting={isLoading}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <>
        <PageHeader
          title='Layouts'
          subtitle='Layout define how you discounts product will be shown to the users.'
          herf={"/dashboard/layout/create"}
        />
      </>
      {renderContent()}
    </div>
  );
}
