'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getIndLayout, updateLayout } from '@/redux/features/layout/layout';
import { clearLayoutUpdateState, clearLayoutState, clearIndLayoutState } from '@/redux/features/layout/layoutSlice';
import { LayoutCreatePayload } from '@/redux/features/layout/types';
import InteractiveLayoutBuilder from '@/app/_components/layout/InteractiveLayoutBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Save,
  X,
  Grid3X3,
  Edit3,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const runtime = "edge"

type FormData = {
  name: string;
  array: number[];
};

export default function EditLayoutPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const layoutId = Number(params.id);

  const storeId = useAppSelector((state) => state.store?.storeDetailData?.id);
  const {
    indLayoutData,
    indLayoutError,
    layoutStateLoading,
    layoutUpdateData,
    layoutUpdateError,
  } = useAppSelector((state) => state.layout);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const positions = watch('array');
  const layoutName = watch('name');

  // Load layout data on mount
  useEffect(() => {
    if (storeId && layoutId) {
      dispatch(getIndLayout({ s_id: storeId, l_id: layoutId }));
    }

    return () => {
      dispatch(clearIndLayoutState());
    };
  }, [storeId, layoutId, dispatch]);

  // Reset form when data loads
  useEffect(() => {
    if (indLayoutData) {
      reset({
        name: indLayoutData.name,
        array: indLayoutData.array as number[],
      });
    }
  }, [indLayoutData, reset]);

  // Handle update response
  useEffect(() => {
    if (layoutUpdateData) {
      toast.success("Layout updated successfully!", {
        richColors: true,
        description: "Your changes have been saved and applied to the layout."
      });
      dispatch(clearLayoutUpdateState());
      router.push('/dashboard/layout');
    }

    if (layoutUpdateError) {
      toast.error("Failed to update layout", {
        richColors: true,
        description: layoutUpdateError
      });
      dispatch(clearLayoutUpdateState());
    }

    return () => {
      dispatch(clearLayoutUpdateState());
    };
  }, [layoutUpdateData, layoutUpdateError, dispatch, router]);

  const onSubmit = (data: FormData) => {
    if (!storeId) {
      toast.error("Store not found", {
        richColors: true,
        description: "Please select a store first before updating the layout."
      });
      return;
    }

    if (!layoutId) {
      toast.error("Layout ID not found", {
        richColors: true,
        description: "Invalid layout identifier. Please try again."
      });
      return;
    }

    const payload: LayoutCreatePayload = {
      name: data.name.trim(),
      array: data.array as LayoutCreatePayload['array'],
    };

    dispatch(updateLayout({ payload, s_id: storeId, l_id: layoutId }));
  };

  const totalItems = positions?.reduce((sum, count) => sum + count, 0) || 0;

  // Loading state
  if (layoutStateLoading && !indLayoutData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          </div>

          <Separator />

          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (indLayoutError || !indLayoutData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-6 w-fit hover:bg-muted"
          >
            <Link href="/dashboard/layout" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Layouts
            </Link>
          </Button>

          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {indLayoutError || "Layout not found. The layout you're looking for doesn't exist or has been deleted."}
            </AlertDescription>
          </Alert>

          <div className="text-center mt-6">
            <Button variant="default" asChild>
              <Link href="/dashboard/layout">
                Return to Layouts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-fit hover:bg-muted"
          >
            <Link href="/dashboard/layout" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Layouts
            </Link>
          </Button>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <Edit3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Edit Layout
                </h1>
                <p className="text-sm text-muted-foreground">
                  Modify your existing product display layout
                </p>
              </div>
            </div>

            {indLayoutData && (
              <div className="flex items-center gap-2 ml-13">
                <Badge variant="outline" className="text-xs">
                  ID: {layoutId}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {indLayoutData.name}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Layout Details Card */}
          <Card className="shadow-sm border-none rounded-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Grid3X3 className="h-5 w-5 text-muted-foreground" />
                Layout Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Layout Name Input */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium">
                  Layout Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter a descriptive name for your layout"
                  className={cn(
                    "transition-colors",
                    errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register('name', {
                    required: 'Layout name is required',
                    minLength: {
                      value: 3,
                      message: 'Layout name must be at least 3 characters'
                    },
                    maxLength: {
                      value: 50,
                      message: 'Layout name must be less than 50 characters'
                    }
                  })}
                />
                {errors.name && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
                {layoutName && !errors.name && (
                  <p className="text-xs text-muted-foreground">
                    {layoutName.length}/50 characters
                  </p>
                )}
              </div>

              {/* Layout Builder */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Layout Pattern *
                </Label>
                <Controller
                  name="array"
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!value || value.length === 0) return 'Layout must have at least one row';
                      if (value.some(v => v <= 0)) return 'Each row must have at least one item';
                      if (value.length > 10) return 'Layout cannot exceed 10 rows';
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <div className="space-y-4">
                      <InteractiveLayoutBuilder
                        positions={field.value || []}
                        setPositions={field.onChange}
                      />
                      {errors.array && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.array.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Layout Preview */}
              {positions && positions.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">
                      Layout Preview
                    </Label>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {positions.length} {positions.length === 1 ? 'Row' : 'Rows'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                      </Badge>
                      {isDirty && (
                        <Badge variant="default" className="text-xs bg-orange-500 hover:bg-orange-600">
                          Modified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {positions.map((count, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex items-center gap-1"
                      >
                        <span className="text-xs text-muted-foreground w-12">
                          Row {rowIndex + 1}:
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: count }).map((_, colIndex) => (
                            <div
                              key={colIndex}
                              className="w-6 h-6 rounded border-2 border-orange-400/40 bg-orange-100/50 dark:bg-orange-900/20 transition-colors"
                              title={`Item ${colIndex + 1} in row ${rowIndex + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <code className="text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded border">
                      Pattern: [{positions.join(', ')}]
                    </code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={layoutStateLoading}
            >
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              {isDirty && (
                <span className="text-xs text-muted-foreground">
                  Unsaved changes
                </span>
              )}
              <Button
                type="submit"
                disabled={layoutStateLoading || !isValid || !isDirty}
                className="min-w-[140px]"
              >
                {layoutStateLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
