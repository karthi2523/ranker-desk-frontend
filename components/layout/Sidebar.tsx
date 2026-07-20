"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard, Library, ShoppingCart, MonitorSmartphone,
    Settings, LogOut, Upload, Users, DollarSign, Lock, Shield
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: ShoppingCart, label: "Buy Materials", href: "/dashboard/store", roles: ["USER"] },
    { icon: Lock, label: "My Downloads", href: "/dashboard/vault", roles: ["USER"] },
    { icon: ShoppingCart, label: "Purchase History", href: "/dashboard/orders", roles: ["USER"] },
    { icon: MonitorSmartphone, label: "My Devices", href: "/dashboard/devices", roles: ["USER"] },
    { icon: Upload, label: "Upload File", href: "/dashboard/upload", roles: ["ADMIN"] },
    { icon: Users, label: "Students", href: "/dashboard/users", roles: ["ADMIN"] },
    { icon: DollarSign, label: "Sales & Revenue", href: "/dashboard/sales", roles: ["ADMIN"] },
    { icon: Settings, label: "Account Settings", href: "/dashboard/settings" },
]

export function Sidebar() {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    const filteredItems = sidebarItems.filter(item =>
        !item.roles || item.roles.includes(user?.role || "")
    )

    return (
        <aside className="hidden w-64 h-screen sticky top-0 flex-col border-r border-border bg-surface md:flex">
            <div className="flex h-20 items-center border-b border-border px-6">
                <Link href="/dashboard" className="group flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center transition-transform duration-300 group-hover:border-border">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-6 w-6 object-contain transition-opacity"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-black bg-clip-text text-transparent bg-[linear-gradient(110deg,#0f172a,45%,#c9a84c,55%,#0f172a)] dark:bg-[linear-gradient(110deg,#ffffff,45%,#c9a84c,55%,#ffffff)] bg-[length:200%_100%] animate-shimmer whitespace-nowrap leading-none tracking-tighter">
                            All Government Alerts
                        </h1>
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
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold tracking-tight transition-colors duration-200",
                                isActive
                                    ? "bg-surface-raised text-text-primary"
                                    : "text-text-secondary hover:bg-surface-raised hover:text-text-primary"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                            )} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-border p-4">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-text-secondary transition-colors hover:bg-surface-raised hover:text-error group"
                >
                    <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
