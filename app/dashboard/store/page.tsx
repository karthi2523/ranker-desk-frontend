"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingBag, Star, ShieldCheck, ShoppingCart, Search,
    Loader2, BookOpen, ExternalLink, ShieldAlert, Package2, FileText
} from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"

interface Material {
    id: string
    title: string
    description: string
    price: number
    isActive: boolean
    type?: 'material'
}

interface Package {
    id: string
    title: string
    description: string
    price: number
    isActive: boolean
    type?: 'package'
}

export default function StorePage() {
    const router = useRouter()
    const { user } = useAuth()
    const [items, setItems] = useState<(Material | Package)[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => { fetchStoreItems() }, [])

    const fetchStoreItems = async () => {
        setError(null)
        setIsLoading(true)
        try {
            const [materialsRes, packagesRes] = await Promise.all([
                api.get('/materials'),
                api.get('/packages')
            ])
            const materialsWithType = materialsRes.data.map((m: any) => ({ ...m, type: 'material' }))
            const packagesWithType = packagesRes.data.map((p: any) => ({ ...p, type: 'package' }))
            setItems([...packagesWithType, ...materialsWithType])
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to connect to server'
            setError(`Could not load store items: ${msg}`)
        } finally {
            setIsLoading(false)
        }
    }

    const searchParams = useSearchParams()
    const searchString = searchParams.get('search')?.toLowerCase() || ""

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchString) ||
        item.description.toLowerCase().includes(searchString)
    )

    const handleBuy = (id: string, type: 'material' | 'package') => {
        router.push(`/dashboard/store/checkout/${id}?type=${type}`)
    }

    const handleDownloadDemo = (materialId: string) => {
        window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/materials/${materialId}/demo`, '_blank')
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="h-7 w-7 animate-spin text-[#c9a84c]" />
                <p className="text-[#4a5a70] text-sm">Loading study materials…</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-lg mx-auto py-16 text-center">
                <div className="h-14 w-14 rounded-xl bg-[#e05252]/10 border border-[#e05252]/20 flex items-center justify-center mx-auto mb-5">
                    <ShieldAlert className="h-7 w-7 text-[#e05252]" />
                </div>
                <h2 className="text-lg font-bold text-[#f0f2f5] mb-2">Connection Failed</h2>
                <p className="text-[#8a9bb0] text-sm mb-6">{error}</p>
                <Button onClick={fetchStoreItems} variant="outline">Try Again</Button>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-20 max-w-6xl">
            {/* Page Header */}
            <div className="pb-5 border-b border-[#1e2d45]">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-[#c9a84c]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#f0f2f5] tracking-tight">Study Store</h2>
                </div>
                <p className="text-sm text-[#8a9bb0] max-w-lg">
                    Premium, verified, and watermarked study materials for competitive government exams.
                    All purchases are instantly added to your vault.
                </p>
            </div>

            {/* Empty State */}
            {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#1e2d45] py-20 text-center">
                    <div className="h-12 w-12 rounded-xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center mx-auto mb-5">
                        <ShoppingBag className="h-6 w-6 text-[#4a5a70]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#f0f2f5] mb-2">Store is being updated</h3>
                    <p className="text-sm text-[#8a9bb0] max-w-xs mx-auto">
                        New materials are on their way. Please check back shortly.
                    </p>
                </div>
            )}

            {items.length > 0 && filteredItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#1e2d45] py-20 text-center">
                    <div className="h-12 w-12 rounded-xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center mx-auto mb-5">
                        <Search className="h-6 w-6 text-[#4a5a70]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#f0f2f5] mb-2">No matching materials</h3>
                    <p className="text-sm text-[#8a9bb0] max-w-xs mx-auto">
                        Your search for "{searchString}" did not match any items in the store.
                    </p>
                </div>
            )}

            {/* Store Grid */}
            {filteredItems.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredItems.map((item, idx) => (
                        <Card key={item.id} className="group flex flex-col hover:border-[#c9a84c]/30 transition-all duration-200">
                            {/* Thumbnail */}
                            <div className="aspect-[16/10] w-full bg-[#0a0e1a] relative flex items-center justify-center border-b border-[#1e2d45] overflow-hidden">
                                {item.type === 'package'
                                    ? <Package2 className="h-10 w-10 text-[#1e2d45] group-hover:text-[#c9a84c]/30 transition-colors duration-300" />
                                    : <FileText className="h-10 w-10 text-[#1e2d45] group-hover:text-[#c9a84c]/30 transition-colors duration-300" />
                                }
                                {/* Type + status badges */}
                                <div className="absolute top-3 right-3">
                                    {item.type === 'package' ? (
                                        <Badge>Bundle</Badge>
                                    ) : idx === 0 ? (
                                        <Badge variant="secondary" className="text-[#c9a84c] border-[#c9a84c]/30">Best Seller</Badge>
                                    ) : null}
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                                        {item.type === 'package' ? 'Bundle' : 'PDF'}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="space-y-1.5 pb-3">
                                <CardTitle className="text-sm font-bold text-[#f0f2f5] group-hover:text-[#c9a84c] transition-colors line-clamp-1 leading-snug">
                                    {item.title}
                                </CardTitle>
                                <p className="text-xs text-[#8a9bb0] leading-relaxed line-clamp-2 min-h-[32px]">
                                    {item.description}
                                </p>
                            </CardHeader>

                            <CardContent className="pt-0 pb-3">
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e1a] border border-[#1e2d45]">
                                    <div>
                                        <div className="text-[10px] font-bold text-[#4a5a70] uppercase tracking-wider">Price</div>
                                        <div className="text-xl font-extrabold text-[#f0f2f5]">₹{item.price}</div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#c9a84c]">
                                        <Star className="h-3.5 w-3.5 fill-current" />
                                        <span className="text-sm font-bold">4.9</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="mt-auto flex-col gap-3 pt-0 pb-6 px-4">
                                <div className="flex flex-col w-full gap-2">
                                    <Button
                                        onClick={() => handleBuy(item.id, item.type as 'material' | 'package')}
                                        className="w-full gap-2 h-10 text-sm font-bold bg-[#c9a84c] hover:bg-[#dbb95c] text-black"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Acquire Access
                                    </Button>

                                    {item.type === 'material' ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownloadDemo(item.id)}
                                            className="w-full h-8 text-[10px] font-bold text-[#8a9bb0] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 uppercase tracking-widest"
                                        >
                                            Preview Demo →
                                        </Button>
                                    ) : (
                                        <div className="h-8 flex items-center justify-center">
                                            <span className="text-[10px] font-semibold text-[#4a5a70] uppercase tracking-widest">
                                                Collection Module
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Security Banner */}
            <div className="rounded-xl border border-[#1e2d45] bg-[#111827] p-7 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-12 w-12 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-6 w-6 text-[#c9a84c]" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-[#f0f2f5] mb-1">Sovereign Security Protocol</h3>
                    <p className="text-xs text-[#8a9bb0] leading-relaxed max-w-2xl">
                        Every purchase is dynamically watermarked with your session signature and protected by RSA-2048 encryption.
                        Sharing or copying any material is strictly prohibited and traceable.
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                        {["Instant Vault Addition", "Anti-Copy Watermarking", "Multi-Factor Auth"].map(f => (
                            <div key={f} className="flex items-center gap-1.5 text-xs text-[#8a9bb0] font-medium">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
