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
            case "SUCCESS": return <CheckCircle2 className="h-4 w-4 text-[#4ade80]" />
            case "WARNING": return <AlertTriangle className="h-4 w-4 text-[#c9a84c]" />
            case "ALERT": return <X className="h-4 w-4 text-[#e05252]" />
            default: return <Info className="h-4 w-4 text-[#c9a84c]" />
        }
    }

    const getInitials = (name?: string) => {
        if (!name) return "U"
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    }

    const isAdmin = user?.role === "ADMIN"

    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b border-[#1e2d45] bg-[#0a0e1a] px-4 md:px-6 sticky top-0 z-40">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleMobileNav}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Search */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="relative max-w-sm hidden md:block group">
                        <button
                            type="submit"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5a70] group-focus-within:text-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                        <Input
                            type="search"
                            placeholder="Search materials..."
                            className="pl-9 text-sm h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("relative", isNotifOpen && "bg-[#1a2235] text-[#f0f2f5]")}
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
                            )}
                        </Button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#1e2d45] bg-[#111827] z-[100] overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2d45]">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-[#c9a84c]" />
                                        <h3 className="text-sm font-semibold text-[#f0f2f5]">Notifications</h3>
                                    </div>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={clearAll}
                                            className="text-xs font-medium text-[#4a5a70] hover:text-[#e05252] transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-[70vh] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <div className="h-10 w-10 rounded-full bg-[#1a2235] border border-[#1e2d45] flex items-center justify-center mx-auto mb-3">
                                                <Bell className="h-5 w-5 text-[#4a5a70]" />
                                            </div>
                                            <p className="text-sm text-[#4a5a70]">No new notifications.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-[#1e2d45]">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={cn(
                                                        "p-4 transition-colors group",
                                                        !notif.isRead ? "bg-[#c9a84c]/5 hover:bg-[#c9a84c]/8" : "hover:bg-[#1a2235]"
                                                    )}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="mt-0.5 shrink-0">{getNotifIcon(notif.type)}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <p className={cn(
                                                                    "text-sm font-semibold truncate",
                                                                    !notif.isRead ? "text-[#f0f2f5]" : "text-[#8a9bb0]"
                                                                )}>
                                                                    {notif.title}
                                                                </p>
                                                                {!notif.isRead && (
                                                                    <button
                                                                        onClick={() => markAsRead(notif.id)}
                                                                        className="p-1 rounded text-[#4a5a70] hover:text-[#c9a84c] opacity-0 group-hover:opacity-100 transition-all"
                                                                    >
                                                                        <Check className="h-3 w-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-[#4a5a70] leading-relaxed break-words mb-1.5">
                                                                {notif.message}
                                                            </p>
                                                            <div className="flex items-center gap-1 text-[10px] text-[#4a5a70]">
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

                                <div className="px-4 py-2.5 border-t border-[#1e2d45] text-center">
                                    <p className="text-[10px] text-[#4a5a70] uppercase tracking-widest font-medium">End of Archive</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3 pl-3 border-l border-[#1e2d45] ml-1">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-[#f0f2f5] leading-none">{user?.name}</p>
                            <p className="text-[11px] text-[#4a5a70] mt-0.5">{isAdmin ? "Administrator" : "Member"}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 flex items-center justify-center text-xs font-bold text-[#c9a84c]">
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
