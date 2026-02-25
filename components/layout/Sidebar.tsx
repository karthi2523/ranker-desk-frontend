"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard, ShoppingCart, MonitorSmartphone,
    Settings, LogOut, Upload, Users, DollarSign, Lock
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: ShoppingCart, label: "Store", href: "/dashboard/store", roles: ["USER"] },
    { icon: Lock, label: "My Vault", href: "/dashboard/vault", roles: ["USER"] },
    { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders", roles: ["USER"] },
    { icon: MonitorSmartphone, label: "Devices", href: "/dashboard/devices", roles: ["USER"] },
    { icon: Upload, label: "Upload", href: "/dashboard/upload", roles: ["ADMIN"] },
    { icon: Users, label: "Users", href: "/dashboard/users", roles: ["ADMIN"] },
    { icon: DollarSign, label: "Sales", href: "/dashboard/sales", roles: ["ADMIN"] },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function Sidebar() {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    const filteredItems = sidebarItems.filter(item =>
        !item.roles || item.roles.includes(user?.role || "")
    )

    return (
        <aside className="hidden w-60 h-screen sticky top-0 flex-col border-r border-[#1e2d45] bg-[#111827] md:flex">
            {/* Logo */}
            <div className="flex h-14 items-center border-b border-[#1e2d45] px-5">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg overflow-hidden border border-[#1e2d45] shrink-0">
                        <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-bold text-[#f0f2f5] tracking-tight">All Government</span>
                        <span className="text-[8px] font-bold text-[#c9a84c] tracking-[0.2em] uppercase mt-0.5">Alerts</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 border-l-2",
                                isActive
                                    ? "bg-[#1a2235] text-[#f0f2f5] border-[#c9a84c]"
                                    : "text-[#8a9bb0] hover:bg-[#1a2235] hover:text-[#f0f2f5] border-transparent"
                            )}
                        >
                            <item.icon className={cn(
                                "h-4 w-4 shrink-0 transition-colors",
                                isActive ? "text-[#c9a84c]" : "text-[#4a5a70] group-hover:text-[#8a9bb0]"
                            )} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="border-t border-[#1e2d45] p-3">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#8a9bb0] transition-all hover:bg-[#e05252]/10 hover:text-[#e05252] border-l-2 border-transparent"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
