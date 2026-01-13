import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ImageIcon, Layout, Percent, Store } from "lucide-react"
import Link from "next/link"

// Quick actions configuration
const quickActions = [
  {
    title: "Discounts",
    icon: Percent,
    href: "/dashboard/discounts",
    color: "bg-green-500/5 hover:bg-green-500/20 text-green-600"
  },
  {
    title: "Layout",
    icon: Layout,
    href: "/dashboard/layout",
    color: "bg-blue-500/5 hover:bg-blue-500/20 text-blue-600"
  },
  {
    title: "Banners",
    icon: ImageIcon,
    href: "/dashboard/banner",
    color: "bg-purple-500/5 hover:bg-purple-500/20 text-purple-600"
  },
  {
    title: "Management",
    icon: Store,
    href: "/dashboard/store_management",
    color: "bg-orange-500/5 hover:bg-orange-500/20 text-orange-600"
  }
];

const QuickAction = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className={`cursor-pointer transition-all hover:shadow-lg ${action.color} border-0`}>
              <CardContent className="p-6 py-2">
                <div className="flex items-start justify-center space-x-4">
                  <div className=" rounded-lg  bg-background/50">
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{action.title}</h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default QuickAction
