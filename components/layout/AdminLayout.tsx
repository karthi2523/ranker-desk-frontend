"use client"

import { useEffect } from "react"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { useToast } from "@/context/ToastContext"


interface AdminLayoutProps {
    children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutProps) {
    const { showToast } = useToast()

    // ─── Session Navigation Lock - Intercept Back Button ──────────────────────
    useEffect(() => {
        if (typeof window === "undefined") return

        window.history.pushState(null, "", window.location.href)

        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href)
            showToast("You are currently logged in. Please logout if you wish to return to the Home page.", "info")
        }

        window.addEventListener("popstate", handlePopState)
        return () => window.removeEventListener("popstate", handlePopState)
    }, [showToast])

    return (
        <div className="flex min-h-screen bg-background text-text-primary selection:bg-red-500/30">
            <AdminSidebar />
            <div className="flex flex-1 flex-col">
                <header className="flex h-16 items-center border-b border-red-900/20 bg-background/50 px-6">
                    <div className="ml-auto flex items-center gap-4">
                        <div className="text-sm text-text-secondary">Admin Mode</div>
                        <div className="h-8 w-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-xs font-medium text-red-400">
                            AD
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto max-w-6xl space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
