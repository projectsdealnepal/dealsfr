'use client'
import { getProducts } from "@/redux/features/product/product"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getCategories } from "@/redux/features/category/category"


const AddProducts = () => {
  const dispatch = useAppDispatch()
  const { productData } = useAppSelector(s => s.product)
  const { storeDetailData } = useAppSelector(s => s.store)

  console.log({ productData })

  useEffect(() => {
    if (storeDetailData) {
      dispatch(getProducts(storeDetailData?.id))
      dispatch(getCategories())

    }
    return () => {
    }
  }, [storeDetailData])



  return (
    <div className="container mx-auto py-10">
      {productData && (
        <DataTable columns={columns} data={productData} />
      )}
    </div>
  )
}
export default AddProducts 
