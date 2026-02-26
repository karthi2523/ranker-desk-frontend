"use client"

import { useEffect } from"react"
import { useRouter } from"next/navigation"
import { useAuth } from"@/context/AuthContext"
import { Sidebar } from"./Sidebar"
import { AdminSidebar } from"./AdminSidebar"
import { Topbar } from"./Topbar"
import { Loader2 } from"lucide-react"
import { useToast } from"@/context/ToastContext"

interface DashboardLayoutProps {
 children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
 const { user, isLoading } = useAuth()
 const router = useRouter()
 const { showToast } = useToast()

 const isAdmin = user?.role === 'ADMIN'

 // ─── Authentication Guard ────────────────────────────────────────────────
 useEffect(() => {
 if (!isLoading && !user) {
 router.push("/login")
 }
 }, [isLoading, user, router])

 // ─── Role-Based Access Control (RBAC) ─────────────────────────────────────
 useEffect(() => {
 if (!user || isLoading) return

 const pathname = window.location.pathname

 const adminOnlyPaths = [
 '/dashboard/admin-materials',
 '/dashboard/upload',
 '/dashboard/packages',
 '/dashboard/users',
 '/dashboard/sales'
 ]

 const userOnlyPaths = [
 '/dashboard/store',
 '/dashboard/materials',
 '/dashboard/vault',
 '/dashboard/orders',
 '/dashboard/devices'
 ]

 const isTryingAdminPath = adminOnlyPaths.some(path => pathname.startsWith(path))
 const isTryingUserPath = userOnlyPaths.some(path => pathname.startsWith(path))

 if (isAdmin && isTryingUserPath) {
 showToast("Access Denied: Admins cannot access student-only pages.","error")
 router.replace('/dashboard')
 } else if (!isAdmin && isTryingAdminPath) {
 showToast("Security Breach Attempt: You do not have administrator privileges.","error")
 router.replace('/dashboard')
 }
 }, [user, isLoading, isAdmin, router, showToast])

 // ─── Session Navigation Lock - Intercept Back Button ──────────────────────
 useEffect(() => {
 if (typeof window ==="undefined") return

 // Push current state to history to enable capture of the NEXT popstate (back click)
 window.history.pushState(null,"", window.location.href)

 const handlePopState = (event: PopStateEvent) => {
 // Re-push state to stay on current page
 window.history.pushState(null,"", window.location.href)
 showToast("You are currently logged in. Please logout if you wish to return to the Home page.","info")
 }

 window.addEventListener("popstate", handlePopState)
 return () => window.removeEventListener("popstate", handlePopState)
 }, [showToast])

 if (isLoading) {
 return (
 <div className="flex min-h-screen items-center justify-center bg-background">
 <div className="flex flex-col items-center gap-4">
 <Loader2 className="h-8 w-8 animate-spin text-text-primary"/>
 <p className="text-sm font-bold tracking-widest uppercase text-text-muted">Restoring secure session...</p>
 </div>
 </div>
 )
 }

 if (!user) return null

 return (
 <div className="flex min-h-screen bg-background text-text-primary">
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
