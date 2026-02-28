"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BookOpen, ShieldCheck, Clock, ArrowRight,
    FileText
} from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import AdminStats from "./admin-stats"

export default function DashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        materialsCount: 0,
        activity: [] as any[]
    })
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState("")

    const isAdmin = user?.role === 'ADMIN'

    // Prevent browser back button from leaving the dashboard
    useEffect(() => {
        window.history.pushState(null, '', window.location.href)

        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href)
            setToast("You're already on the dashboard")
            setTimeout(() => setToast(""), 3000)
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    useEffect(() => {
        if (user && !isAdmin) fetchStudentDashboardData()
    }, [user, isAdmin])

    const fetchStudentDashboardData = async () => {
        try {
            const response = await api.get('/orders')
            setStats({
                materialsCount: response.data.length,
                activity: response.data.slice(0, 5)
            })
        } catch (error) {
            console.error("Dashboard fetch error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isAdmin) {
        return <AdminStats />
    }

    return (
        <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="pb-5 border-b border-border">
                <h2 className="text-2xl font-black tracking-tight text-text-primary">Overview</h2>
                <p className="text-text-muted text-sm mt-1 font-medium tracking-tight">
                    Welcome back, <span className="text-accent font-black">{user?.name || 'Member'}</span>. Your encrypted vault is ready for access.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-surface border-border hover:border-border transition-all duration-300 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black text-text-muted uppercase tracking-widest">Purchased Materials</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-transparent border border-accent/30 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-accent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-text-primary tracking-tighter">
                            {isLoading ? <span className="text-text-muted">—</span> : stats.materialsCount}
                        </div>
                        <p className="text-[10px] text-text-muted mt-2 font-black uppercase tracking-widest">Secure access granted</p>
                    </CardContent>
                </Card>

                <Card className="bg-surface border-border hover:border-border transition-all duration-300 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black text-text-muted uppercase tracking-widest">Security Status</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-transparent border border-accent/30 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-accent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-text-primary tracking-tighter">SECURE</div>
                        <p className="text-[10px] text-text-muted mt-2 font-black uppercase tracking-widest">Device fingerprint verified</p>
                    </CardContent>
                </Card>

                <Card className="bg-surface border-border hover:border-border transition-all duration-300 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black text-text-muted uppercase tracking-widest">Vault Access</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-transparent border border-accent/30 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-accent" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-text-primary tracking-tighter">ACTIVE</div>
                        <p className="text-[10px] text-text-muted mt-2 font-black uppercase tracking-widest">Session is currently live</p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity + Security */}
            <div className="grid gap-4 lg:grid-cols-5">
                {/* Recent Activity */}
                <Card className="lg:col-span-3 bg-surface border-border rounded-xl">
                    <CardHeader className="pb-4 border-b border-border">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black text-text-muted uppercase tracking-widest">Recent Acquisitions</CardTitle>
                            <Link
                                href="/dashboard/vault"
                                className="text-[10px] font-black text-accent hover:text-accent-hover flex items-center gap-1 transition-colors uppercase tracking-widest"
                            >
                                Open vault <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 p-0">
                        {isLoading ? (
                            <div className="space-y-3 p-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-12 bg-surface animate-pulse" />
                                ))}
                            </div>
                        ) : stats.activity.length > 0 ? (
                            <div className="divide-y divide-border">
                                {stats.activity.map((order: any) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center gap-4 py-4 px-6 hover:bg-surface transition-colors group"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-transparent border border-accent/20 flex items-center justify-center shrink-0">
                                            <FileText className="h-5 w-5 text-accent" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-text-primary truncate tracking-tight">
                                                {order.material?.title || order.package?.title || 'Material'}
                                            </p>
                                            <p className="text-[10px] text-text-muted mt-1 font-black uppercase tracking-widest">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className="text-[9px] font-black text-accent bg-accent/10 rounded-full px-3 py-1 shrink-0 uppercase tracking-widest">
                                            Active
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6">
                                <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-6" />
                                <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">No assets detected in vault.</p>
                                <Link href="/dashboard/store" className="text-text-primary text-[10px] font-black hover:text-text-secondary mt-4 inline-block uppercase tracking-widest border-b border-white pb-1 transition-colors">
                                    Browse the store →
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Security Info */}
                <Card className="lg:col-span-2 bg-surface border-border rounded-xl">
                    <CardHeader className="pb-4 border-b border-border">
                        <CardTitle className="text-[10px] font-black text-text-muted uppercase tracking-widest">Account Protection</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4 px-6">
                        <div className="flex items-center justify-between p-4 border border-border bg-surface">
                            <div>
                                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">License Status</div>
                                <div className="text-xs text-accent font-black mt-1.5 uppercase tracking-widest flex items-center gap-2">
                                    <div className="h-2 w-2 bg-white" />
                                    VALID & ACTIVE
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-border bg-surface">
                            <div>
                                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Watermarking</div>
                                <div className="text-xs text-accent font-black mt-1.5 uppercase tracking-widest">Enabled on all streams</div>
                            </div>
                            <ShieldCheck className="h-4 w-4 text-accent" />
                        </div>
                        <p className="text-[10px] text-text-muted font-bold leading-relaxed pt-4 text-center uppercase tracking-widest">
                            Your account is protected by hardware-bound verification and dynamic document serialization.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Toast notification for back button */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-surface-raised border border-border rounded-xl px-6 py-3 shadow-2xl flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-sm font-medium text-text-primary">{toast}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
