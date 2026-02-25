"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    X, LogOut, LayoutDashboard, FileText, Upload,
    Users, DollarSign, ShoppingCart, MonitorSmartphone, Settings, Lock
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface MobileNavProps {
    isOpen: boolean
    onClose: () => void
    isAdmin?: boolean
}

const userItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: ShoppingCart, label: "Store", href: "/dashboard/store" },
    { icon: Lock, label: "My Vault", href: "/dashboard/vault" },
    { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
    { icon: MonitorSmartphone, label: "Devices", href: "/dashboard/devices" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

const adminItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "Inventory", href: "/dashboard/admin-materials" },
    { icon: Upload, label: "Deploy Asset", href: "/dashboard/upload" },
    { icon: LayoutDashboard, label: "Packages", href: "/dashboard/packages" },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: DollarSign, label: "Sales", href: "/dashboard/sales" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function MobileNav({ isOpen, onClose, isAdmin }: MobileNavProps) {
    const pathname = usePathname()
    const { logout } = useAuth()
    const items = isAdmin ? adminItems : userItems

    useEffect(() => { onClose() }, [pathname])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset"
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-[#0a0e1a]/80 transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-[#111827] border-r border-[#1e2d45] p-5 transition-transform duration-300 ease-in-out md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between mb-7">
                    <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
                        <div className="h-8 w-8 rounded-lg overflow-hidden border border-[#1e2d45]">
                            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-[#f0f2f5]">All Government</span>
                            <span className="text-[8px] font-bold text-[#c9a84c] tracking-[0.2em] uppercase mt-0.5">Alerts</span>
                        </div>
                    </Link>
                    <button onClick={onClose} className="text-[#4a5a70] hover:text-[#f0f2f5] transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="space-y-0.5">
                    {items.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all border-l-2",
                                    isActive
                                        ? "bg-[#1a2235] text-[#f0f2f5] border-[#c9a84c]"
                                        : "text-[#8a9bb0] hover:bg-[#1a2235] hover:text-[#f0f2f5] border-transparent"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#c9a84c]" : "text-[#4a5a70]")} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-8 left-5 right-5 border-t border-[#1e2d45] pt-4">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#8a9bb0] hover:bg-[#e05252]/10 hover:text-[#e05252] transition-all border-l-2 border-transparent"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}
