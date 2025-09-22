import { Input } from "@/components/ui/input"
import { Column, PaginationState, Table } from "@tanstack/react-table"
import { useEffect, useState } from "react"

export default function Filter({
  column,
  resetPage,
  table,
}: {
  column: Column<any, any>
  table: Table<any>
  resetPage: () => void

}) {
  const columnFilterValue = column.getFilterValue() as string
  const [value, setValue] = useState(columnFilterValue ?? "")

  useEffect(() => {
    const handler = setTimeout(() => {
      resetPage()
      column.setFilterValue(value)
    }, 700)

    return () => {
      clearTimeout(handler)
    }

  }, [value, column])

  return (
    <Input
      className="w-36 h-5 mb-1 font-normal border  rounded-none"
      value={value}
      onChange={e => setValue(e.target.value)}
      onClick={e => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
    />
  )
}

