"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { getOrderList } from "@/redux/features/order/order";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FilterTabs from "./components/FilterTabs";
import OrdersTable from "./components/OrdersTable";
import Pagination from "@/app/_components/PaginationComponent";

export interface GetOrderListParams {
  page: number;
  page_size: number;
  status: string;
  search: string;
}

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState("");
  const { storeDetailData } = useAppSelector((s) => s.store);
  const { filteredOrderList, orderListData } = useAppSelector((s) => s.order);

  const [query, setQuery] = useState<GetOrderListParams>({
    page: 2,
    page_size: 10,
    status: "",
    search: "",
  })
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("storeDetailData", storeDetailData);
    if (storeDetailData) {

      const searchStr = (Object.keys(query) as Array<keyof GetOrderListParams>)
        .reduce((str, k) => {
          const v = query[k]
          if (v == "" || v == 0 || v == null) return str
          return str + `${k}=${query[k]}&`
        }, "")

      dispatch(getOrderList({
        s_id: storeDetailData.id,
        filter: searchStr
      }))
    }
  }, [storeDetailData, query]);



  return (
    <div className="container mx-auto p-4">
      <div className="max-w-7xl space-y-8">
        {/* Header */}
        <PageHeader
          title="Orders"
          subtitle="Manage and review your store orders."
          hasButton={false}
        />


        {/* Orders Section */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FilterTabs
              query={query}
              setQuery={setQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
            <OrdersTable orders={filteredOrderList} />

            <Pagination
              pageSize={query.page_size}
              currentPage={query.page}
              totalProducts={orderListData?.count!}
              onPageChange={(pageNumber: number) => {
                setQuery({
                  ...query,
                  page: pageNumber
                })
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
