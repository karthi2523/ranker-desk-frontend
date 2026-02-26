"use client"

import { useEffect, useState } from"react"
import { Badge } from"@/components/ui/badge"
import api from"@/lib/api"
import { useAuth } from"@/context/AuthContext"

interface Order {
 id: string
 materialId: string
 amount: number
 status: string
 createdAt: string
 material?: {
 title: string
 }
 package?: {
 title: string
 }
}

export function OrderTable() {
 const { user } = useAuth()
 const [orders, setOrders] = useState<Order[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
 if (user) {
 fetchOrders()
 }
 }, [user])

 const fetchOrders = async () => {
 try {
 const response = await api.get('/orders')
 setOrders(response.data)
 } catch (error) {
 console.error("OrderTable fetch error:", error)
 } finally {
 setIsLoading(false)
 }
 }

 if (isLoading) {
 return <div className="p-8 text-center text-text-muted">Loading order history...</div>
 }

 return (
 <div className="rounded-md border border-border bg-surface/50">
 <div className="relative w-full overflow-auto">
 <table className="w-full caption-bottom text-sm text-left">
 <thead className="[&_tr]:border-b [&_tr]:border-border">
 <tr className="border-b transition-colors hover:bg-surface/50 data-[state=selected]:bg-surface">
 <th className="h-12 px-4 align-middle font-medium text-text-secondary">Order ID</th>
 <th className="h-12 px-4 align-middle font-medium text-text-secondary">Material</th>
 <th className="h-12 px-4 align-middle font-medium text-text-secondary">Amount</th>
 <th className="h-12 px-4 align-middle font-medium text-text-secondary">Status</th>
 <th className="h-12 px-4 align-middle font-medium text-text-secondary">Date</th>
 </tr>
 </thead>
 <tbody className="[&_tr:last-child]:border-0">
 {orders.length > 0 ? (
 orders.map((order) => (
 <tr key={order.id} className="border-b border-border transition-colors hover:bg-surface/50 data-[state=selected]:bg-surface">
 <td className="p-4 align-middle font-medium text-indigo-400">#{order.id.substring(0, 8).toUpperCase()}</td>
 <td className="p-4 align-middle text-text-primary">{order.material?.title || order.package?.title}</td>
 <td className="p-4 align-middle text-text-secondary">₹{order.amount}</td>
 <td className="p-4 align-middle">
 <Badge variant={
 order.status ==="COMPLETED"?"success":
 order.status ==="FAILED"?"destructive":
"warning"
 }>
 {order.status}
 </Badge>
 </td>
 <td className="p-4 align-middle text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan={5} className="p-8 text-center text-text-muted">No orders found.</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 )
}
