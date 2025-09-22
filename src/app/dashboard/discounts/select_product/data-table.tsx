"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  X
} from "lucide-react";
import Filter from "./filter";
import { CategorySelectorSheet } from "./CategoriesSheet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { filterProducts, getProducts } from "@/redux/features/product/product";
import { CategoryItem } from "@/redux/features/category/types";
import { ProductItem } from "@/redux/features/product/types";
import { addProductOnDiscount, setRowSelection } from "@/redux/features/product/productSlice";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selected, setSelected] = useState<CategoryItem>();
  const { categoryData } = useAppSelector(s => s.category)
  const { storeDetailData } = useAppSelector(s => s.store)
  const { productData, productList, productLoading, addedDisountProducts, rowSelection } = useAppSelector(s => s.product)
  const dispatch = useAppDispatch()


  // Build query parameters for server requests
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    // Pagination
    params.set('page', (pagination.pageIndex + 1).toString());
    params.set('page_size', pagination.pageSize.toString());

    // Sorting
    if (sorting.length > 0) {
      const sortParam = sorting.map(sort =>
        sort.desc ? `-${sort.id}` : sort.id
      ).join(',');
      params.set('ordering', sortParam);
    }

    // Column filters (search)
    const nameFilter = columnFilters.find(filter => filter.id === 'name');
    if (nameFilter && nameFilter.value) {
      params.set('search', nameFilter.value as string);
    }

    // Category filters
    if (selected) {
      params.set('category', selected.id.toString());
    }
    return params.toString();
  }, [pagination, sorting, columnFilters, selected]);

  const handleRowSelectionChange = (updater: any) => {
    const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
    //if the item is new(not present in the rowSelection)
    console.log("newSelection", newSelection);
    const changedRowId = Object.keys(newSelection).find(
      key => newSelection[key] !== rowSelection[key]
    );
    dispatch(setRowSelection(newSelection));

    const value = {
      items: newSelection,
      rowId: changedRowId ? Number(changedRowId) : undefined
    }
    dispatch(addProductOnDiscount(value))
  };
  console.log({ addedDisountProducts })

  // Fetch data when any parameter changes
  useEffect(() => {
    if (storeDetailData?.id) {
      const queryString = buildQueryParams();
      if (queryString) {
        dispatch(filterProducts({
          s_id: storeDetailData.id,
          filter: queryString
        }));
      } else {
        dispatch(getProducts(storeDetailData.id));
      }
    }
  }, [dispatch, storeDetailData?.id, buildQueryParams]);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,   // 🚀 Server-side pagination
    getRowId: (row: any) => row.id.toString(),
    manualSorting: true,      // 🚀 Server-side sorting
    manualFiltering: true,    // 🚀 Server-side filtering
    pageCount: productData ? Math.ceil(productData?.count / pagination.pageSize) : 0,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: handleRowSelectionChange, // Use custom handler
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
  });

  const getSortIcon = (column: any) => {
    if (!column.getCanSort()) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;

    const sortDirection = column.getIsSorted();
    if (sortDirection === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    if (sortDirection === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
  };

  const handleCategorySelect = (items: CategoryItem) => {
    setSelected(items);
    // Reset to first page when filtering
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearCategories = () => {
    setSelected(undefined);
    // Reset to first page when clearing filters
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({
      pageIndex: 0, // Reset to first page when changing page size
      pageSize: newPageSize,
    }));
  };
  const handleGoToPage = (pageNumber: number) => {
    const pageIndex = Math.max(0, Math.min(pageNumber - 1, table.getPageCount() - 1));
    setPagination(prev => ({ ...prev, pageIndex }));
  };

  return (
    <div className="">
      <div className=" rounded-md overscroll-none bg-card">
        <div className="pb-4">
          <div>
            <Button
              onClick={() => setOpen(true)}
              variant={"ghost"}>
              Categories
              <ChevronDown />
            </Button>
          </div>

          {/* Show selected categories */}
          {selected && (
            <div className="relative inline-block group">
              <Button
                onClick={handleClearCategories}
                variant="ghost"
                size="sm"
                className="absolute -top-3 -right-3 hidden group-hover:flex rounded-full h-6 w-6 p-0"
                disabled={productLoading}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                <span
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs"
                >
                  {selected.name}
                </span>
              </div>
            </div>
          )}

          {categoryData && (
            <CategorySelectorSheet
              open={open}
              onClose={() => setOpen(false)}
              categories={categoryData}
              onSelect={(item) => {
                setSelected(item)
                setPagination(prev => ({ ...prev, pageIndex: 0 }));
                handleCategorySelect(item)
                // dispatch(filterProducts({ s_id: storeDetailData?.id || 0, filter: `category=${item.id.toString()}` }))
                console.log("Selected category IDs:", item);
              }}
            />
          )}
        </div>
        <Table className="border mx-auto" >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b  bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12  text-left align-middle font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col gap-2">
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer  select-none flex items-center hover:text-foreground transition-colors"
                              : "flex items-center "
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {header.column.getCanSort() && getSortIcon(header.column)}
                        </div>
                        {header.column.id === 'name' && (
                          <Filter
                            table={table}
                            resetPage={() => setPagination(prev => ({ ...prev, pageIndex: 0 }))}
                            column={header.column}
                          />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-hidden ">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b transition-colors  hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 whitespace-normal break-words py-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center  text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex items-center justify-between space-x-6 lg:space-x-8 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-muted-foreground">
            Rows per page
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
            disabled={productLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-muted-foreground">
            Go to page:
          </p>
          <Input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 1;
              handleGoToPage(page);
            }}
            className="h-8 w-16"
            disabled={productLoading}
          />
        </div>
      </div>

      {/* Row count information */}
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.{" "}
          </>
        )}
        {/* Showing {table.getRowModel().rows.length} of{" "} */}
        {/* {table.getRowCount()} total rows. */}
      </div>
    </div>
  );
}
