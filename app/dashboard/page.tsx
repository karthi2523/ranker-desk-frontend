"use client"

import { useEffect, useState } from "react"
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

    const isAdmin = user?.role === 'ADMIN'

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
            <div className="pb-5 border-b border-[#1e2d45]">
                <h2 className="text-xl font-bold tracking-tight text-[#f0f2f5]">Overview</h2>
                <p className="text-[#8a9bb0] text-sm mt-1 font-medium">
                    Welcome back, <span className="text-[#c9a84c] font-bold">{user?.name || 'Member'}</span>. Your encrypted vault is ready for access.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-[#0a0e1a] border-[#1e2d45] hover:border-[#c9a84c]/30 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-widest">Purchased Materials</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-[#c9a84c]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#f0f2f5]">
                            {isLoading ? <span className="text-[#1e2d45]">—</span> : stats.materialsCount}
                        </div>
                        <p className="text-[10px] text-[#4a5a70] mt-1 font-bold uppercase tracking-tighter">Secure access granted</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0e1a] border-[#1e2d45] hover:border-[#c9a84c]/30 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-widest">Security Status</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-[#c9a84c]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#c9a84c]">SECURE</div>
                        <p className="text-[10px] text-[#4a5a70] mt-1 font-bold uppercase tracking-tighter">Device fingerprint verified</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0e1a] border-[#1e2d45] hover:border-[#c9a84c]/30 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-widest">Vault Access</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-[#c9a84c]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-[#f0f2f5]">ACTIVE</div>
                        <p className="text-[10px] text-[#4a5a70] mt-1 font-bold uppercase tracking-tighter">Session is currently live</p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity + Security */}
            <div className="grid gap-4 lg:grid-cols-5">
                {/* Recent Activity */}
                <Card className="lg:col-span-3 bg-[#0a0e1a] border-[#1e2d45]">
                    <CardHeader className="pb-4 border-b border-[#1e2d45]">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-black text-[#f0f2f5] uppercase tracking-widest">Recent Acquisitions</CardTitle>
                            <Link
                                href="/dashboard/vault"
                                className="text-[10px] font-black text-[#c9a84c] hover:text-[#dbb95c] flex items-center gap-1 transition-colors uppercase tracking-widest"
                            >
                                Open vault <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-12 rounded-lg bg-slate-900/50 animate-pulse" />
                                ))}
                            </div>
                        ) : stats.activity.length > 0 ? (
                            <div className="space-y-1">
                                {stats.activity.map((order: any) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center gap-4 py-2.5 px-3 rounded-lg hover:bg-slate-900/40 transition-colors group"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                                            <FileText className="h-4 w-4 text-[#c9a84c]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-[#f0f2f5] truncate uppercase tracking-tight">
                                                {order.material?.title || order.package?.title || 'Material'}
                                            </p>
                                            <p className="text-[10px] text-[#4a5a70] mt-0.5 font-bold uppercase tracking-tighter">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className="text-[9px] font-black text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-widest">
                                            Active
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <BookOpen className="h-8 w-8 text-[#1e2d45] mx-auto mb-4" />
                                <p className="text-[#4a5a70] text-[10px] font-black uppercase tracking-widest">No assets detected in vault.</p>
                                <Link href="/dashboard/store" className="text-[#c9a84c] text-[10px] font-black hover:text-[#dbb95c] mt-2 inline-block uppercase tracking-widest border-b border-[#c9a84c]/20 pb-0.5">
                                    Browse the store →
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Security Info */}
                <Card className="lg:col-span-2 bg-[#0a0e1a] border-[#1e2d45]">
                    <CardHeader className="pb-4 border-b border-[#1e2d45]">
                        <CardTitle className="text-xs font-black text-[#f0f2f5] uppercase tracking-widest">Account Protection</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#1e2d45] bg-slate-900/10">
                            <div>
                                <div className="text-[10px] font-black text-[#f0f2f5] uppercase tracking-widest">License Status</div>
                                <div className="text-[10px] text-[#c9a84c] font-black mt-1 uppercase tracking-widest flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                                    VALID & ACTIVE
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#1e2d45] bg-slate-900/10">
                            <div>
                                <div className="text-[10px] font-black text-[#f0f2f5] uppercase tracking-widest">Watermarking</div>
                                <div className="text-[10px] text-[#4a5a70] font-black mt-1 uppercase tracking-widest">Enabled on all streams</div>
                            </div>
                            <ShieldCheck className="h-4 w-4 text-[#c9a84c]/60" />
                        </div>
                        <p className="text-[10px] text-[#4a5a70] font-medium leading-relaxed pt-2 text-center uppercase tracking-tighter">
                            Your account is protected by hardware-bound verification and dynamic document serialization.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
