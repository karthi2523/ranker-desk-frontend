"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Loader2, Plus, ArrowRight, Layers, Trash2, Edit3, ShieldAlert, Save } from "lucide-react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/context/ToastContext"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
    const [isActionLoading, setIsActionLoading] = useState(false)

    // Deletion State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [packageToDelete, setPackageToDelete] = useState<Package | null>(null)

    // Edit State
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [packageToEdit, setPackageToEdit] = useState<Package | null>(null)
    const [editFormData, setEditFormData] = useState({
        title: "",
        price: "",
        description: ""
    })

    const { showToast } = useToast()

    useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        try {
            const response = await api.get('/packages')
            setPackages(response.data)
        } catch (error) {
            console.error("Failed to fetch packages", error)
            showToast("Failed to compile package registry", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeletePackage = async () => {
        if (!packageToDelete) return
        setIsActionLoading(true)
        try {
            await api.delete(`/packages/${packageToDelete.id}`)
            showToast(`Package "${packageToDelete.title}" purged successfully`, "success")
            setPackages(packages.filter(p => p.id !== packageToDelete.id))
            setDeleteModalOpen(false)
            setPackageToDelete(null)
        } catch (error: any) {
            showToast(error.response?.data?.message || "Purge operation failed", "error")
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleOpenEdit = (pkg: Package) => {
        setPackageToEdit(pkg)
        setEditFormData({
            title: pkg.title,
            price: pkg.price.toString(),
            description: pkg.description || ""
        })
        setEditModalOpen(true)
    }

    const handleUpdatePackage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!packageToEdit) return
        setIsActionLoading(true)
        try {
            const response = await api.patch(`/packages/${packageToEdit.id}`, {
                ...editFormData,
                price: parseFloat(editFormData.price)
            })
            showToast("Package details updated successfully", "success")
            setPackages(packages.map(p => p.id === packageToEdit.id ? response.data : p))
            setEditModalOpen(false)
            setPackageToEdit(null)
        } catch (error: any) {
            showToast(error.response?.data?.message || "Failed to update package", "error")
        } finally {
            setIsActionLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#e05252]" />
                <p className="text-xs font-black text-[#4a5a70] uppercase tracking-widest">Compiling Package Registry...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1e2d45]">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Layers className="h-6 w-6 text-[#e05252]" />
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Package Management</h2>
                    </div>
                    <p className="text-sm text-[#8a9bb0] font-medium">Configure and manage multi-asset study bundles on the marketplace.</p>
                </div>
                <Link href="/dashboard/packages/create">
                    <Button className="h-12 px-6 bg-[#e05252] hover:bg-[#ff6b6b] text-white font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-red-950/40 border-none transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Plus className="h-4 w-4" />
                        Assemble New Package
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {packages.map((pkg) => (
                    <Card key={pkg.id} className="group border-[#1e2d45] bg-[#0a0e1a] hover:border-[#e05252]/30 transition-all duration-300 overflow-hidden shadow-xl">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                {/* Visual Indicator */}
                                <div className="p-6 md:w-32 bg-slate-900/40 border-b md:border-b-0 md:border-r border-[#1e2d45]/50 flex items-center justify-center shrink-0">
                                    <div className="h-14 w-14 rounded-xl bg-[#0a0e1a] border border-[#1e2d45] flex items-center justify-center shadow-inner group-hover:border-[#e05252]/50 transition-colors">
                                        <Layers className="h-6 w-6 text-[#e05252]/60" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-black text-white group-hover:text-[#e05252] transition-colors uppercase tracking-tight truncate">
                                                {pkg.title}
                                            </h3>
                                            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0">Bundle</Badge>
                                        </div>
                                        <p className="text-xs text-[#8a9bb0] font-medium line-clamp-1 opacity-70">
                                            {pkg.description || "No description provided for this multi-asset package."}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 pt-3">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-[#4a5a70] uppercase tracking-widest">
                                                <Calendar className="h-3 w-3 text-[#e05252]/60" />
                                                Assembled: {new Date(pkg.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/20">
                                                <DollarSign className="h-3 w-3" />
                                                Bundle Value: ₹{pkg.price}
                                            </div>
                                            <div className="text-[9px] font-black text-[#4a5a70] uppercase tracking-widest">
                                                PKG-ID: {pkg.id.substring(0, 8)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link href={`/dashboard/packages/${pkg.id}`} className="flex-1 lg:flex-none">
                                            <Button className="w-full lg:w-auto h-10 bg-[#e05252]/10 border border-[#e05252]/30 text-[#e05252] hover:bg-[#e05252] hover:text-white transition-all gap-2 text-[10px] font-black uppercase tracking-widest px-6">
                                                Configure Assets
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => handleOpenEdit(pkg)}
                                            variant="outline"
                                            className="h-10 w-10 p-0 border-[#1e2d45] text-slate-500 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setPackageToDelete(pkg);
                                                setDeleteModalOpen(true);
                                            }}
                                            variant="outline"
                                            className="h-10 w-10 p-0 border-[#1e2d45] text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {packages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[300px] rounded-2xl border-2 border-dashed border-[#1e2d45] bg-[#0a0e1a]/50">
                        <Layers className="h-10 w-10 text-[#1e2d45] mb-4" />
                        <h3 className="text-lg font-black text-[#8a9bb0] uppercase tracking-tighter">No Packages</h3>
                        <p className="text-xs text-[#4a5a70] font-bold mt-1">Multi-asset bundles allow for high-value strategic deployments.</p>
                        <Link href="/dashboard/packages/create" className="mt-6">
                            <Button className="bg-[#e05252] text-white font-black uppercase text-[10px] tracking-widest h-10 px-8">Assemble First Package</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => !isActionLoading && setDeleteModalOpen(false)}
                title="Package Dissolution Authorization"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <ShieldAlert className="h-5 w-5 text-red-500" />
                        </div>
                        <p className="text-xs font-bold text-red-400 leading-relaxed uppercase tracking-tight">
                            Warning: You are about to dissolve bundle <span className="text-white underline">{packageToDelete?.title}</span>. This will revoke future acquisitions but preserve historical orders.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            disabled={isActionLoading}
                            onClick={() => setDeleteModalOpen(false)}
                            variant="ghost"
                            className="flex-1 h-11 text-[10px] font-black uppercase tracking-[0.2em] text-[#4a5a70] hover:text-white"
                        >
                            Abort
                        </Button>
                        <Button
                            disabled={isActionLoading}
                            onClick={handleDeletePackage}
                            className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-950/20"
                        >
                            {isActionLoading ? "Dissolving..." : "Confirm Dissolution"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => !isActionLoading && setEditModalOpen(false)}
                title="Modify Bundle Configuration"
            >
                <form onSubmit={handleUpdatePackage} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest">Package Title</Label>
                        <Input
                            value={editFormData.title}
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                            placeholder="Enter package name"
                            className="bg-slate-900/50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest">Bundle Valuation (₹)</Label>
                        <Input
                            type="number"
                            value={editFormData.price}
                            onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                            placeholder="Set package price"
                            className="bg-slate-900/50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-[#4a5a70] uppercase tracking-widest">Bundle Overview</Label>
                        <Textarea
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            placeholder="Describe the strategic value of this bundle..."
                            className="bg-slate-900/50 resize-none h-32"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <Button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => setEditModalOpen(false)}
                            variant="ghost"
                            className="flex-1 h-11 text-[10px] font-black uppercase tracking-[0.2em] text-[#4a5a70] hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isActionLoading}
                            className="flex-1 h-11 bg-[#c9a84c] hover:bg-[#dbb95c] text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gold-950/20"
                        >
                            {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Configuration
                            </>}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
