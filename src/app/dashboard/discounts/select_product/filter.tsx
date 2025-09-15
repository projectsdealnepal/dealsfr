import { Input } from "@/components/ui/input"
import { Column, Table } from "@tanstack/react-table"

export default function Filter({
  column,
  table,
}: {
  column: Column<any, any>
  table: Table<any>
}) {

  const columnFilterValue = column.getFilterValue()

  return (
    <Input
      className="w-36 h-5 mb-1 font-normal border  rounded-none"
      onChange={e => column.setFilterValue(e.target.value)}
      onClick={e => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  )
}
