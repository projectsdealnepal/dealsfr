"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ProductItem } from "@/redux/features/product/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ProductItem>[] = [
  {
    id: "select",
    // header: "S.N.",
    // header: ({ table }) => (
    //   <Checkbox
    //     checked={table.getIsAllPageRowsSelected()}
    //     onCheckedChange={(value) => {
    //       table.toggleAllPageRowsSelected(!!value)
    //     }}
    //     aria-label="Select all"
    //   />
    // ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected()
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 32,
  },
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false,
    cell: ({ row }) => (row.original.id)
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: false,
  },
  // {
  //   accessorKey: "description",
  //   header: "Description",
  //   enableHiding: true,
  // },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name || "-",
    enableSorting: false,
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => row.original.brand?.name || "-",
    enableSorting: false,
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={row.original.image || "/placeholder.svg"}
        alt={row.original.name || "Product image"}
        className="w-12 h-12 object-cover rounded"
        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "is_available",
    header: "Available",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs ${row.original.is_available
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
          }`}
      >
        {row.original.is_available ? "Yes" : "No"}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "active_discount",
    header: "Active Discount",
    cell: ({ row }) => row.original.active_discount?.name || "None",
    enableSorting: false,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) =>
      row.original.created_at
        ? new Date(row.original.created_at).toLocaleDateString()
        : "-",
    enableSorting: false,
  },
];

