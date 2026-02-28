"use client"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingBag, Star, ShieldCheck, ShoppingCart, Search,
    Loader2, BookOpen, ExternalLink, ShieldAlert, Package2, FileText, Sparkles
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

function StoreContent() {
    const router = useRouter()
    const { user } = useAuth()
    const [items, setItems] = useState<(Material | Package)[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const searchParams = useSearchParams()

    useEffect(() => {
        fetchStoreItems()
    }, [])

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
        } catch (error: any) {
            console.error("Store fetch error:", error)
            const msg = error.response?.data?.message || error.message || 'Failed to connect to server'
            setError(`Could not load store items: ${msg}`)
        } finally {
            setIsLoading(false)
        }
    }

    const searchString = searchParams.get('search')?.toLowerCase() || ""

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchString) ||
        item.description.toLowerCase().includes(searchString)
    )

    const handleBuy = (id: string, type: 'material' | 'package') => {
        router.push(`/dashboard/store/checkout/${id}?type=${type}`)
    }

    const handleDownloadDemo = (materialId: string) => {
        window.open(`/api/materials/${materialId}/demo`, '_blank')
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-text-secondary font-medium animate-pulse">Curating premium content...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto py-12">
                <div className="rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center">
                    <ShieldAlert className="h-12 w-12 text-accent mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Connection Issues</h2>
                    <p className="text-accent mb-6">{error}</p>
                    <Button onClick={fetchStoreItems} variant="outline" className="border-accent/30 text-accent hover:bg-accent/10">
                        Try reconnecting
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                        Study Store
                    </h2>
                </div>
                <p className="text-sm text-text-secondary max-w-lg mt-1">
                    Premium, verified, and watermarked study materials for competitive
                    government exams. All purchases are instantly added to your vault.
                </p>
            </div>

            {/* Empty States */}
            {items.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border bg-surface p-20 text-center">
                    <ShoppingBag className="h-16 w-16 text-text-muted mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-text-primary mb-2">Vault is currently sealed</h3>
                    <p className="text-text-muted max-w-md mx-auto">
                        Our premium materials and packages are being updated for the latest standards.
                        Please check back soon for new additions.
                    </p>
                </div>
            )}

            {items.length > 0 && filteredItems.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border bg-surface p-20 text-center">
                    <Search className="h-16 w-16 text-text-muted mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-text-primary mb-2">No matching materials</h3>
                    <p className="text-text-muted max-w-md mx-auto">
                        Your search for"{searchString}"did not match any items in the Elite Vault.
                    </p>
                </div>
            )}

            {/* Store Grid */}
            {filteredItems.length > 0 && (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item, idx) => (
                        <Card key={item.id} className="group relative flex flex-col border-border bg-surface overflow-hidden shadow-none rounded-2xl">
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-20">
                                {item.type === 'package' ? (
                                    <Badge className="bg-accent/5 text-accent border-accent/30 text-[10px] px-2 py-0 uppercase">
                                        PACKAGE
                                    </Badge>
                                ) : idx === 0 ? (
                                    <Badge className="bg-accent/5 text-accent border-accent/30 text-[10px] px-2 py-0 uppercase">
                                        BEST SELLER
                                    </Badge>
                                ) : null}
                            </div>

                            {/* Type Indicator */}
                            <div className="absolute top-[160px] left-4 z-20">
                                <Badge variant="secondary" className="bg-surface-raised/80 text-[9px] font-bold border-border text-text-secondary uppercase">
                                    {item.type === 'package' ? 'BUNDLE' : 'PDF'}
                                </Badge>
                            </div>

                            {/* Interactive Thumbnail */}
                            <div className="h-[200px] w-full bg-background flex items-center justify-center">
                                {item.type === 'package' ? (
                                    <Package2 className="h-16 w-16 text-text-muted" />
                                ) : (
                                    <FileText className="h-16 w-16 text-text-muted" />
                                )}
                            </div>

                            <CardHeader className="space-y-2 pb-2 mt-2">
                                <CardTitle className="text-base font-bold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
                                    {item.title}
                                </CardTitle>
                                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 min-h-[32px]">
                                    {item.description}
                                </p>
                            </CardHeader>

                            <CardContent className="pt-2 pb-4">
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-tight">Price</span>
                                        <span className="text-2xl font-black text-text-primary">₹{item.price}</span>
                                    </div>
                                    <div className="flex flex-col items-end justify-end h-full pt-3">
                                        <div className="flex items-center text-accent gap-1 text-xs font-black">
                                            <Star className="h-3.5 w-3.5 fill-accent" />
                                            <span>4.9</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="mt-auto pt-0 pb-6 flex-col">
                                {item.type === 'material' ? (
                                    <button
                                        onClick={() => handleDownloadDemo(item.id)}
                                        className="text-[10px] font-bold text-accent hover:text-accent uppercase tracking-widest transition-colors mb-3 w-full text-center"
                                    >
                                        PREVIEW DEMO &rarr;
                                    </button>
                                ) : (
                                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 w-full text-center">
                                        MULTIPLE ASSETS BUNDLE
                                    </div>
                                )}

                                <div className="flex w-full gap-3">
                                    <Button
                                        onClick={() => handleBuy(item.id, item.type as 'material' | 'package')}
                                        className="flex-1 bg-accent hover:bg-accent-hover text-background font-black h-11 rounded-lg transition-all"
                                    >
                                        <span className="flex items-center justify-center gap-2 tracking-tight text-sm">
                                            <ShoppingCart className="h-4 w-4" />
                                            Acquire Access
                                        </span>
                                    </Button>

                                    {item.type === 'material' && (
                                        <Button
                                            variant="outline"
                                            className="border-border bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary px-0 w-11 h-11 rounded-lg shrink-0 transition-colors"
                                            onClick={() => handleDownloadDemo(item.id)}
                                            title="View Demo PDF"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Removed Premium Security Block */}
        </div>
    )
}

export default function StorePage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-text-secondary font-medium animate-pulse">Curating premium content...</p>
            </div>
        }>
            <StoreContent />
        </Suspense>
    )
}
