"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { X, LogOut, ShieldAlert, LayoutDashboard, FileText, Upload, Users, DollarSign, ShoppingCart, Library, MonitorSmartphone, Settings } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface MobileNavProps {
    isOpen: boolean
    onClose: () => void
    isAdmin?: boolean
}

const userItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: ShoppingCart, label: "Store", href: "/dashboard/store" },
    { icon: Library, label: "My Materials", href: "/dashboard/materials" },
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

    // Close when route changes
    useEffect(() => {
        onClose()
    }, [pathname]) // Only trigger when pathname itself changes

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between mb-8">
                    <Link href="/dashboard" className="group flex items-center gap-3" onClick={onClose}>
                        <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-white/5 transition-transform duration-300 group-hover:scale-105">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-black text-white tracking-tight">
                                All Government
                            </span>
                            <span className="text-[8px] font-bold text-indigo-500 tracking-[0.2em] uppercase mt-0.5">
                                Alerts Platform
                            </span>
                        </div>
                    </Link>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="space-y-2">
                    {items.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                                    isActive
                                        ? isAdmin
                                            ? "bg-red-500/10 text-red-500 shadow-[inset_0_0_20px_-10px_rgba(239,68,68,0.5)]"
                                            : "bg-indigo-500/10 text-indigo-500 shadow-[inset_0_0_20px_-10px_rgba(79,70,229,0.5)]"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-10 left-6 right-6 pt-6 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
                    >
                        <LogOut className="h-5 w-5" />
                        Terminate Session
                    </button>
                </div>
            </div>
        </>
    )
}
