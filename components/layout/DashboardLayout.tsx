"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "./Sidebar"
import { AdminSidebar } from "./AdminSidebar"
import { Topbar } from "./Topbar"
import { Loader2 } from "lucide-react"
import { useToast } from "@/context/ToastContext"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    const { showToast } = useToast()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [isLoading, user, router])

    // Session Navigation Lock - Intercept Back Button
    useEffect(() => {
        if (typeof window === "undefined") return

        // Push current state to history to enable capture of the NEXT popstate (back click)
        window.history.pushState(null, "", window.location.href)

        const handlePopState = (event: PopStateEvent) => {
            // Re-push state to stay on current page
            window.history.pushState(null, "", window.location.href)
            showToast("You are currently logged in. Please logout if you wish to return to the Home page.", "info")
        }

        window.addEventListener("popstate", handlePopState)
        return () => window.removeEventListener("popstate", handlePopState)
    }, [showToast])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-sm text-slate-400">Restoring secure session...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    const isAdmin = user.role === 'ADMIN'

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}
            <div className="flex flex-1 flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                    <div className="mx-auto max-w-6xl space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
