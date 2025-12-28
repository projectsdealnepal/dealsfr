'use client'
import { Input } from "@/components/ui/input"
import { filterProducts } from "@/redux/features/product/product"
import { useAppDispatch } from "@/redux/hooks"
import { Search } from "lucide-react"
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect } from "react"

const AddProduct = () => {
  const dispatch = useAppDispatch()

  // Fetch data when any parameter changes

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center min-h-screen ">
      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">
            Add Product
          </h1>
          <p className="text-slate-600 text-lg">
            Search and add products to your inventory
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            onChange={handleSearchInput}
            placeholder="Search for products..."
            className="pl-12 h-14 text-lg bg-white shadow-lg border-slate-200 focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

export default AddProduct
