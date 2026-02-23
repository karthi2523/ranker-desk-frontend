"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Upload, Users, DollarSign, LogOut, ShieldAlert, FileText } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const adminSidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "Inventory", href: "/dashboard/admin-materials" },
    { icon: Upload, label: "Deploy Asset", href: "/dashboard/upload" },
    { icon: LayoutDashboard, label: "Packages", href: "/dashboard/packages" },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: DollarSign, label: "Sales", href: "/dashboard/sales" },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <aside className="hidden w-64 h-screen sticky top-0 flex-col border-r border-red-900/20 bg-slate-950/50 backdrop-blur-xl md:flex">
            <div className="flex h-20 items-center border-b border-red-900/20 px-6">
                <Link href="/dashboard" className="group flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-red-500/20 transition-transform duration-300 group-hover:scale-105">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-full w-full object-cover grayscale brightness-125"
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-white tracking-tight group-hover:text-red-400 transition-colors">
                                All Government
                            </span>
                            <span className="text-[10px] bg-red-500 text-white font-black px-1 rounded-sm">ADM</span>
                        </div>
                        <span className="text-[8px] font-bold text-red-500 tracking-[0.2em] uppercase mt-0.5">
                            Security Control
                        </span>
                    </div>
                </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {adminSidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-red-500/10 text-red-500"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t border-red-900/20 p-4">
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

