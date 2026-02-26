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
        <aside className="hidden w-72 h-screen sticky top-0 flex-col border-r border-border bg-background md:flex select-none">
            {/* Admin Brand Area */}
            <div className="flex h-24 items-center px-8 border-b border-border">
                <Link href="/dashboard" className="group flex items-center gap-4">
                    <div className="relative h-11 w-11 rounded-xl border border-border bg-background flex items-center justify-center transition-all duration-500 group-hover:border-border">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-7 w-7 object-contain grayscale opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-text-primary tracking-tight uppercase transition-colors">
                                ALL GOVERNMENT
                            </span>
                            <span className="text-[8px] bg-accent text-background font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">ADMIN</span>
                        </div>
                        <span className="text-[9px] font-black text-accent tracking-[0.25em] uppercase mt-1">
                            SECURITY CONTROL
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation Registry */}
            <div className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-4">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Command Hierarchy</p>
                </div>
                <nav className="space-y-1.5">
                    {adminSidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group relative flex items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.15em] transition-colors duration-200",
                                    isActive
                                        ? "bg-surface-raised text-text-primary"
                                        : "text-text-muted hover:bg-surface-raised hover:text-text-primary"
                                )}
                            >
                                <div className="flex items-center gap-3.5">
                                    <Icon className={cn(
                                        "h-4 w-4 transition-colors duration-200",
                                        isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary"
                                    )} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-none" />
                                )}
                                {!isActive && (
                                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-text-muted" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Administrative Entity Info */}
            <div className="p-4 border-t border-border bg-background">
                <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-surface border border-border">
                    <div className="h-8 w-8 rounded-lg bg-transparent border border-accent/30 flex items-center justify-center">
                        <ShieldAlert className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-text-primary truncate uppercase">{user?.name || 'ADMIN USER'}</p>
                        <p className="text-[10px] font-bold text-text-muted truncate tracking-tighter uppercase">Authorized User</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted transition-colors hover:bg-surface hover:text-text-primary group"
                >
                    <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Terminate Session
                </button>
            </div>
        </aside >
    )
}
