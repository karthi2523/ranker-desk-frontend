"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Upload, Users, DollarSign, LogOut, ShieldAlert, FileText, Layers, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const adminSidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "Inventory", href: "/dashboard/admin-materials" },
    { icon: Upload, label: "Deploy Asset", href: "/dashboard/upload" },
    { icon: Layers, label: "Packages", href: "/dashboard/packages" },
    { icon: Users, label: "Personnel", href: "/dashboard/users" },
    { icon: DollarSign, label: "Financials", href: "/dashboard/sales" },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    return (
        <aside className="hidden w-72 h-screen sticky top-0 flex-col border-r border-[#1e2d45] bg-[#0a0e1a] md:flex select-none">
            {/* Admin Brand Area */}
            <div className="flex h-24 items-center px-8 border-b border-[#1e2d45]/50">
                <Link href="/dashboard" className="group flex items-center gap-4">
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-[#1e2d45] bg-slate-900 flex items-center justify-center transition-all duration-500 group-hover:border-[#c9a84c]/50 group-hover:scale-105">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-9 w-9 object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#f0f2f5] tracking-tight uppercase group-hover:text-[#c9a84c] transition-colors">
                                All Government
                            </span>
                            <span className="text-[9px] bg-[#e05252] text-white font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm">ADMIN</span>
                        </div>
                        <span className="text-[9px] font-black text-[#e05252] tracking-[0.25em] uppercase mt-1">
                            SECURITY CONTROL
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation Registry */}
            <div className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-4">
                    <p className="text-[10px] font-black text-[#4a5a70] uppercase tracking-[0.3em]">Command Hierarchy</p>
                </div>
                <nav className="space-y-1.5">
                    {adminSidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group relative flex items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.15em] transition-all duration-300",
                                    isActive
                                        ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 shadow-lg shadow-gold-950/10"
                                        : "text-[#8a9bb0] hover:bg-[#1e2d45]/30 hover:text-[#f0f2f5]"
                                )}
                            >
                                <div className="flex items-center gap-3.5">
                                    <item.icon className={cn(
                                        "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                                        isActive ? "text-[#c9a84c]" : "text-[#4a5a70] group-hover:text-[#c9a84c]/70"
                                    )} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#c9a84c] shadow-[0_0_8px_#c9a84c]" />
                                )}
                                {!isActive && (
                                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#4a5a70]" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Administrative Entity Info */}
            <div className="p-4 border-t border-[#1e2d45]/50 bg-slate-900/10">
                <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-[#0a0e1a] border border-[#1e2d45]">
                    <div className="h-8 w-8 rounded-lg bg-[#e05252]/10 border border-[#e05252]/20 flex items-center justify-center">
                        <ShieldAlert className="h-4 w-4 text-[#e05252]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-white truncate uppercase">{user?.name || 'ADMIN'}</p>
                        <p className="text-[10px] font-bold text-[#4a5a70] truncate tracking-tighter uppercase">Authorized User</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#4a5a70] transition-all duration-300 hover:bg-[#e05252]/10 hover:text-[#e05252] group"
                >
                    <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Terminate Session
                </button>
            </div>
        </aside>
    )
}
