'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getOrderList } from '@/redux/features/order/order';
import OrdersTable from './components/OrdersTable';
import StatsCard from './components/StatsCard';
import FilterTabs from './components/FilterTabs';
import PageHeader from '@/components/PageHeader';


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
    <div className="container mx-auto p-4">
      <div className="max-w-7xl space-y-8">
        {/* Header */}
        <PageHeader
          title="Orders"
          subtitle="Manage and review your store orders."
          hasButton={false}
        />

        {/* Orders Section */}
        < Card >
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
