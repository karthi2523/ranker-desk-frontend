"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Search, Menu, CheckCircle2, Info, AlertTriangle, Check, Trash2, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { MobileNav } from "./MobileNav"
import { useNotifications } from "@/context/NotificationContext"
import { formatDistanceToNow } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export function Topbar() {
    const { user } = useAuth()
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications()
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const notifRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize search from URL
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "")
    }, [searchParams])

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        const params = new URLSearchParams(searchParams.toString())
        if (searchQuery) {
            params.set("search", searchQuery)
        } else {
            params.delete("search")
        }

        const pathname = window.location.pathname
        const searchablePaths = [
            "/dashboard/store",
            "/dashboard/vault",
            "/dashboard/admin-materials"
        ]
        const isSearchablePage = searchablePaths.some(path => pathname.startsWith(path))

        if (isSearchablePage) {
            router.replace(`${pathname}?${params.toString()}`)
        } else {
            router.push(`/dashboard/store?${params.toString()}`)
        }
    }

    const toggleMobileNav = () => setIsMobileNavOpen(true)
    const closeMobileNav = () => setIsMobileNavOpen(false)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const getNotifIcon = (type: string) => {
        switch (type) {
            case "SUCCESS": return <CheckCircle2 className="h-4 w-4 text-zinc-300" />
            case "WARNING": return <AlertTriangle className="h-4 w-4 text-zinc-400" />
            case "ALERT": return <X className="h-4 w-4 text-text-primary" />
            default: return <Info className="h-4 w-4 text-zinc-500" />
        }
    }

    const getInitials = (name?: string) => {
        if (!name) return "U"
        return name.split("").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    }

    const isAdmin = user?.role === "ADMIN"

    return (
        <>
            <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6 sticky top-0 z-40">
                {/* Mobile Menu & Logo */}
                <div className="flex md:hidden items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-500 hover:text-text-primary"
                        onClick={toggleMobileNav}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain" />
                        <div className="flex flex-col leading-none hidden sm:flex">
                            <span className="text-sm font-black text-text-primary tracking-tight transition-colors">
                                All government
                            </span>
                            <span className="text-[9px] font-black text-accent tracking-widest mt-0.5">
                                Alerts
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Search */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="relative max-w-sm hidden md:block group">
                        <button
                            type="submit"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-text-primary hover:text-text-primary transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                        <Input
                            type="search"
                            placeholder="Search materials..."
                            className="w-full bg-surface border-border focus-visible:ring-accent/20 focus-visible:border-accent pl-9 text-sm h-10 text-text-primary placeholder:text-text-muted transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "text-text-secondary hover:text-text-primary relative",
                                isNotifOpen && "text-text-primary bg-surface-raised"
                            )}
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                            )}
                        </Button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl border border-border bg-surface shadow-none z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-zinc-400" />
                                        <h3 className="text-sm font-black text-text-primary uppercase tracking-tighter">All government Alerts</h3>
                                    </div>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={clearAll}
                                            className="text-[10px] font-black text-zinc-600 hover:text-text-primary uppercase tracking-widest transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <div className="h-12 w-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center mx-auto mb-4">
                                                <Bell className="h-6 w-6 text-zinc-700" />
                                            </div>
                                            <p className="text-sm font-medium text-zinc-600">No new alerts found.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-zinc-900">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={cn(
                                                        "p-4 transition-colors group relative",
                                                        !notif.isRead ? "bg-zinc-900" : "bg-black hover:bg-zinc-950"
                                                    )}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="mt-1 shrink-0">
                                                            {getNotifIcon(notif.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <p className={cn(
                                                                    "text-sm font-bold truncate",
                                                                    !notif.isRead ? "text-text-primary" : "text-zinc-500"
                                                                )}>
                                                                    {notif.title}
                                                                </p>
                                                                {!notif.isRead && (
                                                                    <button
                                                                        onClick={() => markAsRead(notif.id)}
                                                                        className="p-1 rounded-md text-zinc-600 hover:text-text-primary hover:bg-zinc-800 transition-colors"
                                                                    >
                                                                        <Check className="h-3 w-3" />
                                                                    </button>

                                                                )}
                                                            </div>
                                                            <p className="text-xs text-zinc-500 leading-relaxed font-medium break-words mb-2">
                                                                {notif.message}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                                                                <Clock className="h-2.5 w-2.5" />
                                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 border-t border-zinc-900 bg-zinc-950 text-center">
                                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">End of Archive</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3 pl-3 border-l border-border ml-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-black text-text-primary leading-none tracking-tight">{user?.name}</p>
                            <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mt-1">
                                {isAdmin ? 'Administrator' : 'Verified Entity'}
                            </p>
                        </div>
                        <div className="h-9 w-9 rounded-full border border-accent bg-surface-raised flex items-center justify-center text-xs font-black text-accent">
                            {getInitials(user?.name)}
                        </div>
                    </div>
                </div>
            </header>

            <MobileNav
                isOpen={isMobileNavOpen}
                onClose={closeMobileNav}
                isAdmin={isAdmin}
            />
        </>
    )
}
