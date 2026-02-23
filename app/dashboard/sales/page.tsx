"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, User, Calendar, Loader2 } from "lucide-react"
import api from "@/lib/api"

interface Order {
    id: string
    amount: number
    status: string
    createdAt: string
    user: { email: string, name: string | null }
    material?: { title: string }
    package?: { title: string }
}

export default function SalesPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/sales')
            setOrders(response.data)
        } catch (error) {
            console.error("Failed to fetch orders", error)
        } finally {
            setIsLoading(false)
        }
    }

    const totalSales = orders.reduce((acc, order) => acc + order.amount, 0)

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Financial Audit</h2>
                    <p className="text-sm text-slate-400">Review all successful acquisition transactions and revenue flow.</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-0">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Total Revenue</p>
                    <p className="text-2xl font-black text-white">₹{totalSales.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid gap-4">
                {orders.map((order) => (
                    <Card key={order.id} className="border-red-900/20 bg-slate-900/50 backdrop-blur-md hover:border-red-500/30 transition-colors overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="p-4 md:w-1/3 border-b md:border-b-0 md:border-r border-red-900/10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                                            <Package className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white line-clamp-1">{order.material?.title || order.package?.title}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Asset ID: {order.id.substring(0, 8)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 md:flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                            <User className="h-3 w-3 text-slate-500" />
                                            {order.user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                            <Calendar className="h-3 w-3 text-slate-500" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 self-end md:self-auto">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Amount</p>
                                            <p className="text-xl font-black text-white">₹{order.amount}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.status === 'COMPLETED'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {orders.length === 0 && (
                    <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
                        <DollarSign className="h-12 w-12 text-slate-700 mb-4" />
                        <h3 className="text-lg font-bold text-slate-400">No Sales Recorded</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
