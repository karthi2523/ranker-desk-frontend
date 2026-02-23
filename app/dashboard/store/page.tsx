"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, ShieldCheck, ShoppingCart, Loader2, Sparkles, BookOpen, ExternalLink, ShieldAlert } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Material {
    id: string
    title: string
    description: string
    price: number
    isActive: boolean
    type?: 'material' // Added type definition to differentiate
}

interface Package {
    id: string
    title: string
    description: string
    price: number
    isActive: boolean
    type?: 'package' // Added type to differentiate
}

export default function StorePage() {
    const router = useRouter()
    const { user } = useAuth()
    const [items, setItems] = useState<(Material | Package)[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchStoreItems()
    }, [])

    const fetchStoreItems = async () => {
        try {
            const [materialsRes, packagesRes] = await Promise.all([
                api.get('/materials'),
                api.get('/packages')
            ])

            const materialsWithType = materialsRes.data.map((m: any) => ({ ...m, type: 'material' }))
            const packagesWithType = packagesRes.data.map((p: any) => ({ ...p, type: 'package' }))

            // Interleave or combine them. Here we just concatenate.
            setItems([...packagesWithType, ...materialsWithType])
        } catch (err: any) {
            console.error("Store fetch error:", err)
            const msg = err.response?.data?.message || err.message || 'Failed to connect to server'
            setError(`Could not load store items: ${msg}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBuy = (id: string, type: 'material' | 'package') => {
        router.push(`/dashboard/store/checkout/${id}?type=${type}`)
    }

    const handleDownloadDemo = (materialId: string) => {
        window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/materials/${materialId}/demo`, '_blank')
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                <p className="text-slate-400 font-medium animate-pulse">Curating premium content...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6 max-w-2xl mx-auto py-12">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-sm">
                    <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Connection Issues</h2>
                    <p className="text-red-400/80 mb-6">{error}</p>
                    <Button onClick={fetchStoreItems} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                        Try reconnecting
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-10 backdrop-blur-md">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-600/10 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl space-y-4 text-center md:text-left">
                        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-2 px-3 py-1">
                            <Sparkles className="h-3.5 w-3.5 mr-2" />
                            Premium Education
                        </Badge>
                        <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                            The Elite <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Vault</span>
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Access top-tier, secure investigation and preparation materials
                            specifically curated for competitive government excellence.
                        </p>
                    </div>
                    <div className="hidden lg:flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl rotate-3 transition-transform hover:rotate-0">
                        <BookOpen className="h-16 w-16 text-indigo-500" />
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {items.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 p-20 text-center">
                    <ShoppingBag className="h-16 w-16 text-slate-700 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Vault is currently sealed</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Our premium materials and packages are being updated for the latest standards.
                        Please check back soon for new additions.
                    </p>
                </div>
            )}

            {/* Grid Layout */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, idx) => (
                    <Card key={item.id} className="group relative flex flex-col border-slate-800 bg-slate-900/40 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)] backdrop-blur-md overflow-hidden">
                        {/* Status Badge */}
                        {item.type === 'package' && (
                            <div className="absolute top-4 right-4 z-20">
                                <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 font-bold backdrop-blur-md">
                                    PACKAGE DEAL
                                </Badge>
                            </div>
                        )}
                        {idx === 0 && item.type !== 'package' && (
                            <div className="absolute top-4 right-4 z-20">
                                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 font-bold backdrop-blur-md">
                                    BEST SELLER
                                </Badge>
                            </div>
                        )}

                        {/* Interactive Thumbnail */}
                        <div className="aspect-[16/10] w-full bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-slate-800">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-slate-900 to-slate-950 transition-opacity group-hover:opacity-70" />

                            {/* Abstract Decorative Circle */}
                            <div className="absolute h-32 w-32 rounded-full border border-indigo-500/10 scale-0 group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100" />

                            <div className="relative z-10 p-6 transition-transform duration-500 group-hover:scale-110">
                                <ShoppingBag className="h-16 w-16 text-indigo-500/30 animate-pulse" />
                            </div>

                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <Badge variant="secondary" className="bg-slate-900/80 text-xs font-medium border-slate-700 backdrop-blur-sm">
                                    {item.type === 'package' ? 'BUNDLE' : 'PDF CONTENT'}
                                </Badge>
                            </div>
                        </div>

                        <CardHeader className="space-y-3 pb-4">
                            <CardTitle className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                                {item.title}
                            </CardTitle>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2 min-h-[40px]">
                                {item.description}
                            </p>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800 group-hover:border-indigo-500/20 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price</span>
                                    <span className="text-2xl font-extrabold text-white">₹{item.price}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center text-amber-400 gap-1 font-bold">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span>4.9</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500">(1.2k+ sales)</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="mt-auto pt-4 flex-col gap-3">
                            <div className="flex w-full items-center justify-center gap-1.5 py-1">
                                {item.type === 'material' && (
                                    <>
                                        <Sparkles className="h-3 w-3 text-indigo-400" />
                                        <button
                                            onClick={() => handleDownloadDemo(item.id)}
                                            className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors underline decoration-indigo-500/30 underline-offset-4"
                                        >
                                            Click here for demo preview
                                        </button>
                                    </>
                                )}
                                {item.type === 'package' && (
                                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                        Multiple Assets Included
                                    </span>
                                )}
                            </div>

                            <div className="flex w-full gap-3">
                                <Button
                                    onClick={() => handleBuy(item.id, item.type as 'material' | 'package')}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 relative overflow-hidden group/btn shadow-lg shadow-indigo-600/20"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <ShoppingCart className="h-4 w-4" />
                                        Acquire Access
                                    </span>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-400/50 translate-y-1 transition-transform group-hover/btn:translate-y-0" />
                                </Button>

                                {item.type === 'material' && (
                                    <Button
                                        variant="outline"
                                        className="border-slate-700 hover:bg-slate-800 text-slate-400 group/demo px-4"
                                        onClick={() => handleDownloadDemo(item.id)}
                                        title="View Demo PDF"
                                    >
                                        <ExternalLink className="h-4 w-4 transition-transform group-hover/demo:scale-110" />
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Premium Security Block */}
            <div className="group relative rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-slate-950 p-1 bg-emerald-500/5 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative rounded-[calc(1.5rem-1px)] bg-slate-950 p-10 md:p-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="flex-shrink-0 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
                            <ShieldCheck className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                Sovereign Security Protocol
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active Protection</Badge>
                            </h3>
                            <p className="text-slate-400 text-lg leading-relaxed lg:max-w-3xl">
                                Every acquisition is secured via our proprietary vault system.
                                Distributed content is dynamically watermarked with session signatures
                                and protected by RSA-2048 encryption standards. Your preparation is our mission.
                            </p>
                            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Instant Vault Addition
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Anti-Copy Watermarking
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Multi-Factor Auth Support
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

