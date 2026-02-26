"use client"

import { useEffect, useState } from"react"
import Link from"next/link"
import { MaterialCard } from"@/components/features/MaterialCard"
import { Button } from"@/components/ui/button"
import { Badge } from"@/components/ui/badge"
import { ShoppingBag } from"lucide-react"
import api from"@/lib/api"
import { useAuth } from"@/context/AuthContext"

interface Order {
 id: string
 materialId: string
 status: string
 createdAt: string
 material?: {
 title: string
 price: number
 }
 package?: {
 title: string
 price: number
 }
 packageId?: string
}

export default function MaterialsPage() {
 const { user } = useAuth()
 const [materials, setMaterials] = useState<any[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
 if (user) {
 fetchOrders()
 }
 }, [user])

 const fetchOrders = async () => {
 try {
 const response = await api.get('/orders')
 const orders: Order[] = response.data

 // Transform orders to materials format for card
 const myItems = orders.map(order => {
 const isPackage = !!order.package
 return {
 id: isPackage ? order.packageId : order.materialId,
 title: isPackage ? order.package!.title : order.material!.title,
 purchasedDate: new Date(order.createdAt).toLocaleDateString(),
 isActive: order.status === 'COMPLETED',
 type: isPackage ? 'package' : 'material',
 }
 })

 setMaterials(myItems as any)
 } catch (error) {
 console.error("Failed to fetch orders", error)
 } finally {
 setIsLoading(false)
 }
 }

 if (isLoading) {
 return <div className="text-text-primary">Loading materials...</div>
 }

 return (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
 <div className="space-y-2">
 <div className="flex items-center gap-3">
 <h2 className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tighter">Authorized Vault</h2>
 <Badge className="bg-accent text-background border-accent/40 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
 Security: Active
 </Badge>
 </div>
 <p className="text-sm text-text-secondary font-medium">Access your premium purchased content within the encrypted environment.</p>
 </div>
 <Link href="/dashboard/store">
 <Button variant="outline"className="w-full md:w-auto h-11 bg-surface border-border text-text-secondary hover:bg-surface-raised hover:text-text-primary rounded-xl transition-all shadow-none">
 <ShoppingBag className="h-4 w-4 mr-2"/>
 Acquire More Materials
 </Button>
 </Link>
 </div>

 {materials.length > 0 ? (
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 {materials.map((material) => (
 <MaterialCard key={material.id} {...material} />
 ))}
 </div>
 ) : (
 <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border text-center">
 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface">
 <ShoppingBag className="h-10 w-10 text-text-muted"/>
 </div>
 <h3 className="mt-4 text-lg font-semibold text-text-primary">No materials found</h3>
 <p className="mt-2 text-sm text-text-secondary max-w-sm">
 You haven&apos;t purchased any materials yet. Visit the store to get started with your learning.
 </p>
 <Link href="/dashboard/store">
 <Button className="mt-6">Browse Store</Button>
 </Link>
 </div>
 )}
 </div>
 )
}
