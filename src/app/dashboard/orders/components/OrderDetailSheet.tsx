'use client'

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Eye, User, Package, Clock, FileText, Calendar, DollarSign, Store, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { OrderDetail } from "@/redux/features/order/types"
import { getOrderDetail } from "@/redux/features/order/order"

export function OrderDetailSheet({ id }: { id: number }) {
  const dispatch = useAppDispatch()
  const { storeDetailData } = useAppSelector(s => s.store)
  const { orderDetailData, } = useAppSelector(s => s.order)

  const handleOrderView = () => {
    if (storeDetailData) {
      dispatch(getOrderDetail({ s_id: storeDetailData.id, o_id: id }))
    }
  }


  return (
    <Sheet>

      <SheetTrigger asChild>
        <Button onClick={handleOrderView} variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {orderDetailData ? <SheetContent className="w-full sm:max-w-2xl px-4 overflow-y-auto bg-background">
        {/* Header */}
        <SheetHeader className="border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-2xl font-semibold tracking-tight">
                Order #{orderDetailData.id}
              </SheetTitle>
              <SheetDescription className="mt-1.5">
                Placed on {orderDetailData.created_at.slice(0, 10)}
              </SheetDescription>
            </div>
            <Badge variant={orderDetailData.status === "Completed" ? "default" : "secondary"} className="text-sm font-medium px-3">
              {orderDetailData.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-6">

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5" />
                Total Amount
              </p>
              <p className="text-2xl font-bold">{orderDetailData.total_amount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" />
                Pickup Code
              </p>
              <p className="text-2xl font-mono font-bold tracking-wider">{orderDetailData.pickup_code}</p>
            </div>
          </div>

          <Separator />
          {/* Customer & Branch - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="h-4 w-4 text-muted-foreground" />
                Customer
              </div>
              <div className="pl-6 border-l-2 border-muted">
                <p className="font-medium text-foreground">
                  {orderDetailData.customer.first_name} {orderDetailData.customer.last_name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{orderDetailData.customer.email}</p>
                {orderDetailData.customer.email && (
                  <p className="text-sm text-muted-foreground">{orderDetailData.customer.email}</p>
                )}
              </div>
            </div>

            {/* Pickup Location */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Store className="h-4 w-4 text-muted-foreground" />
                Pickup Location
              </div>
              <div className="pl-6 border-l-2 border-muted">
                <p className="font-medium">{orderDetailData.branch?.name}</p>
                <p className="text-sm text-muted-foreground">{orderDetailData.branch?.city}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{orderDetailData.branch?.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Package className="h-4 w-4 text-muted-foreground" />
              Order Items
            </div>
            <div className="space-y-3">
              {orderDetailData.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.quantity} × {item.unit_price}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {(parseFloat(item.unit_price.replace("$", "")) * item.quantity).toFixed(2)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.fulfillment_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Timeline - Already great, just refined */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Activity Timeline
            </div>
            <div className="relative pl-8">
              {orderDetailData.timeline.map((t, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* Dot */}
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center">
                    <div className={`
h-2.5 w-2.5 rounded-full 
${index === 0 ? 'bg-primary ring-4 ring-background' : 'bg-muted-foreground/40'}
transition-all
`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{t.event}</p>
                      <p className="text-sm text-muted-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {t.timestamp.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          {orderDetailData.notes.length > 0 && (
            <>
              <Separator />
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Notes
                </div>
                <div className="space-y-3">
                  {orderDetailData.notes.map((n) => (
                    <div key={n.id} className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm leading-relaxed">{n.note}</p>
                      <p className="text-xs text-muted-foreground mt-2">{n.created_at}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 border-t pt-6">
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" size="lg" className="w-full">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent> : null}
    </Sheet>
  )
}
