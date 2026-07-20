"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Package, User, Calendar, Loader2, ArrowUpRight, Search, Filter, TrendingUp, ShieldCheck, Download, FileText, X } from "lucide-react"
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

// ── Receipt Modal ──────────────────────────────────────────────────────────────
function ReceiptModal({ order, onClose }: { order: Order; onClose: () => void }) {
    const downloadReceiptPDF = async () => {
        const { jsPDF } = await import("jspdf")
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" })

        const W = doc.internal.pageSize.getWidth()

        // Background
        doc.setFillColor(10, 14, 26)
        doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), "F")

        // Header bar
        doc.setFillColor(201, 168, 76)
        doc.rect(0, 0, W, 18, "F")
        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.setTextColor(10, 14, 26)
        doc.text("RECEIPT", W / 2, 12, { align: "center" })

        // Body
        let y = 30
        const label = (text: string, x: number, _y: number) => {
            doc.setFontSize(7)
            doc.setTextColor(74, 90, 112)
            doc.setFont("helvetica", "bold")
            doc.text(text.toUpperCase(), x, _y)
        }
        const value = (text: string, x: number, _y: number) => {
            doc.setFontSize(9)
            doc.setTextColor(240, 242, 245)
            doc.setFont("helvetica", "bold")
            doc.text(text, x, _y)
        }

        label("Transaction ID", 14, y); value(order.id, 14, y + 5); y += 16
        label("Asset", 14, y); value(order.material?.title || order.package?.title || "Legacy Asset", 14, y + 5); y += 16
        label("Customer Name", 14, y); value(order.user.name || "N/A", 14, y + 5); y += 16
        label("User", 14, y); value(order.user.email, 14, y + 5); y += 16
        label("Date", 14, y); value(new Date(order.createdAt).toLocaleString(), 14, y + 5); y += 16
        label("Status", 14, y); value(order.status, 14, y + 5); y += 20

        // Divider
        doc.setDrawColor(30, 45, 69)
        doc.line(14, y, W - 14, y); y += 10

        // Amount
        doc.setFontSize(20)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(201, 168, 76)
        doc.text(`Rs ${order.amount.toLocaleString()}`, W / 2, y + 6, { align: "center" }); y += 18

        // Footer
        doc.setFontSize(6.5)
        doc.setTextColor(74, 90, 112)
        doc.setFont("helvetica", "normal")
        doc.text("Your payment records are securely stored", W / 2, y + 6, { align: "center" })

        doc.save(`receipt-${order.id.substring(0, 8)}.pdf`)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-background/80" />
            <div
                className="relative z-10 w-full max-w-md bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Receipt Header */}
                <div className="bg-accent px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-background" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-background">Receipt</span>
                    </div>
                    <button onClick={onClose} className="text-background/70 hover:text-background transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Receipt Body */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Transaction ID</p>
                            <p className="text-xs font-bold text-text-primary font-mono">{order.id.substring(0, 16)}...</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Status</p>
                            <Badge className="bg-accent/10 text-accent border-accent/20 text-[9px] font-black uppercase tracking-widest px-2">
                                {order.status}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Asset</p>
                        <p className="text-sm font-black text-text-primary uppercase tracking-tight">
                            {order.material?.title || order.package?.title || "Legacy Asset"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Customer Name</p>
                            <p className="text-xs font-bold text-text-primary">{order.user.name || <span className="text-text-muted italic">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">User</p>
                            <p className="text-xs font-bold text-text-secondary">{order.user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Date</p>
                            <p className="text-xs font-bold text-text-secondary">
                                {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 mt-2">
                        <div className="flex items-end justify-between">
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Amount</p>
                            <p className="text-3xl font-black text-accent tracking-tighter">₹{order.amount.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border">
                        <p className="text-[8px] text-text-muted uppercase tracking-widest text-center font-bold">
                            Your payment records are securely stored
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6">
                    <Button
                        onClick={downloadReceiptPDF}
                        className="w-full h-11 bg-accent hover:bg-accent-hover text-background font-black uppercase text-[10px] tracking-widest gap-2 shadow-none"
                    >
                        <Download className="h-4 w-4" />
                        Download PDF Receipt
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SalesPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [filterStatus, setFilterStatus] = useState<string>("ALL")
    const [filterDateFrom, setFilterDateFrom] = useState<string>("")
    const [filterDateTo, setFilterDateTo] = useState<string>("")
    const [filterAmountMin, setFilterAmountMin] = useState<string>("")
    const [filterAmountMax, setFilterAmountMax] = useState<string>("")

    const activeFilterCount = [filterStatus !== "ALL", filterDateFrom, filterDateTo, filterAmountMin, filterAmountMax].filter(Boolean).length

    const clearFilters = () => {
        setFilterStatus("ALL")
        setFilterDateFrom("")
        setFilterDateTo("")
        setFilterAmountMin("")
        setFilterAmountMax("")
        setSearchQuery("")
    }

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

    const filteredOrders = orders.filter(order => {
        const search = searchQuery.toLowerCase()
        const matchText =
            order.id.toLowerCase().includes(search) ||
            order.user.email.toLowerCase().includes(search) ||
            (order.material?.title || order.package?.title || "").toLowerCase().includes(search)

        const matchStatus = filterStatus === "ALL" || order.status === filterStatus

        const orderDate = new Date(order.createdAt)
        const matchFrom = !filterDateFrom || orderDate >= new Date(filterDateFrom)
        const matchTo = !filterDateTo || orderDate <= new Date(filterDateTo + "T23:59:59")

        const matchMin = !filterAmountMin || order.amount >= parseFloat(filterAmountMin)
        const matchMax = !filterAmountMax || order.amount <= parseFloat(filterAmountMax)

        return matchText && matchStatus && matchFrom && matchTo && matchMin && matchMax
    })

    const totalSales = orders.reduce((acc, order) => acc + order.amount, 0)

    const exportRevenuePDF = async () => {
        const { jsPDF } = await import("jspdf")
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

        const W = doc.internal.pageSize.getWidth()  // 297mm
        const H = doc.internal.pageSize.getHeight() // 210mm

        // Background
        doc.setFillColor(10, 14, 26)
        doc.rect(0, 0, W, H, "F")

        // Header bar
        doc.setFillColor(201, 168, 76)
        doc.rect(0, 0, W, 22, "F")
        doc.setFont("helvetica", "bold")
        doc.setFontSize(13)
        doc.setTextColor(10, 14, 26)
        doc.text("PAYMENTS REPORT", W / 2, 14, { align: "center" })

        // Subtitle
        doc.setFontSize(7)
        doc.setFont("helvetica", "normal")
        doc.text(`Generated on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, W / 2, 19.5, { align: "center" })

        let y = 34

        // Summary block
        doc.setFillColor(17, 24, 39)
        doc.roundedRect(14, y, W - 28, 20, 3, 3, "F")
        doc.setFontSize(7)
        doc.setTextColor(74, 90, 112)
        doc.setFont("helvetica", "bold")
        doc.text("TOTAL EARNINGS", 22, y + 8)
        doc.text("TRANSACTIONS", W / 2 + 4, y + 8)
        doc.setFontSize(14)
        doc.setTextColor(201, 168, 76)
        doc.text(`Rs ${totalSales.toLocaleString()}`, 22, y + 17)
        doc.setFontSize(14)
        doc.text(`${orders.length}`, W / 2 + 4, y + 17)
        y += 30

        // Column definitions (landscape A4 = 297mm wide, 14mm margins → 269mm usable)
        // ORDER ID | NAME | EMAIL | ASSET | DATE | AMOUNT
        const cols = {
            orderId: { x: 18, label: "ORDER ID", w: 38 },
            txId: { x: 58, label: "TX HASH", w: 38 },
            name: { x: 98, label: "NAME", w: 32 },
            email: { x: 132, label: "EMAIL", w: 55 },
            asset: { x: 188, label: "ASSET", w: 48 },
            date: { x: 237, label: "DATE", w: 28 },
            amount: { x: W - 16, label: "AMOUNT", w: 0 },  // right-aligned
        }

        // Table header
        doc.setFillColor(26, 34, 53)
        doc.rect(14, y, W - 28, 8, "F")
        doc.setFontSize(6)
        doc.setTextColor(138, 155, 176)
        doc.setFont("helvetica", "bold")
        doc.text(cols.orderId.label, cols.orderId.x, y + 5.5)
        doc.text(cols.txId.label, cols.txId.x, y + 5.5)
        doc.text(cols.name.label, cols.name.x, y + 5.5)
        doc.text(cols.email.label, cols.email.x, y + 5.5)
        doc.text(cols.asset.label, cols.asset.x, y + 5.5)
        doc.text(cols.date.label, cols.date.x, y + 5.5)
        doc.text(cols.amount.label, cols.amount.x, y + 5.5, { align: "right" })
        y += 10

        // Rows
        orders.forEach((order, i) => {
            if (y > H - 20) { doc.addPage(); y = 20 }

            if (i % 2 === 0) {
                doc.setFillColor(17, 24, 39)
                doc.rect(14, y - 1, W - 28, 9, "F")
            }

            const assetTitle = order.material?.title || order.package?.title || "Legacy Asset"
            const nameStr = order.user.name || "—"
            const orderIdShort = order.id.substring(0, 10)
            const txShort = order.id.substring(0, 10).toUpperCase()

            doc.setFontSize(6.5)
            doc.setTextColor(240, 242, 245)
            doc.setFont("helvetica", "normal")

            doc.text(orderIdShort, cols.orderId.x, y + 5)
            doc.text(txShort, cols.txId.x, y + 5)
            doc.text(nameStr.substring(0, 14), cols.name.x, y + 5)
            doc.text(order.user.email.substring(0, 28), cols.email.x, y + 5)
            doc.text(assetTitle.substring(0, 22), cols.asset.x, y + 5)
            doc.text(new Date(order.createdAt).toLocaleDateString("en-GB"), cols.date.x, y + 5)

            doc.setTextColor(201, 168, 76)
            doc.setFont("helvetica", "bold")
            doc.text(`Rs ${order.amount}`, cols.amount.x, y + 5, { align: "right" })

            y += 9
        })

        // Footer
        y += 6
        doc.setDrawColor(30, 45, 69)
        doc.line(14, y, W - 14, y)
        y += 8
        doc.setFontSize(6.5)
        doc.setTextColor(74, 90, 112)
        doc.setFont("helvetica", "normal")
        doc.text("Your payment records are securely stored", W / 2, y, { align: "center" })

        doc.save(`financial-audit-report-${Date.now()}.pdf`)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Loading payments...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {selectedOrder && (
                <ReceiptModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-7 w-7 text-accent" />
                        <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Payments</h2>
                    </div>
                    <p className="text-sm text-text-secondary font-medium">View all payment and purchase records.</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* Revenue Summary Card */}
                    <div className="bg-surface border border-accent/40 rounded-2xl px-5 py-3 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                            <TrendingUp className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Total Earnings</p>
                            <p className="text-xl font-black text-accent tracking-tighter leading-none">₹{totalSales.toLocaleString()}</p>
                            <p className="text-[8px] text-text-muted font-bold mt-0.5 uppercase tracking-widest">{orders.length} transactions</p>
                        </div>
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={exportRevenuePDF}
                        className="h-full px-5 py-3 bg-surface border border-border hover:border-accent/40 hover:bg-surface-raised text-text-secondary hover:text-accent flex flex-col items-center justify-center gap-1 rounded-2xl transition-all"
                    >
                        <Download className="h-5 w-5" />
                        <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Download Report</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                        <Input
                            placeholder="Search by Order ID, User, or Material..."
                            className="pl-12 bg-surface border-border text-[10px] font-black tracking-widest uppercase h-12 rounded-xl focus:ring-1 focus:ring-accent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(v => !v)}
                        className={`h-12 flex items-center gap-2 px-6 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${showFilters || activeFilterCount > 0
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised'
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 h-5 w-5 rounded-full bg-accent text-background text-[9px] font-black flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Expandable Filter Panel */}
                {showFilters && (
                    <div className="bg-surface border border-border rounded-2xl p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Status Filter */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">Status</label>
                                <div className="flex gap-2 flex-wrap">
                                    {["ALL", "COMPLETED", "PENDING", "FAILED"].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setFilterStatus(s)}
                                            className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s
                                                ? 'bg-accent/10 border-accent/40 text-accent'
                                                : 'bg-background border-border text-text-muted hover:text-text-primary'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date From */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">Date From</label>
                                <input
                                    type="date"
                                    value={filterDateFrom}
                                    onChange={e => setFilterDateFrom(e.target.value)}
                                    className="w-full h-10 bg-background border border-border rounded-lg px-3 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent [color-scheme:dark]"
                                />
                            </div>

                            {/* Date To */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">Date To</label>
                                <input
                                    type="date"
                                    value={filterDateTo}
                                    onChange={e => setFilterDateTo(e.target.value)}
                                    className="w-full h-10 bg-background border border-border rounded-lg px-3 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent [color-scheme:dark]"
                                />
                            </div>

                            {/* Amount Range */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">Amount Range (₹)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filterAmountMin}
                                        onChange={e => setFilterAmountMin(e.target.value)}
                                        className="w-full h-10 bg-background border border-border rounded-lg px-3 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-text-muted"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filterAmountMax}
                                        onChange={e => setFilterAmountMax(e.target.value)}
                                        className="w-full h-10 bg-background border border-border rounded-lg px-3 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-text-muted"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-border">
                            <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">
                                {filteredOrders.length} of {orders.length} results
                            </span>
                            <button
                                onClick={clearFilters}
                                className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <Card key={order.id} className="group border-border bg-surface hover:border-accent/40 transition-all duration-300 overflow-hidden shadow-none">
                        <CardContent className="p-0">
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                {/* Asset Info */}
                                <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-border/50 bg-background">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 shadow-inner group-hover:border-accent/40 transition-colors">
                                            <Package className="h-6 w-6 text-accent" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-text-primary line-clamp-1 uppercase tracking-tight">
                                                {order.material?.title || order.package?.title || "LEGACY ASSET"}
                                            </p>
                                            <p className="text-[9px] text-text-muted uppercase font-black tracking-widest mt-1 opacity-70">
                                                TX-HASH: {order.id.substring(0, 16)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="p-6 lg:flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">User</p>
                                            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                                                <User className="h-3.5 w-3.5 text-accent" />
                                                {order.user.email}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Date</p>
                                            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                                                <Calendar className="h-3.5 w-3.5 text-accent" />
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10 self-end sm:self-auto">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Amount</p>
                                            <p className="text-2xl font-black text-text-primary tracking-tighter">₹{order.amount}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <Badge className="px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] border bg-accent/10 text-accent border-accent/20">
                                                {order.status}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedOrder(order)}
                                                className="h-7 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-accent p-0 flex items-center gap-1.5 group/btn transition-colors"
                                            >
                                                View Receipt <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[300px] rounded-[2rem] border-2 border-dashed border-border bg-surface">
                        <DollarSign className="h-12 w-12 text-text-muted mb-4" />
                        <h3 className="text-lg font-black text-text-secondary uppercase tracking-tighter">No Transactions Yet</h3>
                        <p className="text-xs text-text-muted font-bold mt-1 uppercase tracking-widest">No transactions found.</p>
                    </div>
                )}
            </div>

            {/* Security Banner */}
            <div className="p-4 rounded-2xl bg-background border border-border flex items-center justify-center gap-4">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Your payment records are securely stored</p>
            </div>
        </div>
    )
}
