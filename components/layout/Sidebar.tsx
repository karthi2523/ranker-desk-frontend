"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Library, ShoppingCart, MonitorSmartphone, Settings, LogOut, Shield, Upload, Users, DollarSign } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: ShoppingCart, label: "Store", href: "/dashboard/store", roles: ["USER"] },
    { icon: Library, label: "My Materials", href: "/dashboard/materials", roles: ["USER"] },
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
        <aside className="hidden w-64 h-screen sticky top-0 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl md:flex">
            <div className="flex h-20 items-center border-b border-slate-800 px-6">
                <Link href="/dashboard" className="group flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-white/5 transition-transform duration-300 group-hover:scale-105">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                            All Government
                        </span>
                        <span className="text-[8px] font-bold text-indigo-500 tracking-[0.2em] uppercase mt-0.5">
                            Alerts Platform
                        </span>
                    </div>
                </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-500"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
