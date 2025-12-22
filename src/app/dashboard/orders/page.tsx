'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getOrderList } from '@/redux/features/order/order';
import OrdersTable from './components/OrdersTable';
import StatsCard from './components/StatsCard';
import FilterTabs from './components/FilterTabs';


export default function Orders() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { storeDetailData } = useAppSelector(s => s.store)
  const { orderSummaryData, filteredOrderList } = useAppSelector(s => s.order)
  const dispatch = useAppDispatch()



  useEffect(() => {
    if (storeDetailData) {
      dispatch(getOrderList(storeDetailData.id))
    }
  }, [storeDetailData])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Orders</h1>
            <p className="text-sm text-muted-foreground">Jan 1 - Jan 30, 2024</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Overview Stats */}
          <StatsCard title="Total Orders" value={orderSummaryData?.total_orders ?? 0} />
          <StatsCard title="Total Revenue" value={`$${orderSummaryData?.total_revenue ?? 0}`} />
        </div>

        {/* Status Breakdown */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: "Pending", key: "pending" },
                { label: "Confirmed", key: "confirmed" },
                { label: "Ready For Pickup", key: "ready_for_pickup" },
                { label: "Picked Up", key: "picked_up" },
                { label: "Delivered", key: "delivered" },
                { label: "Cancelled", key: "cancelled" },
                { label: "Completed", key: "completed" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-4 border rounded-lg bg-muted/20 flex flex-col items-center"
                >
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-semibold">
                    {(orderSummaryData as Record<string, any>)?.[item.key] ?? 0}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FilterTabs
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
            <OrdersTable orders={filteredOrderList} />

            {/* Pagination */}
            {/* <div className="flex justify-between items-center pt-2"> */}
            {/*   <p className="text-sm text-muted-foreground"> */}
            {/*     Showing {filteredOrders.length} of {ordersData.length} orders */}
            {/*   </p> */}
            {/*   <div className="flex gap-2"> */}
            {/*     <Button variant="outline" size="sm" disabled> */}
            {/*       Previous */}
            {/*     </Button> */}
            {/*     <Button variant="outline" size="sm"> */}
            {/*       Next */}
            {/*     </Button> */}
            {/*   </div> */}
            {/* </div> */}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
