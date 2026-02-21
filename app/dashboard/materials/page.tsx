"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MaterialCard } from "@/components/features/MaterialCard"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface Order {
    id: string
    materialId: string
    status: string
    createdAt: string
    material: {
        title: string
        price: number
    }
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
            const myMaterials = orders.map(order => ({
                id: order.materialId,
                title: order.material.title,
                purchasedDate: new Date(order.createdAt).toLocaleDateString(),
                isActive: order.status === 'COMPLETED',
            }))

            setMaterials(myMaterials)
        } catch (error) {
            console.error("Failed to fetch orders", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="text-white">Loading materials...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">My Materials</h2>
                    <p className="text-sm text-slate-400">Access your purchased content securely.</p>
                </div>
                <Link href="/dashboard/store">
                    <Button variant="outline" className="w-full sm:w-auto gap-2 border-slate-700 text-slate-300">
                        <ShoppingBag className="h-4 w-4" />
                        Browse Store
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
                <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900">
                        <ShoppingBag className="h-10 w-10 text-slate-500" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">No materials found</h3>
                    <p className="mt-2 text-sm text-slate-400 max-w-sm">
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
