"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Package, User, Calendar, Loader2, ArrowUpRight, Search, Filter } from "lucide-react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#e05252]" />
                <p className="text-xs font-black text-[#4a5a70] uppercase tracking-widest">Decrypting Financial Audit Feed...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1e2d45]">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-6 w-6 text-[#e05252]" />
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Financial Audit</h2>
                    </div>
                    <p className="text-sm text-[#8a9bb0] font-medium">Review all successful acquisition transactions and sovereign revenue flow.</p>
                </div>
                <div className="bg-[#e05252]/10 border border-[#e05252]/20 rounded-2xl px-6 py-3 flex flex-col items-end justify-center shadow-lg shadow-red-950/20">
                    <p className="text-[10px] font-black text-[#e05252] uppercase tracking-[0.2em]">Total Recovered Revenue</p>
                    <p className="text-3xl font-black text-white">₹{totalSales.toLocaleString()}</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a5a70]" />
                    <Input placeholder="SEARCH TRANSACTION ID OR ENTITY..." className="pl-10 bg-[#0a0e1a] border-[#1e2d45] text-[10px] font-black tracking-widest uppercase h-11" />
                </div>
                <Button variant="outline" className="h-11 border-[#1e2d45] text-slate-400 gap-2 px-6">
                    <Filter className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                </Button>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="group border-[#1e2d45] bg-[#0a0e1a] hover:border-[#e05252]/30 transition-all duration-300 overflow-hidden shadow-xl">
                        <CardContent className="p-0">
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                {/* Asset Info */}
                                <div className="p-5 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-[#1e2d45]/50 bg-slate-900/10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-11 w-11 rounded-xl bg-slate-900 border border-[#1e2d45] flex items-center justify-center shrink-0 shadow-inner">
                                            <Package className="h-5 w-5 text-[#c9a84c]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-white line-clamp-1 uppercase tracking-tight">
                                                {order.material?.title || order.package?.title}
                                            </p>
                                            <p className="text-[10px] text-[#4a5a70] uppercase font-black tracking-tighter mt-0.5">
                                                TRANSACTION: {order.id.substring(0, 16)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="p-5 lg:flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-[#4a5a70] uppercase tracking-widest">Entity Email</p>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                                                <User className="h-3 w-3 text-[#e05252]" />
                                                {order.user.email}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-[#4a5a70] uppercase tracking-widest">Timestamp</p>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                                                <Calendar className="h-3 w-3 text-[#c9a84c]" />
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 self-end sm:self-auto">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-[#4a5a70] uppercase tracking-widest">Amount</p>
                                            <p className="text-2xl font-black text-white">₹{order.amount}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] border ${order.status === 'COMPLETED'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20'
                                                }`}>
                                                {order.status}
                                            </Badge>
                                            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase tracking-widest text-[#4a5a70] hover:text-white p-0 flex items-center gap-1 group/btn">
                                                Full Receipt <ArrowUpRight className="h-3 w-3 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[300px] rounded-2xl border-2 border-dashed border-[#1e2d45] bg-[#0a0e1a]/50">
                        <DollarSign className="h-10 w-10 text-[#1e2d45] mb-4" />
                        <h3 className="text-lg font-black text-[#8a9bb0] uppercase tracking-tighter">Audit Empty</h3>
                        <p className="text-xs text-[#4a5a70] font-bold mt-1">No successful acquisitions detected on the global ledger.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
