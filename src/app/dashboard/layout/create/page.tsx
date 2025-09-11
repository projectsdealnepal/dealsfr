'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createLayout } from '@/redux/features/layout/layout';
import { clearLayoutCreateState } from '@/redux/features/layout/layoutSlice';
import { LayoutCreatePayload } from '@/redux/features/layout/types';
import InteractiveLayoutBuilder from '@/app/_components/layout/InteractiveLayoutBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X, Grid3X3 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type FormData = {
  name: string;
  array: number[];
};

export default function CreateLayoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const storeId = useAppSelector((state) => state.store?.storeDetailData?.id);
  const {
    layoutStateLoading,
    layoutCreateData,
    layoutCreateError,
  } = useAppSelector((state) => state.layout);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      array: [2, 1, 3],
    },
  });

  const positions = watch('array');
  const layoutName = watch('name');

  useEffect(() => {
    if (layoutCreateData) {
      toast.success("Layout created successfully!", {
        richColors: true,
        description: "Your new layout has been saved and is ready to use."
      });
      dispatch(clearLayoutCreateState());
      router.push('/dashboard/layout');
    }

    if (layoutCreateError) {
      toast.error("Failed to create layout", {
        richColors: true,
        description: layoutCreateError
      });
      dispatch(clearLayoutCreateState());
    }

    return () => {
      dispatch(clearLayoutCreateState());
    };
  }, [layoutCreateData, layoutCreateError, dispatch, router]);

  const onSubmit = (data: FormData) => {
    if (!storeId) {
      toast.error("Store not found", {
        richColors: true,
        description: "Please select a store first before creating a layout."
      });
      return;
    }

    const payload: LayoutCreatePayload = {
      name: data.name.trim(),
      array: data.array as LayoutCreatePayload['array'],
    };

    dispatch(createLayout({ payload, s_id: storeId }));
  };

  const totalItems = positions.reduce((sum, count) => sum + count, 0);

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
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20">
                <Grid3X3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Create New Layout
                </h1>
                <p className="text-sm text-muted-foreground">
                  Design a custom product display layout for your store
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Layout Details Card */}
          <Card className="shadow-sm border-none rounded-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
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
                      if (value.length === 0) return 'Layout must have at least one row';
                      if (value.some(v => v <= 0)) return 'Each row must have at least one item';
                      if (value.length > 10) return 'Layout cannot exceed 10 rows';
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <div className="space-y-4">
                      <InteractiveLayoutBuilder
                        positions={field.value}
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
                            className="w-6 h-6 rounded border-2 border-primary/40 bg-primary/10 dark:bg-primary/20 transition-colors"
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

            <Button
              type="submit"
              disabled={layoutStateLoading || !isValid}
              className="min-w-[120px]"
            >
              {layoutStateLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Layout
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
