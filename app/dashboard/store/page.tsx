"use client"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingBag, Star, ShieldCheck, ShoppingCart, Search,
    Loader2, BookOpen, ExternalLink, ShieldAlert, Package2, FileText, Sparkles, Info
} from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { Modal } from "@/components/ui/modal"

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
    thumbnail?: string
    type?: 'package'
    packageFiles?: { id: string, displayName: string, mimeType: string }[]
}

function StoreContent() {
    const router = useRouter()
    const { user } = useAuth()
    const [items, setItems] = useState<(Material | Package)[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [detailsItem, setDetailsItem] = useState<(Material | Package) | null>(null)
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

                            {/* Static Thumbnail */}
                            <div className="h-[200px] w-full bg-background flex items-center justify-center relative overflow-hidden">
                                {item.type === 'package' ? (
                                    item.thumbnail ? (
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}`.replace(/\/api\/?$/, '') + item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <Package2 className="h-16 w-16 text-text-muted" />
                                    )
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
                                        Preview Material &rarr;
                                    </button>
                                ) : (
                                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 w-full text-center">
                                        Complete Bundle
                                    </div>
                                )}

                                <div className="flex w-full gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setDetailsItem(item)}
                                        className="flex-1 border-border text-text-primary hover:bg-accent/5 font-bold h-11 rounded-lg transition-all"
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        onClick={() => handleBuy(item.id, item.type as 'material' | 'package')}
                                        className="flex-1 bg-accent hover:bg-accent-hover text-background font-black h-11 rounded-lg transition-all"
                                    >
                                        <span className="flex items-center justify-center gap-2 tracking-tight text-sm">
                                            <ShoppingCart className="h-4 w-4" />
                                            Buy
                                        </span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Removed Premium Security Block */}

            {/* Premium Details Modal */}
            <Modal
                isOpen={!!detailsItem}
                onClose={() => setDetailsItem(null)}
                title=""
                hideHeader={true}
                className="max-w-2xl bg-surface backdrop-blur-xl border border-border p-0 overflow-hidden shadow-2xl"
            >
                {detailsItem && (
                    <div className="flex flex-col max-h-[85vh]">
                        {/* Header Banner */}
                        <div className="relative h-48 w-full bg-surface shrink-0">
                            {detailsItem.type === 'package' && (detailsItem as Package).thumbnail ? (
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}`.replace(/\/api\/?$/, '') + (detailsItem as Package).thumbnail} 
                                    alt={detailsItem.title} 
                                    className="w-full h-full object-cover opacity-60"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-accent/20 to-background flex items-center justify-center">
                                    <Sparkles className="w-12 h-12 text-accent/50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
                            
                            <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                                <div className="space-y-2">
                                    <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] px-3 py-1 uppercase tracking-widest backdrop-blur-md shadow-sm">
                                        {detailsItem.type === 'package' ? 'Premium Bundle' : 'Premium Material'}
                                    </Badge>
                                    <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight drop-shadow-sm">
                                        {detailsItem.title}
                                    </h2>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 drop-shadow-sm">Total Price</span>
                                    <span className="text-3xl font-black text-text-primary drop-shadow-sm">₹{detailsItem.price}</span>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            
                            {/* Description */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-accent" />
                                    <h4 className="text-xs font-black text-text-primary uppercase tracking-widest">About this {detailsItem.type === 'package' ? 'Bundle' : 'Material'}</h4>
                                </div>
                                <div className="p-5 rounded-2xl bg-surface-raised border border-border backdrop-blur-sm shadow-sm">
                                    <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                                        {detailsItem.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            {/* Package Contents */}
                            {detailsItem.type === 'package' && (detailsItem as Package).packageFiles && ((detailsItem as Package).packageFiles!.length > 0) && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Package2 className="w-4 h-4 text-accent" />
                                        <h4 className="text-xs font-black text-text-primary uppercase tracking-widest">Included Contents</h4>
                                    </div>
                                    <div className="grid gap-2">
                                        {(detailsItem as Package).packageFiles!.map(file => {
                                            // Clean up ugly UUIDs from filenames if present
                                            const cleanName = file.displayName.replace(/_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i, '');
                                            return (
                                                <div key={file.id} className="group flex items-center gap-4 p-3 px-4 rounded-xl bg-background border border-border hover:border-accent transition-colors shadow-sm">
                                                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                                        <FileText className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                                                    </div>
                                                    <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate">
                                                        {cleanName}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="shrink-0 p-6 bg-surface border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                            <Button
                                onClick={() => {
                                    handleBuy(detailsItem.id, detailsItem.type as 'material' | 'package')
                                    setDetailsItem(null)
                                }}
                                className="w-full h-14 bg-accent hover:bg-accent-hover text-background font-black text-sm uppercase tracking-widest shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all hover:-translate-y-0.5 rounded-xl"
                            >
                                <ShoppingCart className="h-5 w-5 mr-3" /> Secure This {detailsItem.type === 'package' ? 'Bundle' : 'Material'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
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
