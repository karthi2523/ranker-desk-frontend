"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Search, Menu, CheckCircle2, Info, AlertTriangle, Check, Trash2, X, Clock, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { MobileNav } from "./MobileNav"
import { useNotifications } from "@/context/NotificationContext"
import { formatDistanceToNow } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ThemeToggle"

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
            case "SUCCESS": return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case "WARNING": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case "ALERT": return <X className="h-4 w-4 text-error" />
            default: return <Info className="h-4 w-4 text-text-muted" />
        }
    }

    const getInitials = (name?: string) => {
        if (!name) return "U"
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    }

    const isAdmin = user?.role === "ADMIN"

    return (
        <>
            <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6 sticky top-0 z-40 backdrop-blur-md">
                {/* Mobile Menu & Logo */}
                <div className="flex md:hidden items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface text-text-muted hover:text-text-primary border border-border transition-all"
                        onClick={toggleMobileNav}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg border border-accent/20 bg-surface flex items-center justify-center shrink-0">
                            <img src="/logo.png" alt="Logo" className="h-5 w-5 object-contain" />
                        </div>
                        <div className="flex flex-col hidden xs:flex">
                            <h1 className="text-base font-black tracking-tight bg-clip-text text-transparent bg-[linear-gradient(110deg,#0f172a,45%,#c9a84c,55%,#0f172a)] dark:bg-[linear-gradient(110deg,#ffffff,45%,#c9a84c,55%,#ffffff)] bg-[length:200%_100%] animate-shimmer whitespace-nowrap">
                                All Government Alerts
                            </h1>
                        </div>
                    </Link>
                </div>

                {/* Search - HIDDEN ON SMALLER SCREENS */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="relative max-w-sm hidden md:block group">
                        <button
                            type="submit"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-text-primary hover:text-text-primary transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                        <Input
                            type="search"
                            placeholder="Search materials..."
                            className="w-full bg-surface border-border focus-visible:ring-accent/20 focus-visible:border-accent pl-9 text-sm h-10 text-text-primary placeholder:text-text-muted transition-colors rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex items-center gap-2 md:gap-4 ml-auto">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-10 w-10 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary transition-all relative",
                                isNotifOpen && "text-text-primary bg-surface-raised border-accent/20"
                            )}
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                            )}
                        </Button>

                        {/* Notification Dropdown */}
                        <AnimatePresence>
                            {isNotifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-border bg-background/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] overflow-hidden"
                                >
                                    <div className="flex items-center justify-between p-5 border-b border-border bg-surface">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-md bg-accent/20 flex items-center justify-center">
                                                <Bell className="h-3 w-3 text-accent" />
                                            </div>
                                            <h3 className="text-[11px] font-black text-text-primary uppercase tracking-widest">Live Archive</h3>
                                        </div>
                                        {notifications.length > 0 && (
                                            <button
                                                onClick={clearAll}
                                                className="text-[10px] font-black text-text-muted hover:text-text-primary uppercase tracking-widest transition-colors flex items-center gap-1.5"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-16 text-center">
                                                <div className="h-14 w-14 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6">
                                                    <Bell className="h-6 w-6 text-text-muted/50" />
                                                </div>
                                                <p className="text-sm font-black text-text-muted uppercase tracking-tighter">No alerts detected.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-border">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={cn(
                                                            "p-5 transition-all group relative",
                                                            !notif.isRead ? "bg-surface" : "hover:bg-surface/50"
                                                        )}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="mt-1 shrink-0">
                                                                <div className="h-8 w-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                                                                    {getNotifIcon(notif.type)}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                                                    <p className={cn(
                                                                        "text-[13px] font-black tracking-tight truncate",
                                                                        !notif.isRead ? "text-text-primary" : "text-text-muted"
                                                                    )}>
                                                                        {notif.title}
                                                                    </p>
                                                                    {!notif.isRead && (
                                                                        <button
                                                                            onClick={() => markAsRead(notif.id)}
                                                                            className="h-6 w-6 rounded-lg bg-accent/10 border border-accent/20 text-accent flex items-center justify-center hover:bg-accent hover:text-background transition-all"
                                                                        >
                                                                            <Check className="h-3 w-3" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-text-muted leading-relaxed font-medium mb-3">
                                                                    {notif.message}
                                                                </p>
                                                                <div className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[.2em]">
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

                                    <div className="p-4 border-t border-border bg-surface/50 text-center">
                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em]">Protocol Archive V1</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <ThemeToggle />

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-border h-10 ml-2">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-black text-text-primary leading-none tracking-tight">{user?.name}</p>
                            <p className="text-[9px] text-accent font-black uppercase tracking-[0.2em] mt-1.5">
                                {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED USER'}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl border border-accent/30 bg-accent/10 flex items-center justify-center text-xs font-black text-accent shadow-[0_0_15px_rgba(201,168,76,0.1)]">
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
