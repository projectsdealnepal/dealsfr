'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/redux/hooks";
import { CheckCircle, Clock, Package, ShoppingBag, Truck, XCircle } from "lucide-react"

const StoreInsight = () => {
  const { orderSummaryData } = useAppSelector(s => s.order)

  // Order status items
  const orderStatusItems = [
    { label: "Pending", key: "pending", icon: Clock, color: "text-yellow-600" },
    { label: "Confirmed", key: "confirmed", icon: CheckCircle, color: "text-blue-600" },
    { label: "Ready For Pickup", key: "ready_for_pickup", icon: Package, color: "text-indigo-600" },
    { label: "Picked Up", key: "picked_up", icon: Truck, color: "text-cyan-600" },
    { label: "Delivered", key: "delivered", icon: CheckCircle, color: "text-green-600" },
    { label: "Cancelled", key: "cancelled", icon: XCircle, color: "text-red-600" },
    { label: "Completed", key: "completed", icon: CheckCircle, color: "text-emerald-600" }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">Store Insights</h2>


      {/* Overview Cards */}
      {orderSummaryData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{orderSummaryData.total_orders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">
                NPR. {orderSummaryData.total_revenue}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Order Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Order Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {orderStatusItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-row items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <item.icon className={`h-6 w-6 mb-2 ${item.color}`} />
                  <div className="text-sm text-foreground text-center mb-1">
                    {item.label}
                  </div>
                </div>
                <p className={`text-3xl font-semibold `}>
                  {(orderSummaryData as Record<string, any>)?.[item.key] ?? 0}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StoreInsight; 
