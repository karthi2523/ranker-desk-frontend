"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ShieldCheck, Clock } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = useState({ materialsCount: 0, activity: [] })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user])

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/orders')
            setStats({
                materialsCount: response.data.length,
                activity: response.data.slice(0, 3)
            })
        } catch (error) {
            console.error("Dashboard fetch error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <p className="text-slate-400">Welcome back, {user?.name || 'User'}. Your secure study vault is active.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Active Materials</CardTitle>
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{isLoading ? "..." : stats.materialsCount}</div>
                        <p className="text-xs text-slate-500">Secure access granted</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Security Status</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">Secure</div>
                        <p className="text-xs text-slate-500">Device Fingerprinted</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Vault Access</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">Active</div>
                        <p className="text-xs text-slate-500">Last activity {new Date().toLocaleTimeString()}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-7">
                <Card className="lg:col-span-4 bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Vault Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <p className="text-slate-500">Loading activity...</p>
                            ) : stats.activity.length > 0 ? (
                                stats.activity.map((order: any) => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none text-white font-semibold">Accessed &quot;{order.material.title}&quot;</p>
                                            <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString()} • Encrypted Stream</p>
                                        </div>
                                        <div className="ml-auto font-medium text-emerald-500 text-sm">Verified</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">No recent activity found. Head to the store to get materials.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">All Gov Alerts Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between rounded-lg border border-slate-800 p-4 bg-slate-950/50">
                            <div className="space-y-0.5">
                                <div className="text-sm font-medium text-white">License Status</div>
                                <div className="text-xs text-emerald-500 font-medium">Valid & Active</div>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                            Your Gov Alerts session is protected with multi-layered security.
                            Dynamic watermarking and session locking are active.
                            Contact support if you see unrecognized device activity.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
