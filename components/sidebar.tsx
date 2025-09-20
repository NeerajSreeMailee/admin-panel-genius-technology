"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  FileText
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users
  },
  {
    title: "Quotations",
    href: "/dashboard/quotations",
    icon: FileText
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
            Admin Panel
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}