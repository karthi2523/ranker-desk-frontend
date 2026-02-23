"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, DollarSign, Loader2, Plus, Ghost, ExternalLink } from "lucide-react"
import api from "@/lib/api"

interface Package {
    id: string
    title: string
    description: string | null
    price: number
    createdAt: string
}

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<Package[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        try {
            const response = await api.get('/packages')
            setPackages(response.data)
        } catch (error) {
            console.error("Failed to fetch packages", error)
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
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Package Management</h2>
                    <p className="text-sm text-slate-400">View and manage bundled asset packages.</p>
                </div>
                <Link href="/dashboard/packages/create">
                    <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg shadow-red-900/20">
                        <Plus className="h-4 w-4" />
                        Create New Package
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {packages.map((pkg) => (
                    <Link href={`/dashboard/packages/${pkg.id}`} key={pkg.id}>
                        <Card className="border-red-900/20 bg-slate-900/50 backdrop-blur-md hover:border-red-500/30 transition-all group cursor-pointer">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r border-red-900/10 flex items-center justify-center">
                                        <div className="h-16 w-16 rounded-2xl bg-slate-950 flex items-center justify-center shadow-inner border border-slate-800">
                                            <LayoutDashboard className="h-8 w-8 text-red-500/50" />
                                        </div>
                                    </div>

                                    <div className="p-6 md:flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">
                                                {pkg.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                                                {pkg.description || "No description provided for this package."}
                                            </p>
                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3 text-red-500/50" />
                                                    Created: {new Date(pkg.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                                                    <DollarSign className="h-3 w-3" />
                                                    Value: ₹{pkg.price}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional actions if needed. Could link to an edit page later. */}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {packages.length === 0 && (
                    <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
                        <LayoutDashboard className="h-12 w-12 text-slate-700 mb-4" />
                        <h3 className="text-lg font-bold text-slate-400">No Packages Found</h3>
                        <p className="text-slate-500 text-sm mt-1">Bundle some materials to create a package.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
