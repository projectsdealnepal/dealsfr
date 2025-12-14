"use client";

import { Badge } from "@/components/ui/badge";
import { OrderItem } from "@/redux/features/order/types";
import { OrderDetailSheet } from "./OrderDetailSheet";
import { StatusSelect } from "./StatusSelect";

interface OrdersTableProps {
  orders: OrderItem[] | null;
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toISOString().slice(0, 10);

  // const getStatusVariant = (status: string) => {
  //   if (status === "completed" || status === "success") return "default";
  //   if (status === "cancelled") return "destructive";
  //   return "secondary"; // pending, processing, etc
  // };

  const getFulfillmentType = (summary: any) => {
    if (summary.pickup === 1) return "Pickup";
    if (summary.delivery === 1) return "Delivery";
    return "Unknown";
  };

  return (
    <div className="rounded-lg border overflow-x-auto">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Pickup Code
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Fulfillment
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {orders && orders.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="py-10 text-center text-muted-foreground"
              >
                <p className="text-lg font-medium">No data available</p>
              </td>
            </tr>
          )}

          {orders &&
            orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-4 font-medium text-sm">{order.id}</td>

                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {formatDate(order.created_at)}
                </td>

                <td className="px-4 py-4 text-sm">
                  {order.customer.first_name} {order.customer.last_name}
                </td>

                <td className="px-4 py-4 font-medium text-sm">
                  ${order.total_amount}
                </td>

                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {order.fulfillment_summary.pickup === 1
                    ? order.pickup_code
                    : "-"}
                </td>

                <td className="px-4 py-4 text-sm">{order.item_count}</td>

                <td className="px-4 py-4">
                  <Badge>{getFulfillmentType(order.fulfillment_summary)}</Badge>
                </td>

                <td className="px-4 py-4">
                  <StatusSelect value={order.status} id={order.id} />
                </td>

                <td className="px-4 py-4">
                  <OrderDetailSheet id={order.id} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
