"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, Calendar, DollarSign, Loader2, Plus, Ghost } from "lucide-react"
import api from "@/lib/api"

interface Material {
    id: string
    title: string
    description: string | null
    price: number
    demoPath: string | null
    createdAt: string
}

export default function AdminMaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchMaterials()
    }, [])

    const fetchMaterials = async () => {
        try {
            const response = await api.get('/materials')
            setMaterials(response.data)
        } catch (error) {
            console.error("Failed to fetch materials", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Asset Inventory</h2>
                    <p className="text-sm text-slate-400">View and manage all deployed intellectual assets.</p>
                </div>
                <Link href="/dashboard/upload">
                    <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg shadow-red-900/20">
                        <Plus className="h-4 w-4" />
                        Deploy New Asset
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {materials.map((material) => (
                    <Card key={material.id} className="border-red-900/20 bg-slate-900/50 backdrop-blur-md hover:border-red-500/30 transition-all group">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r border-red-900/10 flex items-center justify-center">
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-2xl bg-slate-950 flex items-center justify-center shadow-inner border border-slate-800">
                                            <FileText className="h-8 w-8 text-red-500/50" />
                                        </div>
                                        {material.demoPath && (
                                            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center" title="Demo Available">
                                                <Ghost className="h-3 w-3 text-emerald-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 md:flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">
                                            {material.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                                            {material.description || "No description provided for this sensitive asset."}
                                        </p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <Calendar className="h-3 w-3 text-red-500/50" />
                                                Seeded: {new Date(material.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                                                <DollarSign className="h-3 w-3" />
                                                Value: ₹{material.price}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="border-slate-800 hover:bg-slate-800 text-slate-400 gap-2 h-10"
                                            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/materials/${material.id}/demo`, '_blank')}
                                            disabled={!material.demoPath}
                                        >
                                            <Ghost className="h-4 w-4" />
                                            View Demo
                                        </Button>
                                        <Link href={`/vault/${material.id}`}>
                                            <Button className="bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2 h-10">
                                                <ExternalLink className="h-4 w-4" />
                                                Inspect
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {materials.length === 0 && (
                    <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
                        <FileText className="h-12 w-12 text-slate-700 mb-4" />
                        <h3 className="text-lg font-bold text-slate-400">Inventory Empty</h3>
                        <p className="text-slate-500 text-sm mt-1">No secure assets have been deployed yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
