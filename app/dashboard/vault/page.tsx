"use client"

import { useEffect, useState } from"react"
import { useRouter } from"next/navigation"
import Link from"next/link"
import { useAuth } from"@/context/AuthContext"
import api from"@/lib/api"
import { Button } from"@/components/ui/button"
import {
 BookOpen, ShoppingBag, ArrowRight, CheckCircle2, Search,
 Clock, Package2, FileText, Loader2, ShieldCheck, Calendar
} from"lucide-react"
import { useSearchParams } from"next/navigation"

interface Order {
 id: string
 materialId: string
 status: string
 createdAt: string
 material?: { title: string; price: number }
 package?: { title: string; price: number }
 packageId?: string
}

interface VaultItem {
 id: string
 title: string
 purchasedDate: string
 isActive: boolean
 type:"material"|"package"
 price: number
}

export default function VaultPage() {
 const router = useRouter()
 const { user, isLoading: authLoading } = useAuth()
 const [items, setItems] = useState<VaultItem[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
 if (!authLoading && !user) router.push("/login")
 }, [authLoading, user, router])

 useEffect(() => {
 if (user) fetchOrders()
 }, [user])

 const fetchOrders = async () => {
 try {
 const response = await api.get("/orders")
 const orders: Order[] = response.data
 const vaultItems: VaultItem[] = orders.map((order) => {
 const isPackage = !!order.package
 return {
 id: isPackage ? order.packageId! : order.materialId,
 title: isPackage ? order.package!.title : order.material!.title,
 purchasedDate: new Date(order.createdAt).toLocaleDateString("en-IN", {
 day:"numeric", month:"short", year:"numeric",
 }),
 isActive: order.status ==="COMPLETED",
 type: isPackage ?"package":"material",
 price: isPackage ? order.package!.price : order.material!.price,
 }
 })
 setItems(vaultItems)
 } catch (error) {
 console.error("Failed to fetch vault items", error)
 } finally {
 setIsLoading(false)
 }
 }


 const searchParams = useSearchParams()
 const searchString = searchParams.get('search')?.toLowerCase() ||""

 const filteredItems = items.filter(item =>
 item.title.toLowerCase().includes(searchString)
 )

 if (authLoading || (!user && !authLoading)) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <Loader2 className="h-6 w-6 animate-spin text-accent"/>
 </div>
 )
 }

 return (
 <div className="max-w-5xl mx-auto px-2 pb-20 space-y-8">

 {/* ── Page Header ──────────────────────────────────── */}
 <div className="border-b border-border pb-6 pt-2">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <div className="flex items-center gap-2.5 mb-2">
 <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
 <BookOpen className="h-4 w-4 text-accent"/>
 </div>
 <h1 className="text-xl font-bold text-text-primary tracking-tight">My Vault</h1>
 </div>
 <p className="text-sm text-text-secondary max-w-md leading-relaxed">
 Your personal study library. Every material you purchase is securely stored and watermarked to your account.
 </p>
 </div>

 {!isLoading && items.length > 0 && (
 <div className="flex items-center gap-3 sm:justify-end">
 <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
 <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0"/>
 <span className="text-sm font-semibold text-text-primary">{items.filter(i => i.isActive).length}</span>
 <span className="text-xs text-text-muted">Active</span>
 </div>
 <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
 <FileText className="h-3.5 w-3.5 text-text-muted shrink-0"/>
 <span className="text-sm font-semibold text-text-primary">{items.length}</span>
 <span className="text-xs text-text-muted">Total</span>
 </div>
 </div>
 )}
 </div>

 <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
 <ShieldCheck className="h-3.5 w-3.5 shrink-0"/>
 <span>Access audited as <span className="text-text-secondary font-medium">{user?.email}</span> — all sessions are watermarked</span>
 </div>
 </div>

 {/* ── Loading ───────────────────────────────────────── */}
 {isLoading && (
 <div className="flex flex-col items-center justify-center py-24 gap-3">
 <Loader2 className="h-7 w-7 animate-spin text-accent"/>
 <p className="text-sm text-text-muted">Loading your library…</p>
 </div>
 )}

 {/* ── Empty State ───────────────────────────────────── */}
 {!isLoading && items.length === 0 && (
 <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 px-8 text-center bg-surface">
 <div className="h-14 w-14 rounded-xl bg-background border border-border flex items-center justify-center mb-5">
 <ShoppingBag className="h-7 w-7 text-text-muted"/>
 </div>
 <h3 className="text-base font-semibold text-text-primary mb-2">Your vault is empty</h3>
 <p className="text-sm text-text-secondary max-w-xs mb-7 leading-relaxed">
 You haven&apos;t purchased any study materials yet. Browse the store to get started.
 </p>
 <Link href="/dashboard/store">
 <Button className="gap-2">
 <ShoppingBag className="h-4 w-4"/>
 Browse Store
 <ArrowRight className="h-4 w-4"/>
 </Button>
 </Link>
 </div>
 )}

 {!isLoading && items.length > 0 && filteredItems.length === 0 && (
 <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 px-8 text-center bg-surface">
 <div className="h-14 w-14 rounded-xl bg-background border border-border flex items-center justify-center mb-5">
 <Search className="h-7 w-7 text-text-muted"/>
 </div>
 <h3 className="text-base font-semibold text-text-primary mb-2">No matching materials</h3>
 <p className="text-sm text-text-secondary max-w-xs mb-7 leading-relaxed">
 Your search for"{searchString}"did not match any items in your vault.
 </p>
 </div>
 )}

 {/* ── Items Grid ────────────────────────────────────── */}
 {!isLoading && filteredItems.length > 0 && (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {filteredItems.map((item) => (
 <div
 key={item.id}
 className="group flex flex-col rounded-xl border border-border bg-surface shadow-none hover:border-accent/30 transition-all duration-200"
 >
 {/* Card top */}
 <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
 <div className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center">
 {item.type ==="package"
 ? <Package2 className="h-4 w-4 text-text-secondary"/>
 : <FileText className="h-4 w-4 text-text-secondary"/>
 }
 </div>

 {/* Status pill */}
 {item.isActive ? (
 <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-accent bg-accent/10 border border-accent/20 rounded-lg px-2 py-0.5">
 <span className="h-1.5 w-1.5 rounded-full bg-accent"/>
 Available
 </span>
 ) : (
 <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary bg-surface border border-border rounded-full px-2.5 py-1">
 <Clock className="h-3 w-3"/>
 Processing
 </span>
 )}
 </div>

 {/* Card body */}
 <div className="flex flex-col flex-1 px-5 py-4 gap-4">
 <div className="flex-1 space-y-1.5">
 <h3 className="text-sm font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
 {item.title}
 </h3>
 <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-text-muted border border-border rounded px-1.5 py-0.5">
 {item.type}
 </span>
 </div>

 <div className="flex items-center justify-between text-xs text-text-muted border-t border-border pt-3">
 <div className="flex items-center gap-1.5">
 <Calendar className="h-3 w-3 shrink-0"/>
 <span>{item.purchasedDate}</span>
 </div>
 <span className="font-semibold text-text-secondary">₹{item.price}</span>
 </div>

 {/* CTA */}
 {item.isActive ? (
 <Link
 href={item.type ==="package"? `/vault/package/${item.id}` : `/vault/${item.id}`}
 className="w-full"
 >
 <Button className="w-full gap-2 rounded-lg text-sm bg-accent hover:bg-accent-hover text-slate-950 font-bold transition-colors">
 <BookOpen className="h-4 w-4"/>
 Read Now
 </Button>
 </Link>
 ) : (
 <Button
 disabled
 variant="secondary"
 className="w-full gap-2 rounded-lg text-sm"
 >
 <Clock className="h-4 w-4"/>
 Processing…
 </Button>
 )}
 </div>
 </div>
 ))}
 </div>
 )}

 {/* ── Bottom CTA ────────────────────────────────────── */}
 {!isLoading && items.length > 0 && (
 <div className="flex items-center justify-between border border-border rounded-xl bg-surface px-5 py-4">
 <div>
 <p className="text-sm font-medium text-text-primary">Looking for more study materials?</p>
 <p className="text-xs text-text-muted mt-0.5">Expand your preparation with new materials from the store.</p>
 </div>
 <Link href="/dashboard/store"className="shrink-0">
 <Button variant="outline"className="h-9 gap-2 text-sm">
 <ShoppingBag className="h-4 w-4"/>
 Browse Store
 </Button>
 </Link>
 </div>
 )}
 </div>
 )
}
