"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    X, LogOut, LayoutDashboard, FileText, Upload,
    Users, DollarSign, ShoppingCart, MonitorSmartphone, Settings, Lock, ShieldAlert,
    Cpu, Activity, ShieldCheck
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

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

    // Close when route changes
    useEffect(() => {
        onClose()
    }, [pathname])

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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md md:hidden"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 z-[60] w-[85%] max-w-sm bg-background/95 backdrop-blur-2xl border-r border-white/5 p-8 shadow-[20px_0_50px_rgba(0,0,0,0.3)] md:hidden flex flex-col"
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between mb-10">
                            <Link href="/dashboard" className="group flex items-center gap-4" onClick={onClose}>
                                <div className="relative h-11 w-11 rounded-xl border border-white/10 bg-surface flex items-center justify-center transition-all duration-300 group-hover:border-accent/50">
                                    <img
                                        src="/logo.png"
                                        alt="Logo"
                                        className="h-6 w-6 object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-[linear-gradient(110deg,#f0f2f5,45%,#c9a84c,55%,#f0f2f5)] bg-[length:200%_100%] animate-shimmer whitespace-nowrap">
                                        All Government Alerts
                                    </h1>
                                </div>
                            </Link>
                            <button
                                onClick={onClose}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-text-muted hover:text-white transition-all active:scale-90"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* System Status - PREMIUM ELEMENT */}
                        <div className="mb-10 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-accent animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Security Status</p>
                                <p className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-tighter mt-0.5">
                                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                    Active & Shielded
                                </p>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <nav className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {items.map((item, i) => {
                                const isActive = pathname === item.href
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={cn(
                                                "flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-black transition-all group",
                                                isActive
                                                    ? "bg-accent/10 text-accent border border-accent/20"
                                                    : "text-text-muted hover:bg-white/5 hover:text-text-primary border border-transparent"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-5 w-5 transition-transform group-hover:scale-110",
                                                isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary"
                                            )} />
                                            <span className="tracking-tight uppercase">{item.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </nav>

                        {/* Drawer Footer */}
                        <div className="pt-8 border-t border-white/5 mt-auto">
                            <button
                                onClick={logout}
                                className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-black text-error transition-all hover:bg-error/10 border border-transparent hover:border-error/20 active:scale-[0.98] uppercase tracking-tight"
                            >
                                <LogOut className="h-5 w-5" />
                                Terminate Session
                            </button>
                            <div className="mt-6 flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="h-3 w-3 text-text-muted" />
                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">V0.1.25 Stable</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Core Online</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
