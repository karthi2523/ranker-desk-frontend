import { useState, useEffect, useRef } from "react"
import { Bell, Search, Menu, CheckCircle2, Info, AlertTriangle, Check, Trash2, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { MobileNav } from "./MobileNav"
import { useNotifications } from "@/context/NotificationContext"
import { formatDistanceToNow } from "date-fns"

export function Topbar() {
    const { user } = useAuth()
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications()
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const notifRef = useRef<HTMLDivElement>(null)

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
            case 'SUCCESS': return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case 'ALERT': return <X className="h-4 w-4 text-red-500" />
            default: return <Info className="h-4 w-4 text-indigo-500" />
        }
    }

    const getInitials = (name?: string) => {
        if (!name) return "U"
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    }

    const isAdmin = user?.role === 'ADMIN'

    return (
        <>
            <header className="flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-950/50 px-4 md:px-6 backdrop-blur-xl sticky top-0 z-40">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-400 hover:text-white"
                    onClick={toggleMobileNav}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="flex-1">
                    <div className="relative max-w-md hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            type="search"
                            placeholder="Search protocol files..."
                            className="w-full bg-slate-950/50 border-slate-800 focus-visible:ring-indigo-500/50 pl-9"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="relative" ref={notifRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "text-slate-400 hover:text-white relative",
                                isNotifOpen && "text-white bg-slate-900"
                            )}
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                            )}
                        </Button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/80 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/50">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-indigo-400" />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-tighter">Notifications</h3>
                                    </div>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={clearAll}
                                            className="text-[10px] font-bold text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4">
                                                <Bell className="h-6 w-6 text-slate-700" />
                                            </div>
                                            <p className="text-sm text-slate-500">No new alerts found.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={cn(
                                                        "p-4 transition-colors group relative",
                                                        !notif.isRead ? "bg-indigo-500/5 hover:bg-indigo-500/10" : "hover:bg-slate-900"
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
                                                                    !notif.isRead ? "text-white" : "text-slate-400"
                                                                )}>
                                                                    {notif.title}
                                                                </p>
                                                                {!notif.isRead && (
                                                                    <button
                                                                        onClick={() => markAsRead(notif.id)}
                                                                        className="p-1 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                                                    >
                                                                        <Check className="h-3 w-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-500 leading-relaxed break-words mb-2">
                                                                {notif.message}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
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

                                <div className="p-3 border-t border-white/5 bg-slate-950 text-center">
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">End of Archive</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pl-2 border-l border-slate-800 ml-2">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-1">
                                {isAdmin ? 'Clearance Level 5' : 'Verified Entity'}
                            </p>
                        </div>
                        <div className={cn(
                            "h-9 w-9 rounded-full border flex items-center justify-center text-xs font-black transition-all shadow-lg",
                            isAdmin
                                ? "bg-red-500/10 border-red-500/50 text-red-500 shadow-red-900/20"
                                : "bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-indigo-900/20"
                        )}>
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

